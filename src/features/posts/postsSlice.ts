import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/User";

interface Post {
	id: number;
	postId: string;
	userId: string;
	post: string;
	likes: number;
	user: User;
  createdAt: Date;
  updatedAt: Date;
}
interface PostParams {
	posts: Array<Post>;
	status: "idle" | "pending" | "completed" | "failed";
	error: null | undefined | string;
}

export const createPost = createAsyncThunk(
	"posts/createPost",
	async ({ userId, post }: { userId: string; post: string }) => {
		const response = await fetch(
			`${import.meta.env.VITE_APP_SERVER_URL}/posts/${userId}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ post }),
			}
		);

		const result = await response.json();
		return result.newPost;
	}
);

export const getPostsForUser = createAsyncThunk(
	"posts/getPosts",
	async ({ userId }: { userId: string }) => {
		const response = await fetch(
			`${import.meta.env.VITE_APP_SERVER_URL}/posts/${userId}`
		);

		const result = await response.json();
		return result.statusUpdates;
	}
);

const initialState: PostParams = {
	posts: [],
	status: "idle",
	error: null,
};

const postsReducer = createSlice({
	name: "posts",
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(createPost.fulfilled, (state, action) => {
				state.status = "completed";
				state.posts = state.posts.concat(action.payload);
			})
			.addCase(createPost.pending, (state) => {
				state.status = "pending";
			})
			.addCase(createPost.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(getPostsForUser.fulfilled, (state, action) => {
				state.status = "completed";
				state.posts = action.payload;
			})
			.addCase(getPostsForUser.pending, (state) => {
				state.status = "pending";
			})
			.addCase(getPostsForUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

export default postsReducer.reducer;
