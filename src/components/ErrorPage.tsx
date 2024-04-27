import { useRouteError } from "react-router-dom";
import { getRouterErrorMessage } from "../utils/routerError";

export default function ErrorPage() {
	const error = useRouteError();

	const errorMessage = getRouterErrorMessage({ error });

	return (
		<section className="flex flex-col justify-center items-center my-10">
			<p className="text-xl pb-2">Sorry, an unexpected error has occurred.</p>
			<p>
				<i className="text-2xl">{errorMessage}</i>
			</p>
		</section>
	);
}
