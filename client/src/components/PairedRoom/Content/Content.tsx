import RemoteAndLocalVolumeComponent from '../../../AgoraManager/volumeControl';
import shareScreenPlaceholder from '../../../assets/images/share-screen-holder.webp';
import useGeminiDSARequest from '../../../hooks/Gemini/useGeminiDSARequest';
import { useAppSelector } from '../../../hooks';
import PairedScreenShare, { ContentProps } from '../ScreenShare/ScreenShareContainer';
import React, { useEffect, useCallback, useState } from 'react';
import GeminiDSA from './GeminiDSA';
import useIdeListeners from '../../../hooks/Sockets/useIdeListeners';
import { Socket } from "socket.io-client";

// import { useAppDispatch } from '../../../hooks';
// import { resetGeminiState } from '../../../store/pairedContent';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Content: React.FC<ContentProps> = ({ agoraEngine, leaveRoomHandler, channelName, socket, connectSocket }) => {
    const { handleGeminiDSARequest } = useGeminiDSARequest(channelName);
    // const dispatch = useAppDispatch();
    const screenSharing = useAppSelector((state) => state.pairedContent.agora.screenshare.isActive);
    const geminiAPIRequest = useAppSelector((state) => state.pairedContent.gemini.isActive);

    const [loading, setLoading] = useState<boolean>(false)

    useIdeListeners(socket as Socket);


    // handle connect
    useEffect(() => {
        if (!socket && connectSocket) {
            connectSocket();
        }
    }, [socket, connectSocket]);



    // handle send
    // const sendLeaveGeminiPage = useCallback(() => {
    //     socket?.emit('leave_gemini_page', {
    //         room: channelName as string,
    //     });
    // }, [socket, channelName]);


    const renderContent = () => {
        if (screenSharing) {
            return (
                <>
                    <PairedScreenShare agoraEngine={agoraEngine} leaveRoomHandler={leaveRoomHandler} socket={null} />
                </>
            );
        } else if (geminiAPIRequest) {
            return (
                <>
                    <GeminiDSA loading={loading} setLoading={setLoading}  channelName={channelName} />

                    {/* Temporary button to reset gemini active state */}
                    {/* <button onClick={sendLeaveGeminiPage} style={{ color: 'white', backgroundColor: 'red', width: '200px', height: '56px', fontSize: '1.5 rem' }}>
                        Exit
                    </button> */}
                </>
            );
        } else {
            return (
                <>
                    <ToastContainer
                        position="bottom-left"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />

                    <div id="share-or-generate-problem-container">
                        {!loading && <div>Share your screen or </div>}
                        <button
                            onClick={async () => {
                                setLoading(true)
                                await handleGeminiDSARequest()
                                setLoading(false)
                            }}
                            style={{backgroundColor: `${loading ? 'grey' : '#20cc09'}`, cursor: `${loading ? 'default' : 'pointer'}`}}
                            disabled={loading}
                        >
                            <div style={{display: 'flex', alignItems: 'center', color: 'black'}}>
                                {!loading ? 'Generate a problem!' : 'Generating... please wait'}
                                {loading && <div style={{marginLeft: '10px', width: '40px', height: '40px'}} className="spinner"></div>}
                            </div>
                        </button>
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
