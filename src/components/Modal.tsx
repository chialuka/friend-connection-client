import {
	Dispatch,
	ReactNode,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import CloseIcon from "../svgs/CloseIcon";

type Props = {
	children: ReactNode;
	showModal: boolean;
	setShowModal: Dispatch<SetStateAction<boolean>>;
	modalClosed?: boolean;
	containerStyle?: string;
	overlayStyle?: string;
	initialStyle?: string;
	animateStyle?: string;
	headerChildren?: ReactNode;
	headerStyle?: string;
  closeModalAction?: () => void;
  functionParam?: boolean;
};

const Modal = ({
	children,
	containerStyle,
	setShowModal,
	showModal,
	overlayStyle,
	animateStyle,
	initialStyle,
	modalClosed = false,
	headerChildren,
	headerStyle,
  closeModalAction,
}: Props) => {
	const [animate, setAnimate] = useState(false);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setAnimate(true);
		}, 500);

		const closeOnEscapeKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setAnimate(false);
				setTimeout(() => {
					setShowModal(false);
				}, 400);
			}
		};
		document.body.addEventListener("keydown", closeOnEscapeKey);

		return () => {
			clearTimeout(timeoutId);
			setAnimate(false);
			document.body.removeEventListener("keydown", closeOnEscapeKey);
		};
	}, [setShowModal, showModal]);

	useEffect(() => {
		if (showModal) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [showModal]);

	useEffect(() => {
		if (modalClosed) {
			setAnimate(false);
		}
	}, [modalClosed]);

	const removeModal = () => {
		setAnimate(false);
		setTimeout(() => {
			setShowModal(false);
		}, 400);
    closeModalAction && closeModalAction();
	};
	return (
		<section
			className={`fixed h-screen top-0 left-0 w-screen z-[99] bg-[#100b16b8] ${overlayStyle}`}
		>
			<div
				className={`transition-[opacity,transform] duration-500 ease-in-out ${containerStyle} ${
					animate ? animateStyle : initialStyle
				} `}
			>
				<header
					className={`flex ${
						headerChildren ? headerStyle : "justify-end relative items-center"
					}  `}
				>
					{headerChildren}
					<button onClick={removeModal} className="">
						<CloseIcon color="#212121" />
					</button>
				</header>
				{children}
			</div>
		</section>
	);
};

export default Modal;

