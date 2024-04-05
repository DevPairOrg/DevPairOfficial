import { useEffect, useState } from 'react';
import {
    LocalVideoTrack,
    RemoteUser,
    useJoin,
    useLocalCameraTrack,
    useLocalMicrophoneTrack,
    usePublish,
    useRemoteUsers,
    ICameraVideoTrack,
} from 'agora-rtc-react';
import config from '../../../AgoraManager/config';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { pairFollow, pairUnfollow } from '../../../store/session';
import userWaiting from '../../../assets/images/user-waiting.svg';
import './index.css';

function PairedVideos(props: { channelName: string }) {
    const user = useAppSelector((state) => state.session.user);
    const pairInfo = useAppSelector((state) => state.chatRoom.user);
    const { channelName } = props;
    const [myCameraTrack, setMyCameraTrack] = useState<ICameraVideoTrack | undefined>(undefined);

    const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
    const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();

    const remoteUsers = useRemoteUsers();
    const [isFollowed, setIsFollowed] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    useJoin({
        appid: config.appId,
        channel: channelName,
        token: config.rtcToken,
        uid: user?.videoUid,
    });

    // Cleanup function
    useEffect(() => {
        return () => {
            localCameraTrack?.close();
            localMicrophoneTrack?.close();
        };
    }, []);

    useEffect(() => {
        if (localCameraTrack) {
            setMyCameraTrack(localCameraTrack);
        }
    }, [localCameraTrack]);

    usePublish([localMicrophoneTrack, localCameraTrack]);

    const deviceLoading = isLoadingMic || isLoadingCam;

    // Needs refactoring to Friends
    const handleVideoFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            if (!isFollowed && pairInfo) {
                await dispatch(pairFollow(+pairInfo.id)).unwrap();
                setIsFollowed(true);
            } else {
                if (pairInfo) {
                    const relationshipId = user?.following.find((pair) => +pair.followed_id === +pairInfo.id)?.id;
                    if (relationshipId) {
                        await dispatch(pairUnfollow(+relationshipId)).unwrap();
                        setIsFollowed(false);
                    }
                } else {
                    console.log('No matching following target found');
                }
            }
        } catch (error) {
            console.error('Error in handleFollow:', error);
        }
    };

    return (
        <>
            <div className="video-wrapper">
                <div id="video-container">
                    {deviceLoading ? (
                        <div className="videos" style={{ height: 300, width: 300 }}>
                            Loading Devices...
                        </div>
                    ) : (
                        <div className="videos" style={{ height: 300, width: 300 }}>
                            <p className="video-username">{user?.username}</p>
                            <LocalVideoTrack track={myCameraTrack} play={true} />
                        </div>
                    )}
                    {remoteUsers.length > 0 && remoteUsers.find((user) => user.uid === pairInfo?.videoUid) ? (
                        remoteUsers.map((remoteUser) => {
                            if (remoteUser.uid === pairInfo?.videoUid) {
                                return (
                                    <div className="videos" style={{ height: 300, width: 300 }} key={remoteUser.uid}>
                                        <p className="video-username">{pairInfo.username}</p>
                                        <RemoteUser user={remoteUser} playVideo={true} playAudio={true} />
                                        <button id="follow-user" onClick={handleVideoFollow}>
                                            {isFollowed ? 'unfollow' : 'Follow'}
                                        </button>
                                    </div>
                                );
                            }
                        })
                    ) : (
                        <>
                            <div className="videos cat-waiting" style={{ height: 300, width: 300 }}>
                                <img src={userWaiting} alt="Cat informing we are waiting for a user to join" />
                                <p>Waiting for user...</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default PairedVideos;
