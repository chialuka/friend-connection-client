import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { getGreeting } from "../utils/greeting";

const Header = ({ scrollToLogin }: { scrollToLogin: () => void }) => {
	const user = useAppSelector((state) => state.user.user);

	return (
		<nav className="flex px-5 md:px-10 lg:px-20 text-2xl border-b-[1px] border-b-black shadow-md bg-[#1d85fc33]">
			{user ? (
				<div className="my-5 flex justify-between w-full">
					<div className="flex gap-10">
						<Link to="/posts">Posts</Link>
						<Link to="/friends">Friends</Link>
						<Link to="/members">Connect</Link>
					</div>
					<p>
						{getGreeting()} {user.username || user.email}
					</p>
				</div>
			) : (
				<div onClick={scrollToLogin} className="flex justify-end w-full cursor-pointer">
					<a className="my-5 text-black">
						Login
					</a>
				</div>
			)}
		</nav>
	);
};

export default Header;
