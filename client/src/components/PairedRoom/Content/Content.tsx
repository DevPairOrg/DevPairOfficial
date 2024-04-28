import RemoteAndLocalVolumeComponent from "../../../AgoraManager/volumeControl";
import shareScreenPlaceholder from "../../../assets/images/pair-programming.webp";
import useGeminiDSARequest from "../../../hooks/Gemini/useGeminiDSARequest";
import { useAppSelector } from "../../../hooks";
import PairedScreenShare, {
  ContentProps,
} from "../ScreenShare/ScreenShareContainer";
import React, { useEffect, useState } from "react";
import GeminiDSA from "./GeminiDSA";
import useIdeListeners from "../../../hooks/Sockets/useIdeListeners";
import { Socket } from "socket.io-client";
import GeminiSpinner from "../../../assets/icons/svg/google-gemini-icon.svg"

// import { useAppDispatch } from '../../../hooks';
// import { resetGeminiState } from '../../../store/pairedContent';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Content: React.FC<ContentProps> = ({
  agoraEngine,
  leaveRoomHandler,
  channelName,
  socket,
  connectSocket,
}) => {
  const { handleGeminiDSARequest } = useGeminiDSARequest(channelName);
  // const dispatch = useAppDispatch();
  const screenSharing = useAppSelector(
    (state) => state.pairedContent.agora.screenshare.isActive
  );
  const geminiAPIRequest = useAppSelector(
    (state) => state.pairedContent.gemini.isActive
  );

  const [loading, setLoading] = useState<boolean>(false);

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
          <PairedScreenShare
            agoraEngine={agoraEngine}
            leaveRoomHandler={leaveRoomHandler}
            socket={null}
          />
        </>
      );
    } else if (geminiAPIRequest) {
      return (
        <>
          <GeminiDSA
            loading={loading}
            setLoading={setLoading}
            channelName={channelName}
          />

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
                setLoading(true);
                await handleGeminiDSARequest();
                setLoading(false);
              }}
              className="gemini-button-large"
              disabled={loading}
            >
                {!loading
                  ? "Ask Gemini to generate a problem!"
                  : "Gemini is generating..."}
                {
                  <img
                    className={loading ? "spinning-gemini-large" : "gemini-icon-large"}
                    src={GeminiSpinner}
                    alt="loading gemini problem"
                  />
                }
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
