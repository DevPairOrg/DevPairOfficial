import { AgoraRTCProvider } from 'agora-rtc-react';
import PairedVideos from '../PairedVideos';
import PairedChat from '../PairedChat';
// const LazyPairedChat = lazy(() => import('../PairedChat'));
// const LazyPairedVideos = lazy(() => import('../PairedVideos'));
import React from 'react';
import './index.css';

interface VideoMainProps {
    channelName: string;
    agoraEngine: any;
    leaveRoomHandler: () => void;
}

const VideoMain: React.FC<VideoMainProps> = ({ channelName, agoraEngine, leaveRoomHandler }) => (
    <main id="video-main-wrapper">
        <AgoraRTCProvider client={agoraEngine}>
            <div className="video-wrapper">
                <PairedVideos channelName={channelName} leaveRoomHandler={leaveRoomHandler} />
            </div>
            <div id="paired-chat-container">
                <PairedChat channelName={channelName} />
            </div>
        </AgoraRTCProvider>
    </main>
);

export default VideoMain;
