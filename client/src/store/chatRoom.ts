import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDict, PairedChatMessage } from "../interfaces/socket";

interface ChatRoomState {
    user: UserDict | null // paired user information
    messages: PairedChatMessage[] | null // chat log messages
}


const initialState: ChatRoomState = { user: null, messages: [] }

const chatRoomSlice = createSlice({
    name: "chatroom",
    initialState,
    reducers: {
        // Reducer function for handling the "receiveChatMessage" action
        unfriendUser: (state) => {
            if (state.user) {
                state.user.isFriend = false;
            }
        },
        acceptFriend: (state) => {
            if (state.user) {
                state.user.isFriend = true;
                state.user.isPending = false;
            }
        },
        rejectFriend: (state) => {
            if (state.user) {
                state.user.isPending = false;
            }
        },
        cancelRequest: (state) => {
            if (state.user) {
                state.user.isAwaiting = false;
            }
        },
        sentRequest: (state) => {
            if (state.user) {
                state.user.isAwaiting = true;
            }
        },
        receivedRequest: (state) => {
            if (state.user) {
                state.user.isPending = true;
            }
        },

        receiveUser: (state, action: PayloadAction<UserDict>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
        // Reducer function for handling the "receiveChatMessage" action
        receiveChatMessage: (state, action: PayloadAction<PairedChatMessage>) => {
            if (state.messages) {
                // If messages array exists, push the new message
                state.messages.push(action.payload);
            } else {
                // If messages array doesn't exist, initialize it with the new message
                state.messages = [action.payload];
            }
        },
        clearChatMessages: (state) => {
            state.messages = null;
        },
    },
});

// Export actions
export const { cancelRequest, rejectFriend, sentRequest, acceptFriend, unfriendUser, receiveUser, clearUser, receiveChatMessage, clearChatMessages } = chatRoomSlice.actions;

// Export reducer
export default chatRoomSlice.reducer;
