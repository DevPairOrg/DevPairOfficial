import SocialLinksButtons from './SocialLinksButtons';
import './ExternalUserProfile.css';
import { User } from '../../interfaces/user';
import { useAppDispatch, useAppSelector } from '../../hooks';
import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import RemoveFriendModal from '../RemoveFriendModal';
import { getUser, changeIsFriend, changePendingRequest, changeAwaitingRequest } from '../../store/user';
import { sendFriendRequest, cancelFriendRequest, rejectFriendRequest } from '../../store/session';
import { acceptFriendRequest } from '../../store/session';
import { useParams } from 'react-router-dom';

const ExternalUserProfile: React.FC<User> = (externalUser) => {
    const { userId } = useParams();
    const sessionUser = useAppSelector((s) => s.session.user);
    const isFriend = externalUser.isFriend;
    const dispatch = useAppDispatch();
    const [isCurrentUserProfile, setIsCurrentProfile] = useState<boolean>(false);

    console.log('what is this', isFriend);

    useEffect(() => {
        if (userId && sessionUser && +sessionUser.id === +userId) {
            setIsCurrentProfile(true);
        } else {
            if (userId && !externalUser) {
                dispatch(getUser(+userId));
            }
        }
    }, [userId]);

    const handleRequest = async (Id: number, action: string) => {
        let actionResult;
        let sentId;
        let receivedId;
        if (sessionUser) {
            for (const [key, value] of Object.entries(sessionUser.sentRequests)) {
                if (value?.id === userId) {
                    sentId = +key + 1;
                    break;
                }
            }
            for (const [key, value] of Object.entries(sessionUser.receivedRequests)) {
                if (value?.id === userId) {
                    receivedId = key;
                    break;
                }
            }
        }

        switch (action) {
            case 'accept':
                if (sessionUser && sessionUser.receivedRequests) {
                    const id = Object.entries(sessionUser.receivedRequests).find(
                        ([_key, value]) => value.id === externalUser?.id
                    )?.[0];
                    if (id) actionResult = await dispatch(acceptFriendRequest(+id));
                    if (!isCurrentUserProfile && acceptFriendRequest.fulfilled.match(actionResult)) {
                        dispatch(changeIsFriend());
                        dispatch(changePendingRequest());
                    }
                }
                break;
            case 'cancel':
                if (sessionUser && sessionUser.sentRequests) {
                    const id = Object.entries(sessionUser.sentRequests).find(
                        ([_key, value]) => value.id === externalUser?.id
                    )?.[0];
                    if (id) actionResult = await dispatch(cancelFriendRequest(+id));
                    if (!isCurrentUserProfile && cancelFriendRequest.fulfilled.match(actionResult)) {
                        dispatch(changeAwaitingRequest());
                    }
                }

                break;
            case 'reject':
                if (sessionUser && sessionUser.receivedRequests) {
                    const id = Object.entries(sessionUser.receivedRequests).find(
                        ([_key, value]) => value.id === externalUser?.id
                    )?.[0];
                    if (id) actionResult = await dispatch(rejectFriendRequest(+id));
                    if (!isCurrentUserProfile && rejectFriendRequest.fulfilled.match(actionResult)) {
                        dispatch(changePendingRequest());
                    }
                }

                break;
            case 'send':
                actionResult = await dispatch(sendFriendRequest(+Id));
                if (sendFriendRequest.fulfilled.match(actionResult)) {
                    dispatch(changeAwaitingRequest());
                }
                break;
            default:
                break;
        }
    };

    return (
        <>
            <div className="external-profile-main">
                <div className="external-profile-wrapper">
                    <div className="external-profile-container">
                        <div>
                            <button className="back-button">
                                <IoIosArrowBack style={{ fill: '#20CC09' }} />
                                <span>Go Back</span>
                            </button>
                            <div className="profile-header">
                                <img
                                    src={externalUser.picUrl}
                                    alt="profile-picture"
                                    style={{ width: '250px', height: '250px', borderRadius: '10%' }}
                                />
                                <div className="user-info">
                                    <div className="username">{externalUser?.username}</div>
                                    <div className="joined-date">Joined July 2024</div>
                                    <div className="statistics">
                                        <div className="friends-count">{externalUser?.friends?.length} Friends</div>
                                        <div className="problems-count">
                                            {(externalUser as any)?.completedLeetcodeProblems?.split(',').length - 1}{' '}
                                            Problems Solved
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="buttons">
                            {isFriend ? (
                                <OpenModalButton
                                    className="profile-buttons"
                                    buttonText="Remove Friend"
                                    modalComponent={
                                        <RemoveFriendModal
                                            user={externalUser}
                                            realtime={false}
                                            channelName={undefined}
                                        />
                                    }
                                />
                            ) : externalUser.awaitingRequest ? (
                                <>
                                    <p>Friend Request Sent...</p>
                                    <button
                                        className="profile-buttons"
                                        onClick={() => handleRequest(+externalUser.id, 'cancel')}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : externalUser.pendingRequest ? (
                                <>
                                    <button
                                        className="profile-buttons"
                                        onClick={() => handleRequest(+externalUser.id, 'accept')}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="profile-buttons"
                                        onClick={() => handleRequest(+externalUser.id, 'reject')}
                                    >
                                        Reject
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="profile-buttons"
                                    onClick={() => handleRequest(+externalUser.id, 'send')}
                                >
                                    Send Friend Request
                                </button>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="about">About Me:</div>
                        <div className="description">{externalUser?.about}</div>
                    </div>
                    <SocialLinksButtons {...externalUser} />
                </div>
            </div>
        </>
    );
};

export default ExternalUserProfile;
