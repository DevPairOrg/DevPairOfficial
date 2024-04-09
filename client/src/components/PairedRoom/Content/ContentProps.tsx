import { IAgoraRTCClient } from 'agora-rtc-react';

export interface ContentProps {
    agoraEngine: IAgoraRTCClient;
    leaveRoomHandler?: () => void;
}
