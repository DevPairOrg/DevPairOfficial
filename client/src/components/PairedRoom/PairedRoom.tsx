import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks";
import { useSocket } from "../../context/Socket";
import { AgoraRTCProvider } from "agora-rtc-react";
import useAgoraClient from "../../hooks/Agora/useAgoraClient";
import useSocketListeners from "../../hooks/Sockets/useSocketListeners";
import useFetchToken from "../../hooks/Agora/useFetchToken";
import StartCall from "./StartCall";
import Chat from "./Chat/Chat";
import VideoCams from "./VideoCams/VideoCams";
import Content from "./Content/Content";
import { AgoraProvider } from "../../AgoraManager/agoraManager";
import "./PairedRoom.css";

const PairedRoom: React.FC = () => {
  const { connectSocket, socket } = useSocket();
  const user = useAppSelector((state) => state.session.user);
  const [joined, setJoined] = useState<boolean>(false);
  const [channelName, setChannelName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const agoraEngine = useAgoraClient();

  useSocketListeners(socket, channelName, setChannelName, user);
  useFetchToken({ channelName, setJoined });

  useEffect(() => {
    // Event listener to leave room and close socket when the page refreshes
    window.addEventListener("beforeunload", (_e) => {
      if (socket) {
        socket.emit("leave_room", { room: localStorage.getItem("room") as string });
        localStorage.removeItem("room");
        socket.removeAllListeners();
        socket.close();
      }
    });

    return () => {
      window.removeEventListener("beforeunload", (_e) => {
        if (socket) {
          socket.emit("leave_room", { room: localStorage.getItem("room") as string });
          localStorage.removeItem("room");
          socket.removeAllListeners();
          socket.close();
        }
      });
    };
  }, [socket, channelName]);

  const handleJoinClick = () => {
    // console.log("Join Button Clicked");

    setLoading(true);
    if (!socket) connectSocket();
  };

  const leaveRoomHandler = () => {
    localStorage.removeItem("room");
    socket?.emit("leave_room", { room: channelName });
    socket?.disconnect();
    setJoined(false);
    setChannelName("");
    setLoading(false);
  };

  return (
    <>
      {joined ? (
        <>
          <main id="video-main-wrapper">
            <AgoraRTCProvider client={agoraEngine}>
              <AgoraProvider leaveRoomHandler={leaveRoomHandler}>
                <VideoCams channelName={channelName} />
                <Content
                  agoraEngine={agoraEngine}
                  channelName={channelName}
                  leaveRoomHandler={leaveRoomHandler}
                  socket={socket}
                  connectSocket={connectSocket}
                />
                <Chat channelName={channelName} agoraEngine={agoraEngine} />
              </AgoraProvider>
            </AgoraRTCProvider>
          </main>
        </>
      ) : (
        <StartCall handleJoinClick={handleJoinClick} loading={loading} />
      )}
    </>
  );
};

export default PairedRoom;
