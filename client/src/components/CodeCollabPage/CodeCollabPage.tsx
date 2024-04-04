import { useState } from 'react';
import { useAppSelector } from '../../hooks';
import { useSocket } from '../../context/Socket';
import VideoMain from './VideoChat';
import StartVideoCall from './StartCall';
import useAgoraClient from '../../hooks/Agora/useAgoraClient';
import useSocketListeners from '../../hooks/Sockets/useSocketListeners';
import useFetchToken from '../../hooks/Agora/useFetchToken';
import Footer from '../Footer';
import './index.css';

const CodeCollab: React.FC = () => {
    const { connectSocket, socket } = useSocket();
    const user = useAppSelector((state) => state.session.user);
    const [joined, setJoined] = useState<boolean>(false);
    const [channelName, setChannelName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const agoraEngine = useAgoraClient();

    useSocketListeners(socket, channelName, setChannelName, setJoined, user);
    useFetchToken({ channelName, setJoined });

    const handleJoinClick = () => {
        console.log('Join Button Clicked');
        setLoading(true);
        if (!socket) connectSocket();
    };

    return (
        <>
            {joined ? (
                <>
                    <VideoMain
                        channelName={channelName}
                        agoraEngine={agoraEngine}
                        leaveRoomHandler={() => setJoined(false)}
                    />
                    <Footer />
                </>
            ) : (
                <StartVideoCall handleJoinClick={handleJoinClick} loading={loading} />
            )}
        </>
    );
};

export default CodeCollab;
