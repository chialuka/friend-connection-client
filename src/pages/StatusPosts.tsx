import { useEffect, useState } from "react";
import { formatDistance } from "date-fns";
import { Socket } from "socket.io-client";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { createPost, getPostsForUser } from "../features/posts/postsSlice";
import { getFriends } from "../features/friends/friendSlice";

const StatusPosts = ({ socket }: { socket: Socket }) => {
	const statusPosts = useAppSelector((state) => state.statusPosts.posts);
	const friends = useAppSelector((state) => state.friends.friends);
	const user = useAppSelector((state) => state.user.user);
	const [post, setPost] = useState<string>("");
	const opacity = post.length ? "" : " opacity-30";

	const dispatch = useAppDispatch();

	const postStatus = () => {
		if (user) {
			dispatch(createPost({ userId: user.userId, post }));
			setPost("");
			socket.emit("STATUS_SENT", { userId: user.userId });
		}
	};

	useEffect(() => {
		if (user) {
			dispatch(getPostsForUser({ userId: user?.userId }));
			dispatch(getFriends({ userId: user.userId }));
		}
	}, [user, dispatch]);

	useEffect(() => {
		if (user) {
			socket.on("STATUS_RECEIVED", ({ data }) => {
				const posterIsFriend = friends.some(
					(friend) => friend.userId === data.userId
				);
				if (posterIsFriend) {
					dispatch(getPostsForUser({ userId: user.userId }));
				}
			});
		}
	}, [dispatch, friends, socket, user]);

	return (
		<section className="m-5 md:m-10 xl:m-20">
			<>
				<div className="flex gap-2">
					<img
						src="avatar.png"
						alt="generic image placeholder"
						className="w-[50px] rounded-full"
					/>
					<textarea
						name="post"
						value={post}
						onChange={(e) => setPost(e.target.value)}
						className="rounded-lg border-[#1d85fc33] border-2 w-full p-1"
					/>
				</div>
				<div className="my-5 flex justify-end">
					<button
						disabled={!post.length}
						className={
							"bg-primary py-2 px-5 rounded-md text-white text-bold" + opacity
						}
						onClick={postStatus}
					>
						Post
					</button>
				</div>
			</>
			<div className="py-10">
				{statusPosts?.length
					? statusPosts.map((post, index) => (
							<div key={index} className="pb-5">
								<div className="flex gap-2">
									<img
										src="avatar.png"
										alt="generic image placeholder"
										className="w-[50px] rounded-full"
									/>
									<div>
										<p className="text-semibold">
											{post.user?.username || post.user?.email}
										</p>
										<p>
											{formatDistance(new Date(post.createdAt), new Date())}
										</p>
									</div>
								</div>
								<p className="text-lg py-2">{post.post}</p>
							</div>
					))
					: null}
			</div>
		</section>
	);
};

export default StatusPosts;
