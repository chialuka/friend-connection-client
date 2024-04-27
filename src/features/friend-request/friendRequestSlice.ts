import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface FriendRequestStateParams {
	friendRequest: string | "pending" | "rejected" | "accepted";
	status: "idle" | "pending" | "completed" | "failed";
	error: null | undefined | string;
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

const initialState: FriendRequestStateParams = {
	friendRequest: "",
	status: "idle",
	error: null,
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
			});
	},
});

export default friendRequestSlice.reducer;
