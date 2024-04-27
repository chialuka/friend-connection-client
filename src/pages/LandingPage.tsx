import { forwardRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addNewUser } from "../features/auth/authSlice";
import { z } from "zod";

interface LandingProps {
  ref: React.Ref<HTMLLabelElement>;
}

const LandingPage = forwardRef<HTMLLabelElement, LandingProps>(function LandingPage(props, ref) {
	const user = useAppSelector((state) => state.user.user);
	const dispatch = useAppDispatch();
	const [name, setName] = useState("");

	const saveUser = async () => {
		if (user.length) {
			return;
		}
		const { success } = z.string().email().safeParse(name);
		const result = await dispatch(
			addNewUser({ [success ? "email" : "username"]: name })
		);
		console.log(result, "the result");
	};
	return (
		<section className="flex flex-col lg:flex-row lg:gap-10 lg:justify-between m-5 md:m-10 lg:mx-20">
			<section className="flex flex-col justify-evenly lg:w-1/2 py-10 gap-5 md:gap-10">
				<h1 className="font-gentiumBasic text-5xl font-extrabold text-main">
					Friends Connect
				</h1>
				<p className="text-3xl font-bold">
					Connect with the people that matter the most to you.
				</p>
				<p className="text-2xl">
					Friends Connect allows you to connect easily with family and friends.
					Keep your friends in the loop by sharing status updates that they can
					view in real time!{" "}
				</p>
				<label ref={ref} className="text-2xl">
					Enter your email address or username to get started!
				</label>
				<input
					placeholder="Email or username"
					type="text"
					name="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="outline-main rounded-md p-5 border-2 border-main"
				/>
				<div className="flex justify-center">
					<button
						className="bg-main w-[200px] p-5 text-white font-bold rounded-md"
						onClick={saveUser}
					>
						Get Started!
					</button>
				</div>
			</section>
			<section className="flex justify-center">
				<img
					src="friends-connect.jpg"
					alt="three friends holding hands and facing backwards"
					height="auto"
					className="w-[500px]"
				/>
			</section>
		</section>
	);
});

export default LandingPage;
