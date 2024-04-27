import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import membersReducer from "../features/members/membersSlice";

export const store = configureStore({
	reducer: {
		user: authReducer,
    members: membersReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
