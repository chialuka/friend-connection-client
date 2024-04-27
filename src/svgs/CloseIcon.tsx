const CloseIcon = ({
	width = 24,
	height = 24,
	color = "#F9F9F9",
	className,
}: {
	width?: number;
	height?: number;
	color?: string;
	className?: string;
}) => {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				d="M7 7l10 10M7 17L17 7"
				stroke={color}
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default CloseIcon;
