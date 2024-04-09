import { ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-react';

export interface VideoCamsProps {
    channelName?: string;
    localCameraTrack?: ICameraVideoTrack | null;
    localMicrophoneTrack?: IMicrophoneAudioTrack | null;
    isLoadingMic?: boolean;
    isLoadingCam?: boolean;
}
