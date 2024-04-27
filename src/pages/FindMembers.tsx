import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { findMembers } from "../features/members/membersSlice";
import { Members } from "../types/Member";

const FindMembers = () => {
	const members = useAppSelector((state) => state.members.members);
	const user = useAppSelector((state) => state.user.user);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [membersToDisplay, setMembersToDisplay] = useState<Members>([]);
	const [searchParam, setSearchParam] = useState<string>("");

	useEffect(() => {
		if (!Array.isArray(user) && user.id) {
			dispatch(findMembers(user.userId));
			setMembersToDisplay(members);
		} else {
			navigate("/");
		}
	}, [dispatch, navigate, user, members.length]);

  const searchUsers = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchParam(value);
    const searchResults = members.filter(
      (member) =>
        member.username?.toLowerCase().includes(value.toLowerCase()) ||
        member.email?.toLowerCase().includes(value.toLowerCase())
    );
    setMembersToDisplay(searchResults);
  }

	return (
		<section className="mx-5 py-10 md:mx-10">
			<h1 className="text-center text-3xl text-main">Find Friends</h1>
			<div className="flex justify-end py-5 md:py-10 items-center gap-2">
				<input
					type="text"
					name="searchParam"
					value={searchParam}
					onChange={searchUsers}
          className="border-[1px] border-main outline-main py-2 rounded-md px-1"
				/>
				<label>Search</label>
			</div>
			{membersToDisplay.length ? (
				<section className="flex flex-wrap gap-5 md:gap-10 justify-center">
					{membersToDisplay.map((member, index) => (
						<div key={index} className="flex flex-col cursor-pointer">
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
		</section>
	);
};

export default FindMembers;
