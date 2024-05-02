import { NavLink, useNavigate } from 'react-router-dom';
import { RootState } from '../../store/index';
import { useAppDispatch } from '../../hooks';
import name from '../../assets/devpair-logos/svg/devpair-high-resolution-logo-transparent.svg';
import './Navigation.css';
import { logout } from '../../store/session';
import { useAppSelector } from '../../hooks';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import backgroundOverlay from '../../assets/background.png'

interface NavigationProps {
    isLoaded: boolean;
}

function Navigation({ isLoaded }: NavigationProps) {
    // Assuming `state.session.user` is of type User | null
    const location = useLocation()
    const sessionUser = useAppSelector((state: RootState) => state.session.user);
    const currentRoute = useAppSelector((state) => state.userPath.currentPath);
    const hasJoined = useAppSelector((state) => state.pairedContent.hasJoined)
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    let paramsUserId;
    const [isUserDashboard, setIsUserDashBoard] = useState(paramsUserId == sessionUser?.id || false);

    useEffect(() => {
        const extractUserIdFromParams = () => {
            if (currentRoute?.includes('/users/')) {
                paramsUserId = currentRoute.split('/')[2];
                setIsUserDashBoard(paramsUserId == sessionUser?.id);
            }
        };
        extractUserIdFromParams();
    }, [sessionUser, currentRoute]);

    //sessionUser is returning true even if there is no user logged in because it is returning the user object { errors: [] }
    //so we need to check if there is a user object and if there are no errors in the user object
    //will change nav display from profile button to login/signup buttons depending on if user is signed in or not
    let userLoggedIn: boolean = false;
    if (sessionUser && !sessionUser.errors) {
        userLoggedIn = true;
    }

    const handleDashBoardButton = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (sessionUser?.id) navigate(`/users/${sessionUser.id}`);
    };

    const handleLogout = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        await dispatch(logout());
        navigate('/', { replace: true });
    };

    return (
        <header className="nav-container" style={{backgroundImage: `${ (location.pathname === '/' || (location.pathname === '/code-collab' && hasJoined === false) ) ? `url(${backgroundOverlay})` : ''}`, backgroundSize: '50%', backgroundPosition: 'center', backgroundRepeat: 'repeat'}}>
            <div className="nav-links">
                <div className="nav-links-home">
                    <NavLink to="/" className="nav-links-home">
                        <img className="logo" src={name} alt="devpair logo and link to home" />
                    </NavLink>
                </div>
                <nav className="nav-links-other">
                    {isLoaded && userLoggedIn && sessionUser ? (
                        // <ProfileButton />
                        <div className="nav-links-login-and-signout">
                            {!currentRoute?.includes('/users') ? (
                                <>
                                    <div onClick={handleDashBoardButton}>
                                        <NavLink to={`/users/${sessionUser.id}`}>Dashboard</NavLink>
                                    </div>
                                </>
                            ) : isUserDashboard ? (
                                <>
                                    <div>
                                        <NavLink to="/">Home</NavLink>
                                    </div>
                                    <div>
                                        <NavLink to="mailto:support@devpair.com?subject=Contact%20Us!">
                                            Contact Us
                                        </NavLink>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <NavLink to="/">Home</NavLink>
                                    </div>
                                    <div onClick={handleDashBoardButton}>
                                        <NavLink to={`/users/${sessionUser.id}`}>Dashboard</NavLink>
                                    </div>
                                    <div>
                                        <NavLink to="mailto:support@devpair.com?subject=Contact%20Us!">
                                            Contact Us
                                        </NavLink>
                                    </div>
                                </>
                            )}
                            <div onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                Log Out
                            </div>
                        </div>
                    ) : (
                        <div className="nav-links-login-and-signout">
                            <div>
                                <NavLink to="/login">Login</NavLink>
                            </div>
                            <div>
                                <NavLink to="/signup">Register</NavLink>
                            </div>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Navigation;
