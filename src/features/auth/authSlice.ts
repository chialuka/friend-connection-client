import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../types/User";

const registeredUser = () => {
	try {
		const user: User = JSON.parse(localStorage.getItem("user") || "");
		return user;
	} catch (error) {
		return null;
	}
};

const initialState = {
	user: registeredUser(),
	error: null,
	status: "idle",
};

export const addNewUser = createAsyncThunk(
	"users/addNewUser",
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
		return result.user;
	}
);


const authSlice = createSlice({
	initialState,
	name: "auth",
	reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem("user");
    }
  },
	extraReducers(builder) {
		builder.addCase(addNewUser.fulfilled, (state, action) => {
			state.user = action.payload;
			localStorage.setItem("user", JSON.stringify(action.payload));
		});
	},
});

export default authSlice.reducer;

export const { logout } = authSlice.actions;
