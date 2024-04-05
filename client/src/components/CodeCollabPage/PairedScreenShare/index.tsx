import React from 'react';
import { AgoraRTCScreenShareProvider, IAgoraRTCClient } from 'agora-rtc-react';
import config from '../../../AgoraManager/config';
import { AgoraProvider } from '../../../AgoraManager/agoraManager';
import ScreenShare from '../PairedContent';

interface PairedScreenShareProps {
    agoraEngine: IAgoraRTCClient;
    leaveRoomHandler: () => void;
}

const PairedScreenShare: React.FC<PairedScreenShareProps> = ({ agoraEngine, leaveRoomHandler }) => {
    return (
        <>
            <div id="screen-share-container">
                <AgoraProvider localCameraTrack={null} localMicrophoneTrack={null} leaveRoomHandler={leaveRoomHandler}>
                    <AgoraRTCScreenShareProvider client={agoraEngine}>
                        <ScreenShare channelName={config.channelName} />
                    </AgoraRTCScreenShareProvider>
                </AgoraProvider>
            </div>
        </>
    );
};

export default PairedScreenShare;
