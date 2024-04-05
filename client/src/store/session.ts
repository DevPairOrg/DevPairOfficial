import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, Request } from "../interfaces/user";

// Async thunks
export const authenticate = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("session/authenticate", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/auth/");
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error authenticating: ", error);
    return rejectWithValue("Failed to authenticate");
  }
});

export const login = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: {} | string }
>("session/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const data = await response.json();
      return data || null; // Assuming data is of type User
    } else {
      const errorResponse = await response.json(); // Get the error message from the response
      return rejectWithValue(errorResponse.message || "Invalid Credentials");
    }
  } catch (error) {
    return rejectWithValue(error || "Failed to login");
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "session/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/logout", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        return;
      } else {
        throw new Error("Failed to logout");
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signUp = createAsyncThunk<
  User,
  {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  },
  { rejectValue: string }
>("session/signUp", async (signupData, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupData),
    });
    if (response.ok) {
      const data = await response.json();
      return data || null; // Assuming data is of type User
    } else {
      return null;
    }
  } catch (error) {
    return rejectWithValue("Failed to sign up");
  }
});

export const editUser = createAsyncThunk<
  User,
  FormData,
  { rejectValue: {} | string }
>("session/editUser", async (user, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/users/edit`, {
      method: "PUT",
      body: user,
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      const errorResponse = await res.json(); // Get the error message from the response

      return rejectWithValue(errorResponse.errors);
    }
  } catch (error) {
    return rejectWithValue("User not found");
  }
});

export const acceptFriendRequest = createAsyncThunk<
  { requestId: number; friend: User },
  number,
  { rejectValue: string }
>("session/acceptFriendRequest", async (requestId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/friends/request/${requestId}/accept`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return rejectWithValue("Failed to accept friend request");
    }
  } catch (error) {
    console.error("Error in accept request: ", error);
    return rejectWithValue("Failed to accept friend request");
  }
});

export const cancelFriendRequest = createAsyncThunk<
  {requestId: number},
  number,
  { rejectValue: string }
>("session/cancelFriendRequest", async (requestId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/friends/request/${requestId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return rejectWithValue("Failed to cancel friend request");
    }
  } catch (error) {
    console.error("Error in cancel request: ", error);
    return rejectWithValue("Failed to cancel friend request");
  }
});

export const rejectFriendRequest = createAsyncThunk<
  User,
  number,
  { rejectValue: string }
>("session/rejectFriendRequest", async (requestId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/friends/request/${requestId}/reject`, {
      method: "DELETE",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return rejectWithValue("Failed to reject friend request");
    }
  } catch (error) {
    console.error("Error in reject request: ", error);
    return rejectWithValue("Failed to reject friend request");
  }
});

export const removeFriend = createAsyncThunk<
  User,
  number,
  { rejectValue: string }
>("session/removeFriend", async (friendId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/friends/${friendId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return rejectWithValue("Failed to remove friend.");
    }
  } catch (error) {
    console.error("Error in remove friend: ", error);
    return rejectWithValue("Failed to remove friend");
  }
});

export const pairFollow = createAsyncThunk<
  User | null,
  number,
  { rejectValue: string }
>("session/pairFollow", async (followId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/follows/pair/${followId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return rejectWithValue("Failed to post follow");
    }
  } catch (error) {
    console.error("Error in post follow: ", error);
    return rejectWithValue("Failed to follow user");
  }
});

export const pairUnfollow = createAsyncThunk<
  User | null,
  number,
  { rejectValue: string }
>("session/pairUnfollow", async (relationshipId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/follows/pair/${relationshipId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      // Handle non-OK responses
      return rejectWithValue(
        `Failed to unfollow, server responded with status: ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error in unfollowing", error);
    return rejectWithValue("Failed to unfollow");
  }
});

export const sendFriendRequest = createAsyncThunk<
  Request,
  number,
  { rejectValue: string }
>("session/sendFriendRequest", async (receiverId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/friends/request/${receiverId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return rejectWithValue("Failed to send friend request");
    }
  } catch (error) {
    console.error("Error in send request: ", error);
    return rejectWithValue("Failed to send friend request");
  }
});

// Initial State
const initialState: { user: User | null } = { user: null };

// Reducer
const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.user = action.payload?.errors ? state.user : action.payload;
      })
      .addCase(pairFollow.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(pairUnfollow.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        if (state.user) {
          delete state.user.receivedRequests[action.payload.requestId];
          state.user.friends.push(action.payload.friend);
          state.user.totalPending--;
        }
      })
      .addCase(cancelFriendRequest.fulfilled, (state, action) => {
        if (state.user) {
            delete state.user.sentRequests[action.payload.requestId];
            state.user.totalPending--;
          }
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        if (state.user) {
          Object.assign(state.user.sentRequests, action.payload);
        }
      })
      .addMatcher(
        (action) => {
          return [
            "session/authenticate/fulfilled",
            "session/login/fulfilled",
            "session/signUp/fulfilled",
          ].includes(action.type);
        },
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
        }
      );
  },
});

export default sessionSlice.reducer;
