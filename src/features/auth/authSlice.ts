import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const registeredUser = () => {
	try {
		const user = JSON.parse(localStorage.getItem("user") || "");
		return user;
	} catch (error) {
		return [];
	}
};

const initialState = {
	user: registeredUser(),
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
			state.user = action.payload;
			localStorage.setItem("user", JSON.stringify(action.payload));
		});
	},
});

export default authSlice.reducer;
