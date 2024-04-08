import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { updateCurrentPath } from '../../store/userPath'; // Adjust the import path
import { useAppDispatch } from '../../hooks';

const RouteChangeListener = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [prevLocation, setPrevLocation] = useState<string>('');

    useEffect(() => {
        if (location.pathname !== prevLocation) {
            setPrevLocation(location.pathname);
            dispatch(updateCurrentPath(location.pathname));
            console.log('RouteChangeListener Updated Location Successfully: ', location);
        }
    }, [location, dispatch]);

    return null;
};

export default RouteChangeListener;
