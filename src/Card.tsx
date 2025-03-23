import { JSX, useState } from "react";

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

export default class Card {
	count: number;
	shape: number;
	color: number;
	fill: number;
	selected: boolean = false;

	constructor(count: number, shape: number, color: number, fill: number) {
		this.count = count;
		this.shape = shape;
		this.color = color;
		this.fill = fill;
	}

	select() {
		this.selected = !this.selected;
	}

	getCoordinates() {
		return {
			row: 3*this.count + this.shape,
			col: 3*this.color + this.fill
		}
	}

	spritePosition(): string {
		const coords = this.getCoordinates();
		const px = [-86 + (coords.col * -177), -77 + (coords.row * -255)]
		return `${px[0]}px ${px[1]}px`;
	}

	sprite(): JSX.Element {
		const height = "174px"
		const width = "249px"

		const [selected, setSelected] = useState(false);

		return <div style={{height, width, margin: "1px 1px",}}>
			<div style={{
				backgroundImage: "url(/cards.svg)",
				backgroundSize: "1680px",
				backgroundPosition: this.spritePosition(),
				transform: "rotate(90deg)",
				height: width,
				width: height,
				border: selected ? "2px solid red" : "",
				position: "relative",
				left: "31px",
				top: "-47px"
			}} onClick={() => {
				setSelected(!selected)
			}} />
		</div>;
	}
}