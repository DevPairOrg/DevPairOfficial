import React from 'react';
import { createRoot } from 'react-dom/client';
import AgoraRTC, { AgoraRTCProvider, IAgoraRTCClient } from 'agora-rtc-react';

interface ClientProps {
    children?: React.ReactNode;
}

export const Client: React.FC<ClientProps> = ({ children }) => {
    const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }) as unknown as IAgoraRTCClient;
    return <AgoraRTCProvider client={client}>{children}</AgoraRTCProvider>;
};

const container = document.getElementById('container');
if (container) {
    const root = createRoot(container);
    root.render(<Client />);
}
