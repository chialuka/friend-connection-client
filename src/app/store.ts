import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import membersReducer from "../features/members/membersSlice";
import friendRequestReducer from "../features/friend-request/friendRequestSlice";
import friendsReducer from "../features/friends/friendSlice";
import statusPostReducer from "../features/posts/postsSlice";

export const store = configureStore({
	reducer: {
		user: authReducer,
		members: membersReducer,
		friendRequests: friendRequestReducer,
    friends: friendsReducer,
    statusPosts: statusPostReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
