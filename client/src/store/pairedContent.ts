import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { parsedData } from '../interfaces/gemini';
import { ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-react';

// Define a type for the slice state
interface pairedContentState {
    agora: {
        screenshare: {
            isActive: boolean;
        };
        media: {
            localCameraTrack: ICameraVideoTrack | null;
            localMicrophoneTrack: IMicrophoneAudioTrack | null;
        };
    };
    gemini: {
        isActive: boolean;
        generatedProblem: parsedData | null;
    };
}

// Define the initial state using that type
const initialState: pairedContentState = {
    agora: {
        screenshare: {
            isActive: false,
        },
        media: {
            localCameraTrack: null,
            localMicrophoneTrack: null,
        },
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
            state.agora.screenshare.isActive = action.payload;
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
            state.gemini.isActive = false;
            state.gemini.generatedProblem = null;
        },
        setLocalCamMic: (
            state,
            action: PayloadAction<{
                localCameraTrack: ICameraVideoTrack | null;
                localMicrophoneTrack: IMicrophoneAudioTrack | null;
            }>
        ) => {
            state.agora.media.localCameraTrack = action.payload.localCameraTrack;
            state.agora.media.localMicrophoneTrack = action.payload.localMicrophoneTrack;
        },
        clearLocalCamMic: (state) => {
            state.agora.media.localCameraTrack = null;
            state.agora.media.localMicrophoneTrack = null;
        },
    },
});

// Export actions
export const { toggleScreenShare, generateAndSetGeminiProblem, resetGeminiState, setLocalCamMic, clearLocalCamMic } =
    pairedContentSlice.actions;

// Export reducer
export default pairedContentSlice.reducer;
