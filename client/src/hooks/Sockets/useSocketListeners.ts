// useSocketListeners.ts
import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useAppDispatch } from '..';
import { clearUser, receiveUser } from '../../store/chatRoom';
import { UserDict } from '../../interfaces/socket';
import config from '../../AgoraManager/config';
import { User } from '../../interfaces/user';

const useSocketListeners = (
    socket: Socket | null,
    channelName: string | null,
    setChannelName: React.Dispatch<React.SetStateAction<string>>,
    setJoined: React.Dispatch<React.SetStateAction<boolean>>,
    user: User | null
) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!socket) return;
        console.log('UseSocketListeners - Socket Exists', socket);
        socket.emit('join_room');
        socket.on('joined', (data: { room: string; users: UserDict[] }) => {
            console.log('Socket listening to "Joined"', data);
            if (!config.channelName) {
                console.log('Config has no channel name');
                setChannelName(data.room);
            }
            if (data.users.length > 1) {
                console.log('There is more than one user, a pair.');
                const pair = data.users.find((pair) => pair.id !== user?.id);
                if (pair) {
                    dispatch(receiveUser(pair as UserDict));
                }
            }
            console.log(`Setting channelName to ${data.room} and setting joined to true`);
            setChannelName(data.room);
        });

        const userLeftListener = () => {
            console.log('User leaving room');
            dispatch(clearUser());
            socket.removeAllListeners('joined');
            socket.removeAllListeners('user_left');
            socket.emit('leave_room', { room: channelName });
            config.channelName = '';
            config.joined = false;
        };

        socket.on('user_left', userLeftListener);

        return () => {
            // Cleanup logic here
            socket.off('joined');
            socket.off('user_left');
        };
    }, [socket, setChannelName, setJoined, user, dispatch]);
};

export default useSocketListeners;
