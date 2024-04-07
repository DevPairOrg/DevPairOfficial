import RemoteAndLocalVolumeComponent from '../../../AgoraManager/volumeControl';
import shareScreenPlaceholder from '../../../assets/images/share-screen-holder.webp';
import useGeminiDSARequest from '../../../hooks/Gemini/useGeminiDSARequest';
import { useAppSelector } from '../../../hooks';
import PairedScreenShare, { PairedContentProps } from '../PairedScreenShare/PairedScreenShare';
import React from 'react';
import { AgoraProvider } from '../../../AgoraManager/agoraManager';
import GeminiDSA from './GeminiDSA';

const PairedContent: React.FC<PairedContentProps> = ({ agoraEngine, leaveRoomHandler }) => {
    const { handleGeminiDSARequest } = useGeminiDSARequest();
    const screenSharing = useAppSelector((state) => state.pairedContent.screenshare.isActive);
    const geminiAPIRequest = useAppSelector((state) => state.pairedContent.gemini.isActive);

    console.log('screenSharing state', screenSharing);
    console.log('geminiAPIRequest state', geminiAPIRequest);

    if (screenSharing) {
        return (
            <>
                <div id="screen-share-container">
                    <PairedScreenShare agoraEngine={agoraEngine} leaveRoomHandler={leaveRoomHandler} />
                </div>
            </>
        );
    } else if (geminiAPIRequest) {
        return (
            <>
                <GeminiDSA />
            </>
        );
    } else {
        return (
            <>
                <div id="screen-share-container">
                    <div id="share-screen-placeholder">
                        <div id="share-or-generate-problem-container">
                            <div>Share your screen or </div>
                            <button onClick={handleGeminiDSARequest}>Generate a problem!</button>
                        </div>
                        <img
                            src={shareScreenPlaceholder}
                            alt="Cats waiting for a user to share their screen"
                            className="share-screen-cats"
                        />
                    </div>
                    <AgoraProvider
                        localCameraTrack={null}
                        localMicrophoneTrack={null}
                        leaveRoomHandler={leaveRoomHandler}
                    >
                        <RemoteAndLocalVolumeComponent />
                    </AgoraProvider>
                </div>
            </>
        );
    }
};

export default PairedContent;
