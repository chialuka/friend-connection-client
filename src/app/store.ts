import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import membersReducer from "../features/members/membersSlice";
import friendRequestReducer from "../features/friend-request/friendRequestSlice";

export const store = configureStore({
	reducer: {
		user: authReducer,
		members: membersReducer,
		friendRequests: friendRequestReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
