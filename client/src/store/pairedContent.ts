import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { parsedData } from '../interfaces/gemini';

// Define a type for the slice state
interface pairedContentState {
    screenshare: {
        isActive: boolean;
    };
    gemini: {
        isActive: boolean;
        generatedProblem: parsedData | null;
    };
}

// Define the initial state using that type
const initialState: pairedContentState = {
    screenshare: {
        isActive: false,
    },
    gemini: {
        isActive: false,
        generatedProblem: null,
    },
};

const pairedContentSlice = createSlice({
    name: 'userPath',
    initialState,
    reducers: {
        // Here, the action payload directly represents the new path string
        toggleScreenShare: (state, action: PayloadAction<boolean>) => {
            state.screenshare.isActive = action.payload;
        },
        generateAndSetGeminiProblem: (
            state,
            action: PayloadAction<{ isActive: boolean; generatedProblem?: parsedData }>
        ) => {
            state.gemini.isActive = action.payload.isActive;
            // Only update `generatedProblem` if it is explicitly provided in the payload
            if (action.payload.generatedProblem !== undefined) {
                state.gemini.generatedProblem = action.payload.generatedProblem;
            }
        },
        resetGeminiState: (state) => {
            state.gemini.isActive = false
            state.gemini.generatedProblem = null
        }
    },
});

// Export actions
export const { toggleScreenShare, generateAndSetGeminiProblem, resetGeminiState } = pairedContentSlice.actions;

// Export reducer
export default pairedContentSlice.reducer;
