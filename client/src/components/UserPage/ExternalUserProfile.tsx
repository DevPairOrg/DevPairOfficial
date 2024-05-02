import SocialLinksButtons from './SocialLinksButtons';
import './ExternalUserProfile.css';
import { User } from '../../interfaces/user';
import { useAppSelector } from '../../hooks';
import { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';

const ExternalUserProfile: React.FC<User> = (externalUser) => {
    const sessionUser = useAppSelector((s) => s.session.user);
    const [isFriend, setIsFriend] = useState(false);
    const friends = sessionUser?.friends?.filter((friend) => friend.id == externalUser.id) || [];

    useEffect(() => {
        setIsFriend(friends.length > 0);
    }, [friends.length]);

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
                                <button className="unfollow-button">Unfollow</button>
                            ) : (
                                <button className="follow-button">Follow</button>
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
