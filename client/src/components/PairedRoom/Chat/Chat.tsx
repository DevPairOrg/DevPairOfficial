import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { useSocket } from "../../../context/Socket";
import { clearChatMessages, receiveChatMessage } from "../../../store/chatRoom";
import { PairedChatMessage } from "../../../interfaces/socket";
import { IAgoraRTCClient } from "agora-rtc-react";
import "./Chat.css";

// Define the props interface for the PairedChat component
interface ChatProps {
  channelName: string;
  agoraEngine: IAgoraRTCClient;
}

const Chat: React.FC<ChatProps> = ({ channelName }) => {
  const { socket, connectSocket, error } = useSocket();
  const messagesStore = useAppSelector((state) => state.chatRoom.messages);
  const [messages, setMessages] = useState<PairedChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const dispatch = useAppDispatch();

  if (error) console.log("Error in Paired Chat Component: ", error);

  useEffect(() => {
    if (!socket) {
      connectSocket();
    }
  }, [socket, connectSocket]);

  // Memoized callback for handling received chat messages
  const handleTempMessageReceived = useCallback(
    (data: PairedChatMessage) => {
      // Format the date for user's local time
      const transformedMessage: PairedChatMessage = {
        ...data,
        created_at: new Date(data.created_at + " UTC").toLocaleString(),
      };
      // Dispatch the transformed message to the Redux store
      dispatch(receiveChatMessage(transformedMessage));
    },
    [dispatch]
  );

  // Memoized callback for sending chat messages
  const sendChat = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      // console.log("🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬🤬I am here!", socket);

      socket?.emit("temp_chat_message", {
        message: chatInput,
        room: channelName,
      });
      setChatInput("");
    },
    [socket, chatInput, channelName]
  );

  useEffect(() => {
    if (socket && !socket.hasListeners("temp_message_received")) {
      socket.on("temp_message_received", handleTempMessageReceived);

      // Clean up: Detach the event listener and dispatch action to clear states messages when unmounting
      return () => {
        socket.off("temp_message_received", handleTempMessageReceived);
        dispatch(clearChatMessages());
      };
    }
  }, [dispatch, handleTempMessageReceived, socket]);

  useEffect(() => {
    if (messagesStore) {
      setMessages(
        [...messagesStore].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
    }
  }, [messagesStore]);

  return (
    <>
      <div id="paired-chat-container">
        <div id="messages-container" tabIndex={0}>
          {messages &&
            messages.map((message, index) => {
              return (
                <div key={index} className="chat-message">
                  <div className="message-user-img">
                    <img
                      alt=""
                      className="message-profile-pic"
                      src={message.from.picUrl}
                    ></img>
                  </div>
                  <div className="message-details">
                    <div className="message-user-info">
                      {message.from.username}
                      <p className="message-time-updated">
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <p className="message-text">{message.message}</p>
                  </div>
                </div>
              );
            })}
        </div>

        <form className="message-input-form" onSubmit={sendChat}>
          <textarea
            className="message-input"
            placeholder={`send message`}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          ></textarea>
          <button type="submit" id="send-message" aria-label="Send Message">
            <svg
              width="20"
              height="20"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M29.3412 11.7062L6.94246 0.502974C6.05849 0.0628629 5.06034 -0.0938198 4.08411 0.0542885C3.10787 0.202397 2.20105 0.648088 1.48728 1.3306C0.773517 2.01311 0.287542 2.89922 0.0956165 3.86812C-0.0963091 4.83701 0.0151547 5.84155 0.414811 6.74476L4.2546 15.3392C4.34173 15.547 4.3866 15.7701 4.3866 15.9954C4.3866 16.2207 4.34173 16.4438 4.2546 16.6516L0.414811 25.2461C0.0895487 25.977 -0.0479549 26.7777 0.0147959 27.5753C0.0775467 28.3729 0.338562 29.1423 0.774122 29.8133C1.20968 30.4844 1.80598 31.0359 2.50881 31.4178C3.21165 31.7997 3.99875 31.9998 4.79857 32C5.5477 31.9925 6.28567 31.8175 6.95846 31.4879L29.3572 20.2846C30.1518 19.8848 30.8196 19.272 31.2862 18.5147C31.7529 17.7573 32 16.8851 32 15.9954C32 15.1057 31.7529 14.2335 31.2862 13.4762C30.8196 12.7188 30.1518 12.106 29.3572 11.7062H29.3412ZM27.9173 17.4198L5.51853 28.623C5.22441 28.7643 4.89414 28.8122 4.572 28.7604C4.24987 28.7086 3.95127 28.5595 3.71625 28.3331C3.48123 28.1067 3.32102 27.8139 3.25711 27.4938C3.19319 27.1737 3.22862 26.8418 3.35865 26.5424L7.18244 17.948C7.23194 17.8332 7.27468 17.7156 7.31044 17.5959H18.3338C18.7582 17.5959 19.1651 17.4273 19.4651 17.1271C19.7652 16.827 19.9337 16.4199 19.9337 15.9954C19.9337 15.5709 19.7652 15.1639 19.4651 14.8637C19.1651 14.5636 18.7582 14.395 18.3338 14.395H7.31044C7.27468 14.2752 7.23194 14.1576 7.18244 14.0429L3.35865 5.44839C3.22862 5.14905 3.19319 4.81709 3.25711 4.49703C3.32102 4.17697 3.48123 3.88411 3.71625 3.65771C3.95127 3.43132 4.24987 3.28222 4.572 3.2304C4.89414 3.17858 5.22441 3.22652 5.51853 3.3678L27.9173 14.571C28.1794 14.7053 28.3993 14.9094 28.5529 15.1607C28.7065 15.412 28.7877 15.7009 28.7877 15.9954C28.7877 16.29 28.7065 16.5788 28.5529 16.8301C28.3993 17.0815 28.1794 17.2855 27.9173 17.4198Z"
                fill="#20CC09"
              />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
};

export default Chat;
