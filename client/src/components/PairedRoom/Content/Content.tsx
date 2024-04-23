import RemoteAndLocalVolumeComponent from '../../../AgoraManager/volumeControl';
import shareScreenPlaceholder from '../../../assets/images/share-screen-holder.webp';
import useGeminiDSARequest from '../../../hooks/Gemini/useGeminiDSARequest';
import { useAppSelector } from '../../../hooks';
import PairedScreenShare, { ContentProps } from '../ScreenShare/ScreenShareContainer';
import React from 'react';
import GeminiDSA from './GeminiDSA';
import { useAppDispatch } from '../../../hooks';
import { resetGeminiState } from '../../../store/pairedContent';

const Content: React.FC<ContentProps> = ({ agoraEngine, leaveRoomHandler, channelName }) => {
    const { handleGeminiDSARequest } = useGeminiDSARequest(channelName);
    const dispatch = useAppDispatch();
    const screenSharing = useAppSelector((state) => state.pairedContent.agora.screenshare.isActive);
    const geminiAPIRequest = useAppSelector((state) => state.pairedContent.gemini.isActive);

    const handleLeaveGemini = async () => {
        dispatch(resetGeminiState());
    };

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
                    <button onClick={handleLeaveGemini} style={{ color: 'white', backgroundColor: 'red' }}>
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
