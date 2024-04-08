import React, { createContext, useEffect, useState, useCallback, ReactNode, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { ServerToClientEvents, ClientToServerEvents } from '../../interfaces/socket';
import { resetGeminiState } from '../../store/pairedContent';

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
    const dispatch = useAppDispatch();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [error, setError] = useState<string | null>(null);

    // console.log('Socket Provider Updated Location', location);

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

            console.log('Creating new socket', newSocket);

            newSocket.connect(); // Manually connect

            newSocket.on('connect', () => {
                console.log('Socket connected', newSocket);
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
                console.log('Running disconnect cleanup function.');
                socket.emit('user_leaving', { userId: user?.id });
                socket.disconnect();
                dispatch(resetGeminiState());
            }
        };

        // Call disconnectOnLeave when the component unmounts
        return disconnectOnLeave;
    }, [socket, user?.id]); // Re-run this effect if socket or user ID changes

    // Disconnect based on specific route changes
    useEffect(() => {
        if (location) {
            if (!location.includes('/code-collab')) {
                if (socket) {
                    socket.emit('user_leaving', { userId: user?.id });
                    socket.disconnect();
                    dispatch(resetGeminiState());
                    console.log('Disconnecting user from socket due to route change...');
                } else {
                    console.log('No existing socket, disconnect not necessary.');
                }
            }
        }
    }, [location]);

    return <SocketContext.Provider value={{ socket, error, connectSocket }}>{children}</SocketContext.Provider>;
};
