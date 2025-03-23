import Card from "./Card";
import Deck from "./Deck";
import {range} from 'lodash'

export default class Board {
	COLS: number = 3;
	ROWS: number = 4;
	deck: Deck;
	cards: Card[][];

	selectedCards: Card[] = [];
	selectIndex: number = 0;

	constructor() {
		console.log("constructing board")
		this.deck = new Deck(this.selectListener);
		this.cards = [];
		range(0, this.ROWS).forEach(row => {
			this.cards[row] = range(0, this.COLS).map(() => this.deck.draw())
		})
	}

	private selectListener = (c: Card) => {
		console.log("clicked a card")
		console.log(this.selectIndex)
		c.selected ? this.addCard(c) : this.removeCard(c);
	}

	private addCard(c: Card) {
		this.selectedCards[this.selectIndex++] = c;
		if (this.selectIndex >= 3) {
			// check for set
			console.log("set?")
		}
	}

	private removeCard(c: Card) {

	}
}