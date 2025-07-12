export const COUNT = {
	ONE: 0,
	TWO: 1,
	THREE: 2
};

export const SHAPE = {
	DIAMOND: 0,
	SQUIGGLE: 1,
	OVAL: 2
}

export const COLOR = {
	GREEN: 0,
	BLUE: 1,
	PINK: 2
}

export const FILL = {
	EMPTY: 0,
	HALF: 1,
	FULL: 2
}

export default function Card(props: {
	count: number;
	shape: number;
	color: number;
	fill: number;
	selected: boolean;
	empty: boolean
	onClick: () => void
}) {
	const height = "174px"
	const width = "249px"


	function getCoordinates() {
		return {
			row: 3*props.count + props.shape,
			col: 3*props.color + props.fill
		}
	}

	function spritePosition(): string {
		const coords = getCoordinates();
		const px = [-86 + (coords.col * -177), -77 + (coords.row * -255)]
		return `${px[0]}px ${px[1]}px`;
	}

	if (props.empty) {
		return <div style={{height, width, margin: "1px 1px",}}>
			<div style={{
				backgroundPosition: spritePosition(),
				transform: "rotate(90deg)",
				height: width,
				width: height,
				border: "",
				position: "relative",
				left: "31px",
				top: "-47px"
			}} />
		</div>;
	} else {
		return <div style={{height, width, margin: "1px 1px",}}>
			<div style={{
				backgroundImage: "url(/cards.svg)",
				backgroundSize: "1680px",
				backgroundPosition: spritePosition(),
				transform: "rotate(90deg)",
				height: width,
				width: height,
				border: props.selected ? "2px solid red" : "",
				position: "relative",
				left: "31px",
				top: "-47px"
			}} onClick={props.onClick} />
		</div>;
	}
}