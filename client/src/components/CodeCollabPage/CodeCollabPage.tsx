import { useState } from 'react';
import { useAppSelector } from '../../hooks';
import { useSocket } from '../../context/Socket';
import { AgoraRTCProvider } from 'agora-rtc-react';
import useAgoraClient from '../../hooks/Agora/useAgoraClient';
import useSocketListeners from '../../hooks/Sockets/useSocketListeners';
import useFetchToken from '../../hooks/Agora/useFetchToken';
import StartCall from './StartCall';
import PairedChat from './PairedChat';
import PairedVideos from './PairedVideos';
import Footer from '../Footer';
import PairedContent from './PairedContent/PairedContent';
import './index.css';

const CodeCollab: React.FC = () => {
    const { connectSocket, socket } = useSocket();
    const user = useAppSelector((state) => state.session.user);
    const [joined, setJoined] = useState<boolean>(false);
    const [channelName, setChannelName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const agoraEngine = useAgoraClient();

    useSocketListeners(socket, channelName, setChannelName, user);
    useFetchToken({ channelName, setJoined });

    const handleJoinClick = () => {
        console.log('Join Button Clicked');
        setLoading(true);
        if (!socket) connectSocket();
    };

    const leaveRoomHandler = () => {
        setJoined(false);
    };

    return (
        <>
            {joined ? (
                <>
                    <main id="video-main-wrapper">
                        <AgoraRTCProvider client={agoraEngine}>
                            <PairedVideos channelName={channelName} />
                            <PairedContent agoraEngine={agoraEngine} leaveRoomHandler={leaveRoomHandler} />
                            <PairedChat channelName={channelName} agoraEngine={agoraEngine} />
                        </AgoraRTCProvider>
                    </main>
                    <Footer />
                </>
            ) : (
                <StartCall handleJoinClick={handleJoinClick} loading={loading} />
            )}
        </>
    );
};

export default CodeCollab;
