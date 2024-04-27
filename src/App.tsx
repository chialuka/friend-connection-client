import { useRef } from "react";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";

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
			<LandingPage ref={loginRef} />
		</section>
	);
}

export default App;
