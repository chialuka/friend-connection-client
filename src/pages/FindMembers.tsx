import { useEffect, useState } from "react";
import { formatDistance } from "date-fns";
import { Socket } from "socket.io-client";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { findMembers } from "../features/members/membersSlice";
import { Members } from "../types/Member";
import { User } from "../types/User";
import { sendFriendRequest } from "../features/friend-request/friendRequestSlice";
import UserDisplay from "../components/UserDisplay";
import Modal from "../components/Modal";

const FindMembers = ({ socket }: { socket: Socket }) => {
	const members = useAppSelector((state) => state.members.members);
	const user = useAppSelector((state) => state.user.user);
	const dispatch = useAppDispatch();
	const [membersToDisplay, setMembersToDisplay] = useState<Members>([]);
	const [searchParam, setSearchParam] = useState<string>("");
	const [showModal, setShowModal] = useState<boolean>(false);
	const [modalData, setModalData] = useState<User>();

	useEffect(() => {
		if (user) {
			dispatch(findMembers(user.userId));
		}
	}, [dispatch, user]);

	useEffect(() => {
		setMembersToDisplay(members);
	}, [members]);

	const sendRequestToUser = async ({ receiverId }: { receiverId: string }) => {
		if (user) {
			const newRequest = await dispatch(
				sendFriendRequest({
					senderId: user.userId,
					receiverId,
				})
			);
			socket.emit("FRIEND_REQUEST_SENT", {
				senderId: user.userId,
				receiverId,
			});
			if (newRequest.payload) {
				dispatch(findMembers(user.userId));
			}
			setShowModal(false);
		}
	};

	return (
		<section className="mx-5 py-10 md:mx-10">
			<h1 className="text-center text-3xl text-primary">Find Friends</h1>
			<UserDisplay
				members={members}
				setMembersToDisplay={setMembersToDisplay}
				searchParam={searchParam}
				setSearchParam={setSearchParam}
				membersToDisplay={membersToDisplay}
				setShowModal={setShowModal}
				setModalData={setModalData}
				showModal={showModal}
				parentComponent="members"
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
							className="bg-[#1d85fc33] p-3 rounded-sm w-[150px]"
							onClick={() =>
								sendRequestToUser({ receiverId: modalData.userId })
							}
						>
							Add Friend
						</button>
					</section>
				</Modal>
			)}
		</section>
	);
};

export default FindMembers;
