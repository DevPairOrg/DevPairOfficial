import RemoteAndLocalVolumeComponent from '../../../AgoraManager/volumeControl';
import shareScreenPlaceholder from '../../../assets/images/share-screen-holder.webp';
import useGeminiDSARequest from '../../../hooks/Gemini/useGeminiDSARequest';
import { useAppSelector } from '../../../hooks';
import PairedScreenShare, { ContentProps } from '../ScreenShare/ScreenShareContainer';
import React, { useEffect, useCallback } from 'react';
import GeminiDSA from './GeminiDSA';
import { useAppDispatch } from '../../../hooks';
import { resetGeminiState } from '../../../store/pairedContent';

const Content: React.FC<ContentProps> = ({ agoraEngine, leaveRoomHandler, channelName, socket, connectSocket }) => {
    const { handleGeminiDSARequest } = useGeminiDSARequest(channelName);
    const dispatch = useAppDispatch();
    const screenSharing = useAppSelector((state) => state.pairedContent.agora.screenshare.isActive);
    const geminiAPIRequest = useAppSelector((state) => state.pairedContent.gemini.isActive);

    // handle connect
    useEffect(() => {
        if (!socket && connectSocket) {
            connectSocket();
        }
    }, [socket, connectSocket]);

    // handle received
    const handleLeaveGeminiPageReceived = useCallback(() => {
        dispatch(resetGeminiState());
    }, [dispatch]);

    // handle send
    const sendLeaveGeminiPage = useCallback(() => {
        socket?.emit('leave_gemini_page', {
            room: channelName as string,
        });
    }, [socket, channelName]);

    // attach listeners for sockets
    useEffect(() => {
        if (socket && !socket.hasListeners('leave_gemini_page_received')) {
            socket.on('leave_gemini_page_received', handleLeaveGeminiPageReceived);

            // Clean up: Detach the event listener and dispatch action to clear states messages when unmounting
            return () => {
                socket.disconnect();
                socket.off('leave_gemini_page_received', handleLeaveGeminiPageReceived);
                dispatch(resetGeminiState());
            };
        }
    }, [dispatch, handleLeaveGeminiPageReceived, socket]);

    const renderContent = () => {
        if (screenSharing) {
            return (
                <>
                    <PairedScreenShare agoraEngine={agoraEngine} leaveRoomHandler={leaveRoomHandler} />
                </>
            );
        } else if (geminiAPIRequest) {
            return (
                <>
                    <GeminiDSA channelName={channelName} />

                    {/* Temporary button to reset gemini active state */}
                    <button onClick={sendLeaveGeminiPage} style={{ color: 'white', backgroundColor: 'red' }}>
                        Exit
                    </button>
                </>
            );
        } else {
            return (
                <>
                    <div id="share-or-generate-problem-container">
                        <div>Share your screen or </div>
                        <button onClick={handleGeminiDSARequest}>Generate a problem!</button>
                    </div>
                    <img
                        src={shareScreenPlaceholder}
                        alt="Cats waiting for a user to share their screen"
                        className="share-screen-cats"
                    />
                </>
            );
        }
    };

    return (
        <>
            <div id="screen-share-container">
                {renderContent()}

                <RemoteAndLocalVolumeComponent />
            </div>
        </>
    );
};

export default Content;
