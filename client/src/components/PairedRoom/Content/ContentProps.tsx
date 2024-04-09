import { IAgoraRTCClient } from 'agora-rtc-react';
import { VideoCamsProps } from '../VideoCams/VideoCamsProps';

export interface ContentProps extends VideoCamsProps {
    agoraEngine: IAgoraRTCClient;
    leaveRoomHandler?: () => void;
}
