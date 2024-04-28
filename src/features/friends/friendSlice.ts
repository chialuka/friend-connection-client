import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Members } from "../../types/Member";

interface FriendsStateParams {
	friends: Members;
	status: "idle" | "pending" | "completed" | "failed";
	error: null | undefined | string;
}

export const getFriends = createAsyncThunk(
	"friends/getFriends",
	async ({ userId }: { userId: string }) => {
		const response = await fetch(
			`${import.meta.env.VITE_APP_SERVER_URL}/connections/${userId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const result = await response.json();
		return result.connections;
	}
);

export const changeFriendStatus = createAsyncThunk(
	"friends/changeFriendStatus",
	async (data: {
		userId: string;
		friendId: string;
		status: "blocked" | "active";
	}) => {
		const response = await fetch(
			`${import.meta.env.VITE_APP_SERVER_URL}/connections/status`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}
		);
		const result = await response.json();
		return result.connection;
	}
);

const initialState: FriendsStateParams = {
	friends: [],
	status: "idle",
	error: null,
};

export const friendSlice = createSlice({
	initialState,
	name: "friendSlice",
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(getFriends.pending, (state) => {
				state.status = "pending";
			})
			.addCase(getFriends.fulfilled, (state, action) => {
				state.status = "completed";
				state.friends = action.payload;
			})
			.addCase(getFriends.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(changeFriendStatus.fulfilled, (state, action) => {
				state.status = "completed";
				if (action.payload.status === "blocked") {
          const newFriends = state.friends.filter(
						(friend) =>
							friend.userId !== action.payload.userId &&
							friend.userId !== action.payload.friendId
					);
          console.log(newFriends)
					state.friends = newFriends;
				} else {
					state.friends = state.friends.concat(action.payload);
				}
			});
	},
});

export default friendSlice.reducer;
