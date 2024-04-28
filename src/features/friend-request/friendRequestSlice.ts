import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/User";

interface FriendRequest {
	sender: User;
	id: number;
	senderId: string;
	receiverId: string;
	status: "pending" | "accepted" | "rejected";
	createdAt: Date;
	updatedAt: Date;
}
interface FriendRequestStateParams {
	friendRequest: string | "pending" | "rejected" | "accepted";
	status: "idle" | "pending" | "completed" | "failed";
	error: null | undefined | string;
	requests: Array<FriendRequest>;
}

export const sendFriendRequest = createAsyncThunk(
	"/friendRequest/sendRequest",
	async (data: { senderId: string; receiverId: string }) => {
		const response = await fetch(
			`${import.meta.env.VITE_APP_SERVER_URL}/friend-requests`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}
		);

		const result = await response.json();
		return result.newRequest;
	}
);

export const getFriendRequests = createAsyncThunk(
	"/friendRequest/getRequests",
	async ({ userId }: { userId: string }) => {
		const response = await fetch(
			`${import.meta.env.VITE_APP_SERVER_URL}/friend-requests/${userId}`
		);

		const result = await response.json();
		return result.friendRequests;
	}
);

export const respondToFriendRequest = createAsyncThunk(
	"/friendRequest/respondToRequest",
	async (data: {
		senderId: string;
		receiverId: string;
		status: "accepted" | "rejected";
	}) => {
		const response = await fetch(
			`${import.meta.env.VITE_APP_SERVER_URL}/friend-requests/status`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}
		);

		const result = await response.json();
		return result.updatedStatus;
	}
);

const initialState: FriendRequestStateParams = {
	friendRequest: "",
	status: "idle",
	error: null,
	requests: [],
};

export const friendRequestSlice = createSlice({
	name: "friendRequest",
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(sendFriendRequest.pending, (state) => {
				state.status = "pending";
			})
			.addCase(sendFriendRequest.fulfilled, (state) => {
				state.status = "completed";
				state.friendRequest = "pending";
			})
			.addCase(sendFriendRequest.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(getFriendRequests.pending, (state) => {
				state.status = "pending";
			})
			.addCase(getFriendRequests.fulfilled, (state, action) => {
				state.status = "completed";
				state.requests = action.payload;
			})
			.addCase(getFriendRequests.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

export default friendRequestSlice.reducer;
