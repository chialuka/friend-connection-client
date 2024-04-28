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

const Friends = () => {
	const user = useAppSelector((state) => state.user.user);
	const friends = useAppSelector((state) => state.friends.friends);
	const dispatch = useAppDispatch();
	const [friendsToDisplay, setFriendsToDisplay] = useState<Members>([]);
	const [searchParam, setSearchParam] = useState<string>("");
	const [showModal, setShowModal] = useState<boolean>(false);
	const [modalData, setModalData] = useState<User>();

	useEffect(() => {
		if (user) {
			dispatch(getFriends(user.userId));
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

	return (
		<section className="mx-5 md:mx-10 lg:mx-20">
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
