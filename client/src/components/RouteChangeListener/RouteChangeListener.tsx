import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateCurrentPath } from '../../store/userPath'; // Adjust the import path

const RouteChangeListener = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [prevLocation, setPrevLocation] = useState<string>('');

    useEffect(() => {
        if (location.pathname !== prevLocation) {
            setPrevLocation(location.pathname);
            dispatch(updateCurrentPath(location.pathname));
            console.log('RouteChangeListener Udpated Location Successfully: ', location);
        }
    }, [location, dispatch]);

    return null;
};

export default RouteChangeListener;
