import { useState, useEffect } from 'react';
import { RemoteVideoTrack, useClientEvent, useRemoteUsers, useRemoteVideoTracks } from 'agora-rtc-react';
import config from '../../../AgoraManager/config';
import { fetchRTCToken } from '../../../hooks/Agora/fetchRTCToken';
import ShareScreenComponent from '../../../AgoraManager/screenShare';
import RemoteAndLocalVolumeComponent from '../../../AgoraManager/volumeControl';
import useAgoraClient from '../../../hooks/Agora/useAgoraClient';
import { toggleScreenShare } from '../../../store/pairedContent';
import { useAppDispatch, useAppSelector } from '../../../hooks';

function ScreenShare(props: { channelName: string }) {
    const { channelName } = props;
    // const [screenSharing, setScreenSharing] = useState<boolean>(false);
    const [isRemoteScreen, setIsRemoteScreen] = useState<boolean>(false);
    const remoteUsers = useRemoteUsers();
    const agoraEngine = useAgoraClient();
    const dispatch = useAppDispatch();
    const screenSharing = useAppSelector((state) => state.pairedContent.agora.screenshare.isActive);

    useRemoteVideoTracks(remoteUsers);

    const pairInfo = useAppSelector((state) => state.chatRoom.user);

    useEffect(() => {
        const fetchTokenFunction = async () => {
            if (config.serverUrl !== '' && channelName !== '') {
                try {
                    const token = (await fetchRTCToken(channelName)) as string;
                    config.rtcToken = token;
                    config.channelName = channelName;
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.log('Please make sure you specified the token server URL in the configuration file');
            }
        };

        fetchTokenFunction();
    }, [channelName, screenSharing]);

    useClientEvent(agoraEngine, 'user-left', (user) => {
        if (user.uid === pairInfo?.screenUid) {
            setIsRemoteScreen(false);
            dispatch(toggleScreenShare(false));
        }
    });

    useClientEvent(agoraEngine, 'user-published', (user, _) => {
        if (user.uid === pairInfo?.screenUid) {
            setIsRemoteScreen(true);
            dispatch(toggleScreenShare(true));
        }
    });

    return (
        <>
            {/* Although we're rendering the <ShareScreenComponent /> in renderContent(), this code snippet below is to display the shared screen to the other user */}
            {remoteUsers.map((remoteUser) => {
                if (remoteUser.uid === pairInfo?.screenUid) {
                    return (
                        <RemoteVideoTrack
                            track={remoteUser.videoTrack}
                            className="screen-share"
                            style={{
                                width: '100%',
                                height: '108',
                                objectFit: 'contain',
                            }}
                            key={remoteUser.uid}
                            play
                        />
                    );
                } else {
                    return null;
                }
            })}

            {/* Render shared screen to ONLY the user that shared the screen */}
            {screenSharing && <ShareScreenComponent isRemoteScreen={isRemoteScreen} />}

            <RemoteAndLocalVolumeComponent />
        </>
    );
}
export default ScreenShare;
