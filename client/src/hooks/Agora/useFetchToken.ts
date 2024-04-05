import { useEffect } from 'react';
import config from '../../AgoraManager/config';
import { fetchRTCToken } from './fetchRTCToken';

interface UseFetchTokenProps {
    channelName: string;
    setJoined: React.Dispatch<React.SetStateAction<boolean>>;
}

const useFetchToken = ({ channelName, setJoined }: UseFetchTokenProps) => {
    useEffect(() => {
        const fetchToken = async () => {
            if (config.serverUrl && channelName && !config.joined) {
                try {
                    const token = await fetchRTCToken(channelName);
                    if (token) {
                        config.rtcToken = token;
                        config.channelName = channelName;
                        setJoined(true);
                    } else {
                        console.error('Failed to fetch token: Token is null or undefined.');
                    }
                } catch (error) {
                    console.error('Failed to fetch token:', error);
                }
            } else {
                console.log('Token fetch skipped: Missing server URL, channel name, or already joined.');
            }
        };

        fetchToken();
    }, [channelName]); // Re-run this effect if channelName changes
};

export default useFetchToken;
