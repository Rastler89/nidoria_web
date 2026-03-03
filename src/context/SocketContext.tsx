// context/SocketContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/lib/auth';
import { toast } from '@/components/ui/use-toast';

interface SocketState {
    socket: Socket | null;
    data: any | null; // Aquí guardaremos los recursos globales
}

const SocketContext = createContext<SocketState>({ socket: null, data: null });

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const dbHost = process.env.NEXT_PUBLIC_DB_HOST || 'http://localhost:4000'
    const { token, user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (!token) return;
        const newSocket = io(dbHost, {
            auth: { token: token },
            transports: ['websocket']
        });

        newSocket.on('anthill_update', (updatedData) => {
            setData((prev: any) => ({ ...prev, ...updatedData }));
            toast({
                title: "Actualización de la colonia",
                description: "Se han recibido nuevos datos del hormiguero.",
            })
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [token]);

    return (
        <SocketContext.Provider value={{ socket, data }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);