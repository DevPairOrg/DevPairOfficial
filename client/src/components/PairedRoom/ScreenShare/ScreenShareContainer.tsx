import React from 'react';
import { AgoraRTCScreenShareProvider, IAgoraRTCClient } from 'agora-rtc-react';
import config from '../../../AgoraManager/config';
import { AgoraProvider } from '../../../AgoraManager/agoraManager';
import ScreenShare from './ScreenShare';
import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../../../interfaces/socket';

export interface ContentProps {
    agoraEngine: IAgoraRTCClient;
    leaveRoomHandler: () => void;
    channelName?: string;
    socket?: Socket<ServerToClientEvents, ClientToServerEvents> | null

}

const PairedScreenShare: React.FC<ContentProps> = ({ agoraEngine, leaveRoomHandler }) => {
    return (
        <>
            <AgoraProvider leaveRoomHandler={leaveRoomHandler}>
                <AgoraRTCScreenShareProvider client={agoraEngine}>
                    <ScreenShare channelName={config.channelName} />
                </AgoraRTCScreenShareProvider>
            </AgoraProvider>
        </>
    );
};

export default PairedScreenShare;
