import {range, shuffle} from 'lodash'
import { shuffleArrayAfterIndex } from './util';

export type CardType = {
	count: number;
	shape: number;
	color: number;
	fill: number;
	empty: boolean;
}

export const emptyCard: CardType = {
	count: -1,
	shape: -1,
	color: -1,
	fill: -1,
	empty: true
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
						return {count, shape, color, fill, empty: false};
					})
				})
			})
		});//.slice(0,27);

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

	replace(card: CardType) {
		this.deck.push(card);
	}

	shuffleRemaining() {
		this.deck = shuffleArrayAfterIndex(this.deck, this.head);
	}
}