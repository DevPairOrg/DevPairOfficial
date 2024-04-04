import { useMemo } from 'react';
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import config from '../AgoraManager/config'; // Adjust the import path as necessary

// Logging Parameter Levels: 0 = DEBUG, 1 = INFO, 2 = WARNING, 3 = ERROR, 4. NONE
AgoraRTC.setLogLevel(0);

const useAgoraClient = (): IAgoraRTCClient => {
    const agoraEngine = useMemo(() => AgoraRTC.createClient({ codec: 'vp8', mode: config.selectedProduct }), []);

    return agoraEngine;
};

export default useAgoraClient;
