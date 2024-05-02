import { useState } from 'react';
import { useAppSelector } from '../../hooks';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { TbMail } from 'react-icons/tb';
import './FriendsDropDown.css';

const FriendsDropDown: React.FC = () => {
    const sessionUser = useAppSelector((state) => state.session.user);
    const [showFriends, setShowFriends] = useState(false);

    const toggleFriendsList = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setShowFriends(!showFriends);
    };

    return (
        <>
            <div className="friends-container">
                <div className="friends__dropdown-container">
                    <button
                        onClick={toggleFriendsList}
                        className="friends-button"
                        style={{ borderBottom: showFriends ? '1px solid black' : 'none' }}
                    >
                        <span>Friends</span>
                        {showFriends ? <IoIosArrowDown /> : <IoIosArrowUp />}
                    </button>
                    {showFriends &&
                        sessionUser?.friends?.map((friend, index) => {
                            return (
                                <>
                                    <div key={index} style={{ display: 'flex' }} className="friend">
                                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                            <a href={`/users/${+friend?.id}`} style={{ height: '50px' }}>
                                                <img className="friend-pfp" src={friend?.picUrl} alt="friend-pfp" />
                                            </a>
                                            <div>{friend?.username}</div>
                                        </div>
                                        <TbMail style={{ fill: '#20CC09', backgroundColor: 'transparent' }} />
                                    </div>
                                </>
                            );
                        })}
                    {}
                </div>
            </div>
        </>
    );
};

export default FriendsDropDown;
