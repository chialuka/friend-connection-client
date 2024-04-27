import { ChangeEvent, useEffect, useState } from "react";
import { formatDistance } from "date-fns";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { findMembers } from "../features/members/membersSlice";
import { Members } from "../types/Member";
import Modal from "../components/Modal";
import { User } from "../types/User";
import { sendFriendRequest } from "../features/friend-request/friendRequestSlice";

const FindMembers = () => {
	const members = useAppSelector((state) => state.members.members);
	const user = useAppSelector((state) => state.user.user);
	const dispatch = useAppDispatch();
	const [membersToDisplay, setMembersToDisplay] = useState<Members>([]);
	const [searchParam, setSearchParam] = useState<string>("");
	const [showModal, setShowModal] = useState<boolean>(false);
	const [modalData, setModalData] = useState<User>();

	useEffect(() => {
		if (!Array.isArray(user) && user.id) {
			dispatch(findMembers(user.userId));
			setMembersToDisplay(members);
		}
	}, [dispatch, user, members.length]);

	const searchUsers = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setSearchParam(value);
		const searchResults = members.filter(
			(member) =>
				member.username?.toLowerCase().includes(value.toLowerCase()) ||
				member.email?.toLowerCase().includes(value.toLowerCase())
		);
		setMembersToDisplay(searchResults);
	};

  const sendRequestToUser = async ({ receiverId }: { receiverId: string }) => {
    if (!Array.isArray(user)) {
      const newRequest = await dispatch(
        sendFriendRequest({
          senderId:  user.userId,
          receiverId,
        })
      );
      if (newRequest.payload) {
        dispatch(findMembers(user.userId));
      }
      setShowModal(false);
    }
	};

	return (
		<section className="mx-5 py-10 md:mx-10">
			<h1 className="text-center text-3xl text-primary">Find Friends</h1>
			<div className="flex justify-end py-5 md:py-10 items-center gap-2">
				<input
					type="text"
					name="searchParam"
					value={searchParam}
					onChange={searchUsers}
					className="border-[1px] border-primary outline-primary py-2 rounded-md px-1"
				/>
				<label>Search</label>
			</div>
			{membersToDisplay.length ? (
				<section className="flex flex-wrap gap-5 md:gap-10 justify-center">
					{membersToDisplay.map((member, index) => (
						<div
							key={index}
							className="flex flex-col cursor-pointer"
							onClick={() => {
								setShowModal(true);
								setModalData(member);
							}}
						>
							<img
								src="avatar.png"
								alt="generic image placeholder"
								className="w-[150px]"
							/>
							<p className="text-center pt-1">
								{member.username || member.email}
							</p>
						</div>
					))}
				</section>
			) : null}
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
