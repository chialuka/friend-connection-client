import { useRef } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import ErrorPage from "./components/ErrorPage";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  }
])

function App() {
  const loginRef = useRef<HTMLLabelElement>(null);

  const scrollToLogin = () => {
    if (loginRef.current) {
      loginRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }
	return (
		<section>
      <Header scrollToLogin={scrollToLogin} />
			<RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
		</section>
	);
}

export default App;
