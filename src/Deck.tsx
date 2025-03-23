import {range, shuffle} from 'lodash'
import Card from './Card'

export default class Deck {
	deck: Card[];
	head: number = 0;

	constructor(selectListener: (c: Card) => void) {
		const allCards = range(0,3).flatMap(count => {
			return range(0,3).flatMap(shape => {
				return range(0,3).flatMap(color => {
					return range(0,3).map(fill => {
						return new Card(count, shape, color, fill, selectListener);
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
}