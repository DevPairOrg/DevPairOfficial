import { useState } from 'react';
import ShareScreenComponent from '../../AgoraManager/screenShare';
import config from '../../AgoraManager/config';
import { fetchRTCToken } from '../../utility/fetchRTCToken';
import { useEffect } from 'react';
import { RemoteVideoTrack, useRemoteUsers, useRemoteVideoTracks } from 'agora-rtc-react';
import { useAppSelector } from '../../hooks';

function ScreenShare(props: {
    channelName: string;
    screenSharing: boolean;
    setScreenSharing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { channelName } = props;
    const [screenSharing, setScreenSharing] = useState<boolean>(false);
    const remoteUsers = useRemoteUsers();
    useRemoteVideoTracks(remoteUsers);
    const pairInfo = useAppSelector((state) => state.pairedUser.user);
    console.log(remoteUsers);

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

        console.log('😎screenSharing😎: ', props.screenSharing ? props.screenSharing : props.screenSharing);
    }, [channelName, props.screenSharing]);

    const renderContent = () => {
        if (screenSharing === true) {
            return (
                <>
                    {/* <h1>Screen Sharing</h1> */}

                    <ShareScreenComponent setScreenSharing={setScreenSharing} />
                </>
            );
        }
    };

    useEffect(() => {
        console.log('😁😁😁 state', screenSharing);
    });

    return (
        <>
            <button onClick={() => setScreenSharing(!screenSharing)} id="share-screen-button">
                <p className="screen-share-button-text">{screenSharing ? 'Stop Sharing' : 'Start Sharing'}</p>
            </button>
            {renderContent()}
            {remoteUsers.map((remoteUser) => {
                if (remoteUser.uid === pairInfo?.screenUid) {
                    return (
                        <RemoteVideoTrack
                            track={remoteUser.videoTrack}
                            key={remoteUser.uid}
                            play
                            style={{ width: '192', height: '108' }}
                        />
                    );
                } else {
                    return null;
                }
            })}
        </>
    );
}
export default ScreenShare;
