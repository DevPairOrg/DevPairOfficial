import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupFormPage from './components/SignupFormPage/SignupFormPage';
import LoginFormPage from './components/LoginFormPage/LoginFormPage';
import Navigation from './components/Navigation/Navigation';
import { authenticate } from './store/session';
import { useAppDispatch, useAppSelector } from './hooks';
import LandingPage from './components/LandingPage/LandingPage';
import VideoCall from './components/PairedRoom/PairedRoom';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import UserPage from './components/UserPage/index';
import RouteChangeListener from './components/RouteChangeListener/RouteChangeListener';

const App: React.FC = () => {
    const dispatch = useAppDispatch();
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const currentUser = useAppSelector((state) => state.session.user);

    useEffect(() => {
        if (!currentUser) {
            dispatch(authenticate())
                .then((result) => {
                    if (authenticate.fulfilled.match(result)) {
                        setIsLoaded(true);
                    } else {
                        console.log('Authentication result doesnt match', result);
                    }
                })
                .catch((error: Error) => {
                    console.error({ Error: error, Message: 'Error authenticating!' });
                });
        }
    }, [dispatch, currentUser]);

    const loggedIn = currentUser?.errors ? false : true;

    // https://reactrouter.com/en/main/route/route - this is v6 of browserrouter
    return (
        <>
            {isLoaded && (
                <Router>
                    <RouteChangeListener />
                    <Navigation isLoaded={isLoaded} />
                    <Routes>
                        <Route path="" element={<LandingPage />} />
                        <Route path="/login" element={<LoginFormPage />} />
                        <Route path="/signup" element={<SignupFormPage />} />
                        <Route
                            path="/code-collab"
                            element={
                                <ProtectedRoute loggedIn={loggedIn}>
                                    <VideoCall />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/users/:userId/" element={<UserPage />} />
                    </Routes>
                </Router>
            )}
        </>
    );
};

export default App;
