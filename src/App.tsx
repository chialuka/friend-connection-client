import { ReactNode, useRef } from "react";
import {
	createBrowserRouter,
	RouterProvider,
	Outlet,
	redirect,
} from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import ErrorPage from "./components/ErrorPage";
import FindMembers from "./pages/FindMembers";
import Friends from "./pages/Friends";
import { useAppSelector } from "./app/hooks";
import StatusPosts from "./pages/StatusPosts";

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
					element: <FindMembers />,
					errorElement: <ErrorPage />,
					loader: protectedPageLoader,
				},
				{
					path: "/friends",
					element: <Friends />,
					errorElement: <ErrorPage />,
					loader: protectedPageLoader,
				},
        {
          path: "/posts",
          element: <StatusPosts />,
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
