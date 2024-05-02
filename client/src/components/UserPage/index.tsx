import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { RootState } from '../../store';
import './targetUserSocials.css';
import './index.css';
// import Footer from '../Footer/Footer';
import EditUserPage from './editProfile';
import PreviewProfile from './PreviewProfile';
import FriendsDropDown from '../FriendsDropDown/FriendsDropDown';
import Statistics from './Statistics';
import { acceptFriendRequest, cancelFriendRequest, rejectFriendRequest, sendFriendRequest } from '../../store/session';
import { changeAwaitingRequest, changeIsFriend, changePendingRequest, getUser } from '../../store/user';
// import OpenModalButton from '../OpenModalButton/OpenModalButton';
// import RemoveFriendModal from '../RemoveFriendModal';
import ExternalUserProfile from './ExternalUserProfile';
import { User } from '../../interfaces/user';
import { toast, ToastContainer } from 'react-toastify';

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

    const notifyWIP = () =>
        toast.info('This page is currently a WIP build.', {
            position: 'bottom-left',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'dark',
        });

    return (
        <>
            {isCurrentUserProfile && sessionUser ? (
                <div className="user-dash-main-content">
                    <div className="user-dash-navigation">
                        <div
                            onClick={() => setAction(0)}
                            style={{
                                background: `${
                                    action === 0
                                        ? ''
                                        : 'linear-gradient(to bottom, #171717 80%, rgb(14, 14, 14, 1) 100%)'
                                }`,
                            }}
                        >
                            <p style={{ color: `${action === 0 ? '#20CC09' : 'white'}` }}>Dashboard</p>
                        </div>
                        <div
                            onClick={() => {
                                setAction(1);
                                notifyWIP();
                                setEditMode(false);
                            }}
                            style={{
                                background: `${
                                    action === 1
                                        ? ''
                                        : 'linear-gradient(to bottom, #171717 80%, rgb(14, 14, 14, 1) 100%)'
                                }`,
                            }}
                        >
                            <p style={{ color: `${action === 1 ? '#20CC09' : 'white'}` }}>Profile</p>
                        </div>
                        <div
                            onClick={() => {
                                notifyWIP();
                                setAction(2);
                            }}
                            style={{
                                background: `${
                                    action === 2
                                        ? ''
                                        : 'linear-gradient(to bottom, #171717 80%, rgb(14, 14, 14, 1) 100%)'
                                }`,
                            }}
                        >
                            <p style={{ color: `${action === 2 ? '#20CC09' : 'white'}` }}>Statistics</p>
                        </div>
                    </div>

                    <div id="user-profile-content-container">
                        {action === 0 && (
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
                                                <span className="terminal_user">{sessionUser.username}@admin:</span>
                                                <span className="terminal_location">~</span>
                                                <span className="terminal_bling">
                                                    $ Welcome back, {sessionUser.username}!
                                                </span>
                                            </div>
                                            <div className="terminal_promt">
                                                <span className="terminal_user">{sessionUser.username}@admin:</span>
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
                        )}
                        {action === 1 && editMode ? (
                            <EditUserPage setEditMode={setEditMode} />
                        ) : (
                            action == 1 && !editMode && <PreviewProfile setEditMode={setEditMode} />
                        )}
                        {action === 2 && <Statistics />}
                    </div>
                </div>
            ) : (
                //!!! RENDER OTHER USER'S PROFILE !!!
                <>
                    <ExternalUserProfile {...(user as User)} />
                    <FriendsDropDown />
                </>
            )}

            <ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
}

export default UserPage;
