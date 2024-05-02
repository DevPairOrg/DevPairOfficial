import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { User } from "../interfaces/user";

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
export const changeIsFriend = createAction("user/changeIsFriend");
export const changeAwaitingRequest = createAction("user/changeAwaitingRequest")
export const changePendingRequest = createAction("user/changePendingRequest")


export const getUser = createAsyncThunk<
  User | null,
  number,
  { rejectValue: {} | string }
>("user/getUser", async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    return rejectWithValue("User not found");
  }
});



const initialState: { data: User | null } = { data: null };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeIsFriend(state) {
      if (state.data) {
        state.data.isFriend = !state.data.isFriend;
      }
    },
    changeAwaitingRequest(state) {
      if (state.data) {
        state.data.awaitingRequest = !state.data.awaitingRequest;
      }
    },
    changePendingRequest(state) {
      if (state.data) {
        state.data.pendingRequest = !state.data.pendingRequest;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export default userSlice.reducer;
