import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getGreeting } from "../utils/greeting";
import { logout } from "../features/auth/authSlice";
import { useState } from "react";

const NavigationLinks = () => {
	return (
		<div className="flex flex-col lg:flex-row gap-3 lg:gap-5 lg:text-bold">
			<NavLink to="/posts">
				{({ isActive }) => (
					<span className={isActive ? "text-primary" : "text-black"}>
						Posts
					</span>
				)}
			</NavLink>
			<NavLink to="/friends">
				{({ isActive }) => (
					<span className={isActive ? "text-primary" : "text-black"}>
						Friends
					</span>
				)}
			</NavLink>
			<NavLink to="/members">
				{({ isActive }) => (
					<span className={isActive ? "text-primary" : "text-black"}>
						Connect
					</span>
				)}
			</NavLink>
		</div>
	);
};

const Header = ({ scrollToLogin }: { scrollToLogin: () => void }) => {
	const user = useAppSelector((state) => state.user.user);
	const dispatch = useAppDispatch();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

	const logUserOut = () => {
		dispatch(logout());
	};

	return (
		<nav className="flex px-5 md:px-10 lg:px-20 text-2xl border-b-[1px] border-b-black shadow-md bg-[#1d85fc33] overflow-x-hidden">
			{user ? (
				<>
					<div className="hidden my-5 lg:flex justify-between w-full">
						<div className="flex gap-10">
							<NavigationLinks />
							<button className="text-xl" onClick={logUserOut}>
								Logout
							</button>
						</div>
						<p>
							{getGreeting()} {user.username || user.email}
						</p>
					</div>
					<div className="flex lg:hidden py-8">
						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="lg:hidden flex flex-col justify-center items-center z-10 absolute right-6 top-6 md:right-[4rem]"
						>
							<span
								className={`bg-black block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
									isMobileMenuOpen
										? "rotate-45 translate-y-1"
										: "-translate-y-0.5"
								}`}
							></span>
							<span
								className={`bg-black block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
									isMobileMenuOpen ? "opacity-0" : "opacity-100"
								}`}
							></span>
							<span
								className={`bg-black block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
									isMobileMenuOpen
										? "-rotate-45 -translate-y-1"
										: "translate-y-0.5"
								}`}
							></span>
						</button>
						<aside
							className={
								"fixed bg-[#b0c5dd] top-0 right-0 w-[250px] h-[250px] z-20 p-2 pl-2 ease-in-out duration-1000 rounded-md " +
								(isMobileMenuOpen ? "-translate-x-0" : "translate-x-full")
							}
						>
							<div
								className="p-2 flex flex-col gap-5"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<div className="flex justify-end">
									<svg
										className="h-8 w-8 text-gray-600"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<line x1="18" y1="6" x2="6" y2="18" />
										<line x1="6" y1="6" x2="18" y2="18" />
									</svg>
								</div>
								<NavigationLinks />
								<button
									className="text-xl text-bolder text-left"
									onClick={logUserOut}
								>
									Logout
								</button>
							</div>
						</aside>
					</div>
				</>
			) : (
				<div className="flex justify-end w-full cursor-pointer">
					<a className="my-5 text-black" onClick={scrollToLogin}>
						Login
					</a>
				</div>
			)}
		</nav>
	);
};

export default Header;
