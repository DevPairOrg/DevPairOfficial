import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { RootState } from '../../store';
import './targetUserSocials.css';
import './index.css';
import Footer from '../Footer/Footer';
import EditUserPage from './editProfile';
import PreviewProfile from './PreviewProfile';
import FriendsDropDown from '../FriendsDropDown/FriendsDropDown';
import { acceptFriendRequest, cancelFriendRequest, rejectFriendRequest, sendFriendRequest } from '../../store/session';
import { changeAwaitingRequest, changeIsFriend, changePendingRequest, getUser } from '../../store/user';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import RemoveFriendModal from '../RemoveFriendModal';
import ExternalUserProfile from './ExternalUserProfile';
import { User } from '../../interfaces/user';

function UserPage() {
    const { userId } = useParams();
    const dispatch = useAppDispatch();
    const [action, setAction] = useState<number>(0);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [isCurrentUserProfile, setIsCurrentProfile] = useState<boolean>(false);
    const sessionUser = useAppSelector((state: RootState) => state.session.user);
    const user = useAppSelector((state: RootState) => state.user.data);

    const friends = useAppSelector((state: RootState) => state.session.user?.friends);
    const sentRequests = useAppSelector((state: RootState) => state.session.user?.sentRequests);
    const receivedRequests = useAppSelector((state: RootState) => state.session.user?.receivedRequests);

    useEffect(() => {
        if (userId && sessionUser && +sessionUser.id === +userId) {
            setIsCurrentProfile(true);
        } else {
            if (userId && !user) {
                dispatch(getUser(+userId));
            }
        }
    }, [userId]);

    const handleRequest = async (Id: number, action: string) => {
        let actionResult;

        switch (action) {
            case 'accept':
                actionResult = await dispatch(acceptFriendRequest(Id));
                if (!isCurrentUserProfile && acceptFriendRequest.fulfilled.match(actionResult)) {
                    dispatch(changeIsFriend());
                    dispatch(changePendingRequest());
                }
                break;
            case 'cancel':
                actionResult = await dispatch(cancelFriendRequest(Id));
                if (!isCurrentUserProfile && cancelFriendRequest.fulfilled.match(actionResult)) {
                    dispatch(changeAwaitingRequest());
                }

                break;
            case 'reject':
                actionResult = await dispatch(rejectFriendRequest(Id));
                if (!isCurrentUserProfile && rejectFriendRequest.fulfilled.match(actionResult)) {
                    dispatch(changePendingRequest());
                }
                break;
            case 'send':
                actionResult = await dispatch(sendFriendRequest(Id));
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
            {isCurrentUserProfile && sessionUser ? (
                <>
                    <main id="user-profile-main">
                        <div id="user-profile-header">
                            <span>Dashboard</span>
                        </div>
                        <div id="user-profile-container">
                            <div id="user-profile-sidebar">
                                <button id="db-button" onClick={() => setAction(0)}>
                                    Start
                                </button>
                                <button
                                    id="db-button"
                                    onClick={() => {
                                        setAction(1);
                                        setEditMode(false);
                                    }}
                                >
                                    Profile
                                </button>
                                <button id="db-button" onClick={() => setAction(2)}>
                                    Friends
                                </button>
                                <button id="db-button" onClick={() => setAction(3)}>
                                    Requests - {sessionUser.totalPending}
                                </button>
                            </div>
                            <div id="user-profile-content-container">
                                {action === 0 && (
                                    <>
                                        <div className="container2">
                                            <div className="container_terminal"></div>

                                            <a href="/code-collab">
                                                <div className="terminal_toolbar">
                                                    <div className="butt2">
                                                        <button className="btn btn-color"></button>
                                                        <button className="btn"></button>
                                                        <button className="btn"></button>
                                                    </div>
                                                    <p className="user">{sessionUser.username}@admin: ~</p>
                                                </div>

                                                <div className="terminal_body">
                                                    <div>
                                                        <div className="terminal_promt">
                                                            <span className="terminal_user">
                                                                {sessionUser.username}@admin:
                                                            </span>
                                                            <span className="terminal_location">~</span>
                                                            <span className="terminal_bling">
                                                                $ Welcome back, {sessionUser.username}!
                                                            </span>
                                                        </div>
                                                        <div className="terminal_promt">
                                                            <span className="terminal_user">
                                                                {sessionUser.username}@admin:
                                                            </span>
                                                            <span className="terminal_location">~</span>
                                                            <span className="terminal_bling">
                                                                $ Start Pairing by clicking this terminal
                                                            </span>
                                                            <span className="terminal_cursor"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </>
                                )}
                                {action === 1 && editMode ? (
                                    <EditUserPage setEditMode={setEditMode} />
                                ) : (
                                    action == 1 && !editMode && <PreviewProfile setEditMode={setEditMode} />
                                )}
                                {action === 2 && (
                                    <div id="user-friends">
                                        <p>All friends - {friends?.length}</p>
                                        {friends && friends.length > 0 ? (
                                            friends.map((friend) => {
                                                return (
                                                    <>
                                                        <a href={`/users/${friend.id}`}>
                                                            <div id="each-friend">
                                                                <div>{friend.username}</div>
                                                                <img
                                                                    src={
                                                                        friend.picUrl
                                                                            ? friend.picUrl
                                                                            : 'https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?w=740'
                                                                    }
                                                                    style={{ height: '150px', width: '150px' }}
                                                                />
                                                            </div>
                                                        </a>
                                                        <OpenModalButton
                                                            className="profile-buttons"
                                                            buttonText="Remove Friend"
                                                            modalComponent={
                                                                <RemoveFriendModal
                                                                    user={friend}
                                                                    realtime={false}
                                                                    channelName={undefined}
                                                                />
                                                            }
                                                        />
                                                    </>
                                                );
                                            })
                                        ) : (
                                            <div>No friends yet... Get pairing to build your network!</div>
                                        )}
                                    </div>
                                )}
                                {action === 3 && (
                                    <div id="user-friends">
                                        <p>Pending - {sessionUser.totalPending}</p>
                                        {sentRequests && Object.keys(sentRequests).length > 0 ? (
                                            Object.keys(sentRequests).map((requestId) => {
                                                const user = sentRequests[+requestId];
                                                return (
                                                    <>
                                                        <a href={`/users/${user.id}`}>
                                                            <div id="each-friend">
                                                                <div>{user.username}</div>
                                                                <img
                                                                    src={
                                                                        user.picUrl
                                                                            ? user.picUrl
                                                                            : 'https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?w=740'
                                                                    }
                                                                    style={{ height: '150px', width: '150px' }}
                                                                />
                                                            </div>
                                                        </a>
                                                        <p>Outgoing Request</p>
                                                        <button
                                                            onClick={() => handleRequest(+requestId, 'cancel')}
                                                            style={{ color: 'black' }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                );
                                            })
                                        ) : (
                                            <div>You currently have no pending requests...</div>
                                        )}
                                        {receivedRequests &&
                                            Object.keys(receivedRequests).length > 0 &&
                                            Object.keys(receivedRequests).map((requestId) => {
                                                const user = receivedRequests[+requestId];
                                                return (
                                                    <>
                                                        <a href={`/users/${user.id}`}>
                                                            <div id="each-friend">
                                                                <div>{user.username}</div>
                                                                <img
                                                                    src={
                                                                        user.picUrl
                                                                            ? user.picUrl
                                                                            : 'https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?w=740'
                                                                    }
                                                                    style={{ height: '150px', width: '150px' }}
                                                                />
                                                            </div>
                                                        </a>
                                                        <p>Incoming Request</p>
                                                        <button
                                                            onClick={() => handleRequest(+requestId, 'accept')}
                                                            style={{ color: 'black' }}
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleRequest(+requestId, 'reject')}
                                                            style={{ color: 'black' }}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                );
                                            })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                    <Footer />
                </>
            ) : (
                //!!! RENDER OTHER USER'S PROFILE !!!
                <>
                    <ExternalUserProfile {...(user as User)} />
                    <FriendsDropDown />
                </>
            )}
        </>
    );
}

export default UserPage;
