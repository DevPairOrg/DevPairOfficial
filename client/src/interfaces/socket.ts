import { User, Request } from "./user";
import { ParsedGeminiResponse } from "../hooks/Gemini/useGeminiDSARequest";

export interface UserDict {
    picUrl: string | undefined;
    id: string;
    username: string;
    email: string;
    videoUid: string;
    screenUid: string;
    isFriend?: boolean;
    isPending?: boolean;
    isAwaiting?: boolean;
}

export interface JoinedEventData {
    users: UserDict[];
    room: string;
}

export interface PairedChatMessage {
    from: UserDict;
    message: string;
    created_at: string;
}

// Type for information received from the server
export interface ServerToClientEvents {
    joined: (data: JoinedEventData) => void;
    user_left: (data: string) => void;
    temp_message_received: (data: PairedChatMessage) => void;
    custom_error?: (error: { error: string }) => void;
    friend_removed: (data: { userId: string }) => void;
    friend_added: (data: { friend: User; requestId: number }) => void;
    friend_rejected: (data: { requestId: number }) => void;
    cancelled_request: (data: { requestId: number }) => void;
    received_request: (data: {request:  Request}) => void;
    update_IDE_received: (data: {newValue: string}) => void;
    send_users_to_gemini_dsa_component_received: (data: {parsedGeminiResponse: ParsedGeminiResponse}) => void;
    leave_gemini_page_received: () => void;
}

// Type for information sent to the server
export interface ClientToServerEvents {
    join_room: () => void;
    leave_room: (data: { room: string }) => void;
    temp_chat_message: (data: { message: string; room: string }) => void;
    user_leaving: (data: { userId: string }) => void;
    removed_friend: (data: { userId: string; room: string }) => void;
    accepted_request: (data: { userId: number; room: string; requestId: number }) => void;
    rejected_request: (data: { requestId: number; room: string }) => void;
    request_canceled: (data: { requestId: number; room: string }) => void;
    sent_request: (data: { requestId: number; room: string }) => void;
    update_IDE: (data: {newValue: string; room: string}) => void;
    send_users_to_gemini_dsa_component: (data: {fetchData: ParsedGeminiResponse; room: string}) => void;
    leave_gemini_page: (data: {room: string}) => void;
}
