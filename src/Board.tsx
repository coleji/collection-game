import { useEffect, useMemo, useState } from "react";
import Card from "./Card";
import Deck, { CardType } from "./Deck";
import {range} from 'lodash'
import { clone2dArray } from "./util";

export default function Board() {
	const COLS: number = 3;
	const ROWS: number = 4;

	const [selectedCount, setSelectedCount] = useState(0)
	
	const deck = useMemo(() => new Deck(), []);
	const [cards, setCards] = useState([] as CardType[][])
	const [selected, setSelected] = useState([] as boolean[][])

	useEffect(() => {
		console.log("init cards")
		const newCards: CardType[][] = []
		const newSelected: boolean[][] = []
		range(0, ROWS).forEach(row => {
			newCards[row] = range(0, COLS).map(() => deck.draw())
			newSelected[row] = range(0, COLS).map(() => false)
		});
		setCards(newCards)
		setSelected(newSelected)
	}, [])

	function checkSet(newSelected: boolean[][]): boolean {
		const cardsFiltered = cards.map((r, i) => r.filter((e, j) => newSelected[i][j]));
		const selectedCards = cardsFiltered.flatMap(r => r);
		if (selectedCards.length != 3) return false;

		console.log(selectedCards)

		const colorMatch = compareValues(selectedCards.map(c => c.color))
		const countMatch = compareValues(selectedCards.map(c => c.count))
		const fillMatch = compareValues(selectedCards.map(c => c.fill))
		const shapeMatch = compareValues(selectedCards.map(c => c.shape))

		console.log("colorMatch: ", colorMatch)
		console.log("countMatch: ", countMatch)
		console.log("fillMatch: ", fillMatch)
		console.log("shapeMatch: ", shapeMatch)


		return (
			colorMatch != 0 && countMatch != 0 && fillMatch != 0 && shapeMatch != 0
		)
	}


	const onClick = (i: number, j: number) => () => {
		console.log("click")
		const newSelected = clone2dArray(selected);
		const newState = !selected[i][j];
		newSelected[i][j] = newState;
		const newSelectedCount = selectedCount + (newState ? 1 : -1);

		if (newSelectedCount <= 3) {

			if (newSelectedCount == 3) {
				const set = checkSet(newSelected);
				if (set) {
					console.log("set!")
				} else {
					console.log("no set")
				}
			}
			setSelectedCount(newSelectedCount);
			setSelected(newSelected);
		}
		console.log(newSelectedCount);

	}

	// 1 if all the same, -1 if all different, 0 otherwise
	function compareValues(v: number[]): number {
		var results = v.reduce((agg, e) => {
			if (agg[String(e)] === undefined) agg[String(e)] = 0;
			agg[String(e)]++;
			return agg;
		}, {} as {[K: string]: number});
		var keys = Object.keys(results);
		console.log(results)
		console.log(keys)
		if (keys.length == 1) return 1;
		else if (keys.length == v.length) return -1;
		else return 0;
	}

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
		</>},
		[cards, selected]
	);

	return result;
}