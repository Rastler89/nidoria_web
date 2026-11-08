'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client'; 
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth';

type AdminState = {
    migrationStatus: string | null;
    isLoading: boolean;
    error: string | null;
};

export default function AdminPage() {
    const { toast } = useToast();
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [state, setState] = useState<AdminState>({
        migrationStatus: null,
        isLoading: false,
        error: null,
    });

    // --- Handlers ---

    const handleCheckMigration = useCallback(async () => {
        if (!isAdmin) return;
        setState(s => ({ ...s, isLoading: true, error: null }));
        try {
            const response = await api.getMigrationStatus();
            setState(s => ({ ...s, migrationStatus: response.status }));
        } catch (err) {
            console.error("Error checking migration status:", err);
            setState(s => ({ ...s, error: "Failed to check status." }));
        } finally {
            setState(s => ({ ...s, isLoading: false }));
        }
    }, [isAdmin, toast]);

    const handleResetDB = async () => {
        if (!window.confirm("⚠️ ADVERTENCIA: ¿ESTÁS SEGURO? Esto BORRARÁ TODA LA BASE DE DATOS Y RECONSTRUIRÁ EL SISTEMA. Este es un proceso IRREVERSIBLE.")) return;

        setState(s => ({ ...s, isLoading: true, error: null }));
        try {
            const response = await api.resetDatabase();
            toast({
                title: "✅ Éxito",
                description: response.message,
                variant: "default",
            });
            setState(s => ({ ...s, isLoading: false }));
        } catch (err) {
            console.error("Error resetting DB:", err);
            const message = err instanceof Error ? err.message : "Un error desconocido ocurrió.";
            toast({
                title: "❌ Error Grave",
                description: message,
                variant: "destructive",
            });
            setState(s => ({ ...s, isLoading: false, error: message }));
        }
    };

    const handleEnableUser = async (userId: string) => {
        if (!window.confirm(`🚨 ¿HACER ACCESO A USUARIO ${userId}? Esta acción lo habilita en el sistema.`)) return;
        
        try {
            const response = await api.enableUser(userId);
            toast({
                title: "🎉 Éxito",
                description: response.message,
                variant: "default",
            });
        } catch (err) {
            console.error(`Error enabling user ${userId}:`, err);
            const message = err instanceof Error ? err.message : "Un error desconocido ocurrió.";
            toast({
                title: "❌ Error",
                description: message,
                variant: "destructive",
            });
        }
    };
    
    if (!isAdmin) {
        return (
            <div className="p-8 max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold mb-4">Acceso Denegado</h1>
                <p className="text-lg text-red-500">Debes ser un administrador con permisos especiales para acceder a este panel.</p>
                <Link href="/dashboard" className="inline-block mt-8 text-blue-500 hover:underline">Volver al Dashboard</Link>
            </div>
        );
    }

    // Mock list of users for demonstration purposes only (In a real app, this comes from /api/users)
    const mockUsers = [
        { id: '1', username: 'admin_rastler89', email: 'rastler89@gmail.com', isActive: true },
        { id: '2', username: 'inactive_user_a', email: 'user_a@test.com', isActive: false },
        { id: '3', username: 'inactive_user_b', email: 'user_b@test.com', isActive: false },
    ];

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-8 text-gray-900">⚙️ Panel de Administración Nidoria</h1>
            
            <div className="flex space-x-6">
                {/* 1. Módulo de Bases de Datos */}
                <div className="flex-1 space-y-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>🔧 Gestión de la Base de Datos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            
                            <div>
                                <p className='text-sm text-gray-500 mb-2'>Estado de Migración Actual:</p>
                                <Alert className={state.error ? 'bg-red-50/50' : state.migrationStatus ? 'bg-green-50/50' : 'bg-yellow-50/50'}>
                                    <AlertTitle className='text-lg'>Estado DB</AlertTitle>
                                    <AlertDescription>{state.error ?? state.migrationStatus ?? 'Cargando...'}</AlertDescription>
                                </Alert>
                                <Button onClick={handleCheckMigration} disabled={state.isLoading}>
                                    {state.isLoading ? 'Verificando...' : 'Actualizar Estado de Migración'}
                                </Button>
                            </div>


                            <Separator className="my-4" />

                            <h2 className="text-xl font-semibold pt-4">🚨 Operaciones de Reseteo (Destructivo)</h2>
                            <Alert variant="destructive">
                                <AlertTitle>¡PELIGRO MÁXIMO!</AlertTitle>
                                <AlertDescription>
                                    Ejecutar esta acción borrará la base de datos, migraciones y resemeará el sistema. ¡Confirma la operación!
                                </AlertDescription>
                            </Alert>
                            <Button 
                                onClick={handleResetDB} 
                                className="w-full bg-red-600 hover:bg-red-700"
                                disabled={state.isLoading}
                            >
                                {state.isLoading ? 'Procesando Reseteo...' : '🗑️ WIPE & REBUILD DB'}
                            </Button>
                        </CardContent>
                    </Card>
                    
                    {/* 2. Módulo de Usuarios */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>👥 Gestión de Cuentas de Usuario</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className='text-sm text-gray-500'>Activa usuarios que están en estado inactivo (isActive: false).</p>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-left text-sm text-gray-500 uppercase">
                                            <th className='p-3'>ID</th>
                                            <th className='p-3'>Usuario</th>
                                            <th className='p-3'>Email</th>
                                            <th className='p-3'>Estado</th>
                                            <th className='p-3'>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockUsers.map(user => (
                                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                                <td className="p-3">{user.id}</td>
                                                <td className="p-3">{user.username}</td>
                                                <td className="p-3 text-sm">{user.email}</td>
                                                <td className={`p-3 font-semibold ${user.isActive ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    {user.isActive ? '🟢 Habilitado' : '🟡 Inactivo'}
                                                </td>
                                                <td className="p-3 text-right">
                                                    {!user.isActive && (
                                                        <Button 
                                                            onClick={() => handleEnableUser(user.id)}
                                                            className="bg-green-600 hover:bg-green-700 text-sm"
                                                        >
                                                            Habilitar
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}