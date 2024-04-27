import { useAppSelector } from "../app/hooks";
import { getGreeting } from "../utils/greeting";

const Header = ({ scrollToLogin }: { scrollToLogin: () => void }) => {
	const user = useAppSelector((state) => state.user.user);

	return (
		<nav className="flex justify-end px-5 md:px-10 lg:px-20 text-2xl border-b-[1px] border-b-black shadow-md">
			{!Array.isArray(user) && user.id ? (
				<p className="my-5">
					{getGreeting()} {user.username || user.email}
				</p>
			) : (
				<a onClick={scrollToLogin} className="my-5">Login</a>
			)}
		</nav>
	);
};

export default Header;
