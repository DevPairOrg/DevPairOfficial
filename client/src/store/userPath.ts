// This slice is to let the socket know when to disconnect a user. i.e. when they aren't on the url path /code-collab
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
interface CurrentPathState {
    currentPath: string | null;
}

// Define the initial state using that type
const initialState: CurrentPathState = {
    currentPath: null,
};

const currentUserPathSlice = createSlice({
    name: 'userPath',
    initialState,
    reducers: {
        // Here, the action payload directly represents the new path string
        updateCurrentPath: (state, action: PayloadAction<string>) => {
            state.currentPath = action.payload;
        },
    },
});

// Export actions
export const { updateCurrentPath } = currentUserPathSlice.actions;

// Export reducer
export default currentUserPathSlice.reducer;
