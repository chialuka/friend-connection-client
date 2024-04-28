import { ReactNode, useRef } from "react";
import {
	createBrowserRouter,
	RouterProvider,
	Outlet,
	redirect,
} from "react-router-dom";
import { io } from "socket.io-client";

import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import ErrorPage from "./components/ErrorPage";
import FindMembers from "./pages/FindMembers";
import Friends from "./pages/Friends";
import { useAppSelector } from "./app/hooks";
import StatusPosts from "./pages/StatusPosts";

const SOCKET_BASE_URL = import.meta.env.VITE_APP_SOCKET_API_URL || "";

const socket = io(SOCKET_BASE_URL);

const NavbarWrapper = ({ children }: { children: ReactNode }) => {
	return <div>{children}</div>;
};

function App() {
	const user = useAppSelector((state) => state.user.user);
	const loginRef = useRef<HTMLLabelElement>(null);
	const scrollToLogin = () => {
		if (loginRef.current) {
			loginRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	const protectedPageLoader = () => {
		if (!user || (user && Array.isArray(user))) {
			return redirect("/");
		}

		return null;
	};

	const router = createBrowserRouter([
		{
			id: "root",
			path: "/",
			element: (
				<NavbarWrapper>
					<Header scrollToLogin={scrollToLogin} />
					<Outlet />
				</NavbarWrapper>
			),
			errorElement: <ErrorPage />,
			children: [
				{
					path: "/",
					element: <LandingPage ref={loginRef} />,
					errorElement: <ErrorPage />,
				},
				{
					path: "/members",
					element: <FindMembers socket={socket} />,
					errorElement: <ErrorPage />,
					loader: protectedPageLoader,
				},
				{
					path: "/friends",
					element: <Friends socket={socket} />,
					errorElement: <ErrorPage />,
					loader: protectedPageLoader,
				},
        {
          path: "/posts",
          element: <StatusPosts socket={socket} />,
          errorElement: <ErrorPage />,
          loader: protectedPageLoader,
        }
			],
		},
	]);

	return (
		<section>
			<RouterProvider
				router={router}
				fallbackElement={<p>Initial Load...</p>}
			/>
		</section>
	);
}

export default App;
