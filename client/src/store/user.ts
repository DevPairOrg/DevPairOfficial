import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../interfaces/user';

export interface UserForm {
    id: string;
    username: string;
    picUrl: File;
    about: string;
    github: string;
    linkedin: string;
    portfolio: string;
    leetcode: string;
}

export const getUser = createAsyncThunk<User | null, number, { rejectValue: {} | string }>(
    'user/getUser',
    async (id, {rejectWithValue}) => {
        try {
            const res = await fetch(`/api/users/${id}`);
            if (res.ok) {
                const data = await res.json();
                return data;
            } else {
                return null;
            }
        } catch (error) {
            return rejectWithValue('User not found');
        }
    }
);

// export const sendFriendRequest = createAsyncThunk



const initialState: {userData: User | null} = {userData: null}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUser.fulfilled, (state, action) => {
                state.userData = action.payload;
            })

    },
});

export default userSlice.reducer;