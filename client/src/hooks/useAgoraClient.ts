import { useMemo } from 'react';
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import config from '../AgoraManager/config';

AgoraRTC.setLogLevel(3);

const useAgoraClient = (): IAgoraRTCClient => {
    const agoraEngine = useMemo(() => AgoraRTC.createClient({ codec: 'vp8', mode: config.selectedProduct }), []);

    return agoraEngine;
};

export default useAgoraClient;
