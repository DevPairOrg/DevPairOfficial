import React from 'react';
import { AgoraRTCScreenShareProvider, IAgoraRTCClient } from 'agora-rtc-react';
import config from '../../../AgoraManager/config';
import { AgoraProvider } from '../../../AgoraManager/agoraManager';
import ScreenShare from './ScreenShare';

export interface PairedContentProps {
    agoraEngine: IAgoraRTCClient;
    leaveRoomHandler: () => void;
}

const PairedScreenShare: React.FC<PairedContentProps> = ({ agoraEngine, leaveRoomHandler }) => {
    return (
        <>
            <AgoraProvider localCameraTrack={null} localMicrophoneTrack={null} leaveRoomHandler={leaveRoomHandler}>
                <AgoraRTCScreenShareProvider client={agoraEngine}>
                    <ScreenShare channelName={config.channelName} />
                </AgoraRTCScreenShareProvider>
            </AgoraProvider>
        </>
    );
};

export default PairedScreenShare;
