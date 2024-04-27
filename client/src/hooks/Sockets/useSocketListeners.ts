// useSocketListeners.ts
import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useAppDispatch } from '..';
import { clearUser, receiveUser } from '../../store/chatRoom';
import { UserDict } from '../../interfaces/socket';
import config from '../../AgoraManager/config';
import { User } from '../../interfaces/user';
import { resetGeminiState } from '../../store/pairedContent';

const useSocketListeners = (
    socket: Socket | null,
    channelName: string | null,
    setChannelName: React.Dispatch<React.SetStateAction<string>>,
    user: User | null
) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!socket) return;
        socket.emit('join_room');
        socket.on('joined', (data: { room: string; users: UserDict[] }) => {
            // console.log('Socket listening to "Joined"', data);
            if (!config.channelName) {
                // console.log(`Setting channel name to ${data.room}`);
                localStorage.setItem("room", data.room); // Save the room name to local storage so window can access it for page refreshes
                setChannelName(data.room);
            }
            if (data.users.length > 1) {
                // console.log('There is more than one user, a pair.');
                const pair = data.users.find((pair) => pair.id !== user?.id);
                
                if (pair) {
                    pair.isFriend = user?.friends.some(friend => +friend.id === +pair.id) || false;
                    if (user && user.receivedRequests) {
                        pair.isPending = Object.values(user.receivedRequests).some(pending => +pending.id === +pair.id) || false;

                    }
                    if (user && user.sentRequests) {
                        pair.isAwaiting = Object.values(user.sentRequests).some(pending => +pending.id === +pair.id) || false;

                    }
                    dispatch(receiveUser(pair as UserDict));
                }
            }
            // console.log(`Setting channelName to ${data.room} and setting joined to true`);
            setChannelName(data.room);
        });

        const userLeftListener = () => {
            console.log('🍑🍑🍑🍑🍑🍑🍑User leaving room');
            dispatch(clearUser());
            dispatch(resetGeminiState());
            socket.removeAllListeners('joined');
            socket.removeAllListeners('user_left');
            socket.emit('leave_room', { room: channelName });
            config.channelName = '';
            config.joined = false;
        };

        socket.on('user_left', userLeftListener);

        return () => {
            // Cleanup logic here

            console.log('🥑🥑🥑🥑🥑🥑🥑🥑🥑Use socket listeners cleanup');
            socket.off('joined');
            socket.off('user_left');
        };
    }, [socket, setChannelName, user, dispatch]);
};

export default useSocketListeners;
