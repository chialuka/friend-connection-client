import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getGreeting } from "../utils/greeting";
import { logout } from "../features/auth/authSlice";

const Header = ({ scrollToLogin }: { scrollToLogin: () => void }) => {
	const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  const logUserOut = () => {
    dispatch(logout());
  };

	return (
		<nav className="flex px-5 md:px-10 lg:px-20 text-2xl border-b-[1px] border-b-black shadow-md bg-[#1d85fc33]">
			{user ? (
				<div className="my-5 flex justify-between w-full">
					<div className="flex gap-10">
						<Link to="/posts">Posts</Link>
						<Link to="/friends">Friends</Link>
						<Link to="/members">Connect</Link>
            <button className="text-xl" onClick={logUserOut}>Logout</button>
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
