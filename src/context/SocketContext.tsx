// context/SocketContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/lib/auth';
import { toast } from '@/components/ui/use-toast';

interface SocketState {
    socket: Socket | null;
    data: any | null; // Aquí guardaremos los recursos globales
    isConnected: boolean;
}

const SocketContext = createContext<SocketState>({
    socket: null,
    data: null,
    isConnected: false
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const dbHost = process.env.NEXT_PUBLIC_DB_HOST || 'http://localhost:4000'
    const { token, user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [data, setData] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!token) return;
        const newSocket = io(dbHost, {
            auth: { token: token },
            transports: ['websocket'],
            reconnectionAttempts: 5,
            timeout: 10000
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
        })

        newSocket.on('connect_error', (err) => {
            setIsConnected(false);
            toast({
                variant: "destructive",
                title: "Error de conexión",
                description: "No se pudo establecer comunicación con el hormiguero.",
            });
            console.error('Error de conexión:', err.message);
        });

        newSocket.on('anthill_update', (updatedData) => {
            setData((prev: any) => ({ ...prev, ...updatedData }));
            localStorage.setItem('nidoria_cache', JSON.stringify(data));
            toast({
                title: "Actualización de la colonia",
                description: "Se han recibido nuevos datos del hormiguero.",
            })
        });

        newSocket.on('disconnect', (reason) => {
            setIsConnected(false);
            if (reason === 'io server disconnect') {
                newSocket.connect();
            }
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [token]);

    return (
        <SocketContext.Provider value={{ socket, data, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);