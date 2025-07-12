import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "./Card";
import Deck, { CardType } from "./Deck";
import {range} from 'lodash'
import { clone2dArray } from "./util";

const COLS: number = 4;
const ROWS: number = 4;

const emptyGrid = range(0, ROWS).map(_ => {
	return range(0, COLS).map(() => false)
});

function deflatten(n: number): [number, number] {
	var col = n % (ROWS-1);
	var row = Math.floor(n / (COLS))
	return [row, col];
}

function stepForward(pos: number[]) {
	const [a, b, c, max] = pos
	if (c < max-1) return [a, b, c+1, max];
	else if (b < c-1) {
		return [a, b+1, b+2, max];
	} else if (a < b-1) {
		return [a+1, a+2, a+3, max];
	} else return null;
}

// 1 if all the same, -1 if all different, 0 otherwise
function compareValues(v: number[]): number {
	var results = v.reduce((agg, e) => {
		if (agg[String(e)] === undefined) agg[String(e)] = 0;
		agg[String(e)]++;
		return agg;
	}, {} as {[K: string]: number});
	var keys = Object.keys(results);
	// console.log(results)
	// console.log(keys)
	if (keys.length == 1) return 1;
	else if (keys.length == v.length) return -1;
	else return 0;
}

function checkSet(cards: CardType[][], newSelected: boolean[][]): boolean {
	const cardsFiltered = cards.map((r, i) => r.filter((e, j) => newSelected[i][j]));
	const selectedCards = cardsFiltered.flatMap(r => r);
	// console.log(selectedCards)
	if (selectedCards.length != 3) return false;


	const colorMatch = compareValues(selectedCards.map(c => c.color))
	const countMatch = compareValues(selectedCards.map(c => c.count))
	const fillMatch = compareValues(selectedCards.map(c => c.fill))
	const shapeMatch = compareValues(selectedCards.map(c => c.shape))

	// console.log("colorMatch: ", colorMatch)
	// console.log("countMatch: ", countMatch)
	// console.log("fillMatch: ", fillMatch)
	// console.log("shapeMatch: ", shapeMatch)


	return (
		colorMatch != 0 && countMatch != 0 && fillMatch != 0 && shapeMatch != 0
	)
}

export default function Board() {
	const [selectedCount, setSelectedCount] = useState(0)
	
	const [deck, setDeck] = useState(null as Deck | null)
	const [cards, setCards] = useState([] as CardType[][])
	const [selected, setSelected] = useState([] as boolean[][])

	const [numberSets, setNumberSets] = useState(0)
	const [cardsLeft, setCardsLeft] = useState(0)

	useEffect(() => {
		const newDeck = new Deck();
		console.log("init cards " + newDeck.cardsLeft())
		const newCards: CardType[][] = []
		const newSelected: boolean[][] = []
		range(0, ROWS).forEach(row => {
			newCards[row] = range(0, COLS).map(() => newDeck.draw())
			newSelected[row] = range(0, COLS).map(() => false)
		});
		setCards(newCards)
		setSelected(newSelected)
		setCardsLeft(newDeck.cardsLeft())
		setDeck(newDeck)
		setTimeout(() => findAllSets(newCards), 20);
		// range(0, 12).map(deflatten).forEach(s => console.log(s))
	}, [])


	const findAllSets = useCallback((cards: CardType[][]) => {
		var pos: number[] | null = [0,1,2,ROWS * COLS];
		var count = 0;
		while (pos != null) {
			const selectedInner = clone2dArray(emptyGrid);
			const deflattened = [deflatten(pos[0]), deflatten(pos[1]), deflatten(pos[2])]
			deflattened.forEach(point => selectedInner[point[0]][point[1]] = true);
			// console.log(selected)
			if (checkSet(cards, selectedInner)) {
				count++;
			} else {
				// console.log("not a set: ", deflattened)
			}
			pos = stepForward(pos);
		}
		setNumberSets(count)
		console.log("# of sets: " + count)
	},[setNumberSets])


	const onClick = useCallback((i: number, j: number) => () => {
		console.log("click")
		if (deck === null) return;
		const newSelected = clone2dArray(selected);
		const newState = !selected[i][j];
		newSelected[i][j] = newState;
		const newSelectedCount = selectedCount + (newState ? 1 : -1);

		if (newSelectedCount <= 3) {
			if (newSelectedCount == 3) {
				const set = checkSet(cards, newSelected);
				if (set) {
					console.log("set!")
					const newCards = clone2dArray(cards)
					newSelected.forEach((row, i) => {
						row.forEach((e, j) => {
							if (e) {
								newCards[i][j] = deck.draw();
								newSelected[i][j] = false;
							}
						})
					})
					setCards(newCards)
					setSelectedCount(0)
					setSelected(newSelected);
					console.log(deck.cardsLeft() + " cards left")
					setCardsLeft(deck.cardsLeft())
					setTimeout(() => findAllSets(newCards), 20);
					return;
				} else {
					console.log("no set")
				}
			}
			setSelected(newSelected);
			setSelectedCount(newSelectedCount);
		}
		// console.log(newSelectedCount);

	}, [selected, selectedCount, cards])

	const result = useMemo(() => {
		console.log("calc board")
		// console.log(selectedCount)
		// console.log(cards)
		// console.log(selected)
		return <>
			<table>
				<tbody>
					{cards.map((row, i) => {
						return <tr key={`boardrow_${i}`}>
							{row.map((col, j) => {
								const card = <Card
									count={col.count}
									shape={col.shape}
									color={col.color}
									fill={col.fill}
									selected={selected[i][j]}
									onClick={onClick(i, j)}
								/>
								return <td key={`boardcol_${j}`}>{card}</td>
							})}
						</tr>
					})}
				</tbody>
			</table>
			<br />
			Number of sets: {numberSets}
			<br />
			<br />
			Cards left: {cardsLeft}
		</>},
		[cards, selected, numberSets, cardsLeft, onClick]
	);

	return result;
}