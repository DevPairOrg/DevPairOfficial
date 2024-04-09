// AgoraManager Renders Video Calling.
// Requirements: Wrap this component in AgoraRTCProvider
/* Example:
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from 'agora-rtc-react';
const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: 'vp8', mode: config.selectedProduct }));
<AgoraRTCProvider client={agoraEngine}>
    <AgoraManager config={config} children={undefined}></AgoraManager>
</AgoraRTCProvider>;
*/
import { IMicrophoneAudioTrack, ICameraVideoTrack } from 'agora-rtc-react';

import React, { createContext, useContext, useEffect, useState } from 'react';
import './agoraManager.css';

// Define the shape of the Agora context
interface AgoraContextType {
    localCameraTrack: ICameraVideoTrack | null;
    setLocalCameraTrack: (track: ICameraVideoTrack | null) => void;
    localMicrophoneTrack: IMicrophoneAudioTrack | null;
    setLocalMicrophoneTrack: (track: IMicrophoneAudioTrack | null) => void;
    leaveRoomHandler: () => void;
}

const defaultState: AgoraContextType = {
    localCameraTrack: null,
    setLocalCameraTrack: () => {},
    localMicrophoneTrack: null,
    setLocalMicrophoneTrack: () => {},
    leaveRoomHandler: () => {},
};

const AgoraContext = createContext<AgoraContextType>(defaultState);

interface AgoraProviderProps {
    children: React.ReactNode;
    leaveRoomHandler: () => void;
}

export const AgoraProvider: React.FC<AgoraProviderProps> = ({ children, leaveRoomHandler }) => {
    const [localCameraTrack, setLocalCameraTrack] = useState<ICameraVideoTrack | null>(null);
    const [localMicrophoneTrack, setLocalMicrophoneTrack] = useState<IMicrophoneAudioTrack | null>(null);

    useEffect(() => {
        console.log('local mic context', localMicrophoneTrack);
    });

    const value = {
        localCameraTrack,
        setLocalCameraTrack,
        localMicrophoneTrack,
        setLocalMicrophoneTrack,
        leaveRoomHandler,
    };

    return <AgoraContext.Provider value={value}>{children}</AgoraContext.Provider>;
};

// Custom hook to access the Agora context
export const useAgoraContext = () => useContext(AgoraContext);
