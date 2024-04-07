import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useSocket } from '../../../context/Socket';
import { clearChatMessages, receiveChatMessage } from '../../../store/chatRoom';
import { PairedChatMessage } from '../../../interfaces/socket';
import { IAgoraRTCClient } from 'agora-rtc-react';
import './index.css';

// Define the props interface for the PairedChat component
interface PairedChatProps {
    channelName: string;
    agoraEngine: IAgoraRTCClient;
}

const PairedChat: React.FC<PairedChatProps> = ({ channelName, agoraEngine }) => {
    const { socket, connectSocket, error } = useSocket();
    const messagesStore = useAppSelector((state) => state.chatRoom.messages);
    const [messages, setMessages] = useState<PairedChatMessage[]>([]);
    const [chatInput, setChatInput] = useState<string>('');
    const dispatch = useAppDispatch();

    if (error) console.log('Error in Paired Chat Component: ', error);

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
                created_at: new Date(data.created_at + ' UTC').toLocaleString(),
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

            socket?.emit('temp_chat_message', {
                message: chatInput,
                room: channelName,
            });
            setChatInput('');
        },
        [socket, chatInput, channelName]
    );

    useEffect(() => {
        if (socket && !socket.hasListeners('temp_message_received')) {
            socket.on('temp_message_received', handleTempMessageReceived);

            // Clean up: Detach the event listener and dispatch action to clear states messages when unmounting
            return () => {
                socket.off('temp_message_received', handleTempMessageReceived);
                dispatch(clearChatMessages());
            };
        }
    }, [dispatch, handleTempMessageReceived, socket]);

    useEffect(() => {
        if (messagesStore) {
            setMessages(
                [...messagesStore].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            );
        }
    }, [messagesStore]);

    return (
        <>
            <div id="paired-chat-container">
                <h1 className="chat-logs-header">Chat</h1>
                <div id="messages-container" tabIndex={0}>
                    {messages &&
                        messages.map((message, index) => {
                            return (
                                <div key={index} className="chat-message">
                                    <div className="message-user-img">
                                        <img alt="" className="message-profile-pic" src={message.from.picUrl}></img>
                                    </div>
                                    <div className="message-details">
                                        <div className="message-user-info">
                                            {message.from.username}
                                            <p className="message-time-updated">
                                                {new Date(message.created_at).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path
                                d="M21.88 4.73 16.2 20.65A2 2 0 0 1 14.3 22a2 2 0 0 1-1.9-1.31l-2.12-5.52 1.54-1.54 2.49-2.49a1 1 0 1 0-1.42-1.42l-2.49 2.49-1.58 1.55-5.51-2.13a2 2 0 0 1 0-3.83l15.96-5.68a2 2 0 0 1 2.61 2.61Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                </form>
            </div>
        </>
    );
};

export default PairedChat;
