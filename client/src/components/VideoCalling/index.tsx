import { useState } from 'react';
import { useAppSelector } from '../../hooks';
import { useSocket } from '../../context/Socket';
import VideoMain from './VideoMain';
import StartVideoCall from './StartVideoCall';
import useAgoraClient from '../../hooks/useAgoraClient';
import useSocketListeners from '../../hooks/useSocketListeners';
import useFetchToken from '../../hooks/useFetchToken';
import Footer from '../Footer';
import './index.css';

const VideoCall: React.FC = () => {
    const { connectSocket, socket } = useSocket();
    const user = useAppSelector((state) => state.session.user);
    const [joined, setJoined] = useState<boolean>(false);
    const [channelName, setChannelName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const agoraEngine = useAgoraClient();

    useSocketListeners(socket, channelName, setChannelName, setJoined, user);
    useFetchToken({ channelName, setJoined });

    console.log('joined', joined);
    console.log('channel', channelName);
    console.log('loading', loading);

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

export default VideoCall;
