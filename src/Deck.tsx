import {range, shuffle} from 'lodash'

export type CardType = {
	count: number;
	shape: number;
	color: number;
	fill: number;
}

export default class Deck {
	deck: CardType[];
	head: number = 0;

	constructor() {
		console.log("constructing deck")
		const allCards = range(0,3).flatMap(count => {
			return range(0,3).flatMap(shape => {
				return range(0,3).flatMap(color => {
					return range(0,3).map(fill => {
						return {count, shape, color, fill};
					})
				})
			})
		});

		this.deck = shuffle(allCards);
	}

	canDraw() {
		return this.head < this.deck.length;
	}

	draw() {
		return this.deck[this.head++];
	}

	cardsLeft() {
		return this.deck.length - this.head
	}
}