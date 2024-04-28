import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
	changeFriendStatus,
	getFriends,
} from "../features/friends/friendSlice";
import { Members } from "../types/Member";
import UserDisplay from "../components/UserDisplay";
import { User } from "../types/User";
import { findMembers } from "../features/members/membersSlice";
import { formatDistance } from "date-fns";
import Modal from "../components/Modal";
import {
	getFriendRequests,
	respondToFriendRequest,
} from "../features/friend-request/friendRequestSlice";

const Friends = () => {
	const user = useAppSelector((state) => state.user.user);
	const friends = useAppSelector((state) => state.friends.friends);
	const friendRequests = useAppSelector(
		(state) => state.friendRequests.requests
	);
	const dispatch = useAppDispatch();
	const [friendsToDisplay, setFriendsToDisplay] = useState<Members>([]);
	const [searchParam, setSearchParam] = useState<string>("");
	const [showModal, setShowModal] = useState<boolean>(false);
	const [modalData, setModalData] = useState<User>();

	useEffect(() => {
		if (user) {
			dispatch(getFriends({ userId: user.userId }));
			dispatch(getFriendRequests({ userId: user.userId }));
		}
	}, [dispatch, user]);

	useEffect(() => {
		setFriendsToDisplay(friends);
	}, [friends]);

	const blockFriend = async ({ friendId }: { friendId: string }) => {
		if (user) {
			const newRequest = await dispatch(
				changeFriendStatus({
					userId: user.userId,
					friendId,
					status: "blocked",
				})
			);
			if (newRequest.payload) {
				dispatch(findMembers(user.userId));
			}
			setShowModal(false);
		}
	};

	const replyRequest = async ({
		status,
		senderId,
	}: {
		status: "accepted" | "rejected";
		senderId: string;
	}) => {
		if (user) {
			const newReply = await dispatch(
				respondToFriendRequest({ senderId, status, receiverId: user.userId })
			);
			if (newReply.payload) {
				dispatch(getFriends({ userId: user.userId }));
				dispatch(getFriendRequests({ userId: user.userId }));
			}
		}
	};

	return (
		<section className="mx-5 md:mx-10 lg:mx-20 w-full">
			<section className="flex flex-col md:flex-row w-full">
				<div className="md:w-[60%] mx-10">
					<UserDisplay
						members={friends}
						setSearchParam={setSearchParam}
						setMembersToDisplay={setFriendsToDisplay}
						searchParam={searchParam}
						membersToDisplay={friendsToDisplay}
						setModalData={setModalData}
						setShowModal={setShowModal}
						showModal={showModal}
						parentComponent="friends"
					/>
				</div>
				<section className="flex flex-col justify-center items-center md:w-1/5 md:py-10">
					<p className="text-xl md:2xl py-5 font-black">Friend Requests</p>
					<div className="flex flex-wrap gap-5 justify-center">
						{friendRequests?.length ? (
							friendRequests.map((request, index) => (
								<div key={index} className="flex flex-col gap-3 my-3">
									<img
										src="avatar.png"
										alt="generic image placeholder"
										className="w-[150px]"
									/>
									<p className="text-center pt-1">
										{request.sender.username || request.sender.email}
									</p>{" "}
									<button
										className="bg-[#0866ff] text-white p-2 rounded-md"
										onClick={() =>
											replyRequest({
												status: "accepted",
												senderId: request.senderId,
											})
										}
									>
										Accept
									</button>
									<button
										className="bg-[#4B4C4F] text-white p-2 rounded-md"
										onClick={() =>
											replyRequest({
												status: "rejected",
												senderId: request.senderId,
											})
										}
									>
										Reject
									</button>
								</div>
							))
						) : (
							<p>No Friend Requests!</p>
						)}
					</div>
				</section>
			</section>
			{showModal && modalData && (
				<Modal
					showModal={showModal}
					setShowModal={setShowModal}
					overlayStyle="flex justify-center items-center"
					containerStyle="bg-white p-5 rounded-[8px] w-[250px]"
				>
					<section className="flex flex-col items-center gap-5 py-5">
						<div className="flex flex-col gap-2 items-center">
							<img
								src="avatar.png"
								alt="generic image placeholder"
								className="w-[150px]"
							/>
							{modalData.username && <p>username: {modalData.username}</p>}
							{modalData.email && <p>email: {modalData.email}</p>}
							<p>
								Joined:{" "}
								{formatDistance(new Date(modalData?.createdAt), new Date())} ago
							</p>
						</div>
						<button
							className="bg-[#e8080833] p-3 rounded-sm w-[150px]"
							onClick={() => blockFriend({ friendId: modalData.userId })}
						>
							Block Friend
						</button>
					</section>
				</Modal>
			)}
		</section>
	);
};

export default Friends;
