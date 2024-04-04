import React, { createContext, useEffect, useState, useCallback, ReactNode, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '../../hooks';
import { ServerToClientEvents, ClientToServerEvents } from '../../interfaces/socket';

interface SocketContextProps {
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
    connectSocket: () => void; // Method to initiate the connection
    error?: string | null;
}

interface SocketProviderProps {
    children: ReactNode;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const user = useAppSelector((state) => state.session.user);
    const location = useAppSelector((state) => state.userPath.currentPath);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [error, setError] = useState<string | null>(null);

    console.log('Socket Provider Updated Location', location);

    const connectSocket = useCallback(() => {
        if (user && user.id && !socket) {
            const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 2000,
                reconnectionDelayMax: 5000,
                autoConnect: false, // Change to false to not auto-connect on instantiation
            });

            newSocket.connect(); // Manually connect

            newSocket.on('connect', () => {
                console.log('Socket connected');
                setError(null);
            });

            newSocket.on('custom_error', (error) => {
                console.error('Socket error:', error);
                setError(error.error);
            });

            newSocket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
                setSocket(null);
            });

            setSocket(newSocket);
        }
    }, [user, socket]);

    useEffect(() => {
        // Define a cleanup function that disconnects the socket
        const disconnectOnLeave = () => {
            if (socket) {
                console.log('Disconnecting due to route change');
                socket.emit('user_leaving', { userId: user?.id });
                socket.disconnect();
            }
        };

        // Call disconnectOnLeave when the component unmounts
        return disconnectOnLeave;
    }, [socket, user?.id]); // Re-run this effect if socket or user ID changes

    // Additionally, you can watch for specific route changes
    useEffect(() => {
        // You can also place disconnect logic here if you want to
        // disconnect based on specific route changes
        console.log('Route changed to', location);
        // For example, if leaving the /code-collab route:
        if (location) {
            if (!location.includes('/code-collab')) {
                socket?.disconnect();
                console.log('🙄😶🙄😪😪😫😏😏 PROPERLY DISCONNECTED🙄😶🙄😪😪😫😏😏 PROPERLY DISCONNECTED');
            }
        }
    }, [location]);

    // Adjust useEffect to handle cleanup only, remove socket instantiation logic from here
    // useEffect(() => {
    //     window.addEventListener('beforeunload', () => {
    //         if (socket) {
    //             socket.emit('user_leaving', { userId: user?.id });
    //             console.log('🙄😶😶🙄🙄 USER DISCONNECTED');
    //             socket.disconnect();
    //         }
    //     });

    //     return () => {
    //         if (socket) {
    //             socket.emit('user_leaving', { userId: user?.id });
    //             console.log('🙄😶😶🙄🙄 USER DISCONNECTED');
    //             socket.disconnect();
    //         }
    //     };
    // }, [socket, user]);

    return <SocketContext.Provider value={{ socket, error, connectSocket }}>{children}</SocketContext.Provider>;
};
