import { useNavigate } from "react-router-dom";
import { Members } from "../types/Member";
import { User } from "../types/User";

interface UserDisplayProps {
	members: Members;
	searchParam: string;
	membersToDisplay: Members;
	setModalData: React.Dispatch<React.SetStateAction<User | undefined>>;
	showModal: boolean;
	setSearchParam: React.Dispatch<React.SetStateAction<string>>;
	setMembersToDisplay: React.Dispatch<React.SetStateAction<Members>>;
	parentComponent: "members" | "friends";
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserDisplay: React.FC<UserDisplayProps> = ({
	members,
	searchParam,
	membersToDisplay,
	setModalData,
	setShowModal,
	setSearchParam,
	setMembersToDisplay,
	parentComponent,
}) => {
	const navigate = useNavigate();
	const searchUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setSearchParam(value);
		const searchResults = members.filter(
			(member) =>
				member.username?.toLowerCase().includes(value.toLowerCase()) ||
				member.email?.toLowerCase().includes(value.toLowerCase())
		);
		setMembersToDisplay(searchResults);
	};

	return (
		<>
			{" "}
			{membersToDisplay?.length ? (
				<>
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
				</>
			) : parentComponent === "friends" ? (
				<div className="flex flex-col items-center">
					<p className="text-xl py-10">You do not have any friends yet</p>
					<button
						className="bg-[#1d85fc33] p-3 rounded-md w-[150px] font-bold"
						onClick={() => navigate("/members")}
					>
						Find Friends
					</button>
					<img
						className="sm:max-w-[500px] h-auto"
						src="connect.jpg"
						alt="vector showing people connecting"
					/>
				</div>
			) : (
				<div className="flex flex-col items-center">
					<p className="text-xl py-10 text-center">
						Hey! There aren't any new users available at the moment. Check back
						soon!
					</p>
					<img
						className="sm:max-w-[500px] h-auto"
						src="search.jpg"
						alt="vector showing a person on a paper airplane holding binoculars for searching"
					/>
				</div>
			)}
		</>
	);
};

export default UserDisplay;
