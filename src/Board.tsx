import Card from "./Card";
import Deck from "./Deck";
import {range} from 'lodash'

export default class Board {
	COLS: number = 3;
	ROWS: number = 4;

	deck: Deck;
	cards: Card[][];

	constructor() {
		this.deck = new Deck();
		this.cards = [];
		range(0, this.ROWS).forEach(row => {
			this.cards[row] = range(0, this.COLS).map(() => this.deck.draw())
		})
	}
}