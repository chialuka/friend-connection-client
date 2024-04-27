import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Members } from "../../types/Member";

export const findMembers = createAsyncThunk(
	"/members/findMembers",
	async (userId: string) => {
		const response = await fetch(
			`${import.meta.env.VITE_APP_SERVER_URL}/users/members/${userId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const result = await response.json();
		return result.members;
	}
);

const initialState: {
	members: Members;
	status: "idle" | "pending" | "completed" | "failed";
	error: null | undefined | string;
} = {
	members: [],
	status: "idle",
	error: null,
};

export const membersSlice = createSlice({
	initialState,
	name: "auth",
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(findMembers.pending, (state) => {
				state.status = "pending";
			})
			.addCase(findMembers.fulfilled, (state, action) => {
        state.status = "completed";
				state.members = action.payload;
			})
			.addCase(findMembers.rejected, (state, action) => {
        state.status = "failed";
				state.error = action.error.message;
			});
	},
});

export default membersSlice.reducer;
