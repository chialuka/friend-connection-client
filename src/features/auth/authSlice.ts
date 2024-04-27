import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const registeredUser = localStorage.getItem("user");

const initialState = {
	user: registeredUser?.length ? JSON.parse(registeredUser) : [],
	error: null,
	status: "idle",
};

export const addNewUser = createAsyncThunk(
	"posts/addNewPost",
	async (data: { [key: string]: string }) => {
		const response = await fetch(
			`${import.meta.env.VITE_APP_SERVER_URL}/users`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}
		);
		const result = await response.json();
		return result.newUser;
	}
);

const authSlice = createSlice({
	initialState,
	name: "auth",
	reducers: {},
	extraReducers(builder) {
		builder.addCase(addNewUser.fulfilled, (state, action) => {
			state.user.push(action.payload);
			localStorage.setItem("user", JSON.stringify(action.payload));
		});
	},
});

export default authSlice.reducer;
