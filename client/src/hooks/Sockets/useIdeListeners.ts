// useSocketListeners.ts
import { useCallback, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch } from "..";
// import { clearUser, receiveUser } from "../../store/chatRoom";
// import { UserDict } from "../../interfaces/socket";
// import config from "../../AgoraManager/config";
// import { User } from "../../interfaces/user";
import { resetGeminiState } from "../../store/pairedContent";

const useIdeListeners = (socket: Socket | null) => {
  const dispatch = useAppDispatch();

  // handle received
  const handleLeaveGeminiPageReceived = useCallback(() => {
    dispatch(resetGeminiState());
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    // attach listeners for sockets
    if (socket && !socket.hasListeners("leave_gemini_page_received")) {
      socket.on("leave_gemini_page_received", handleLeaveGeminiPageReceived);

      // Clean up: Detach the event listener and dispatch action to clear states messages when unmounting
      return () => {
        socket.off("leave_gemini_page_received");
        dispatch(resetGeminiState());
      };
    }

    return () => {
      // Cleanup logic here
      socket.off("leave_gemini_page_received");
    };
  }, [socket, dispatch, handleLeaveGeminiPageReceived]);
};

export default useIdeListeners;
