import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "./Card";
import Deck, { CardType, emptyCard } from "./Deck";
import _, {range} from 'lodash'
import { clone2dArray } from "./util";

const COLS: number = 3;
const ROWS: number = 4;

const emptyGrid = range(0, ROWS).map(_ => {
	return range(0, COLS).map(() => false)
});

function deflatten(n: number): [number, number] {
	var col = n % COLS;
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
	if (keys.length == 1) return 1;
	else if (keys.length == v.length) return -1;
	else return 0;
}

function checkSet(cards: CardType[][], newSelected: boolean[][]): boolean {
	const cardsFiltered = cards.map((r, i) => r.filter((_e, j) => newSelected[i][j]));
	const selectedCards = cardsFiltered.flatMap(r => r);
	if (selectedCards.length != 3) return false;
	if (selectedCards.filter(c => c.empty).length > 0) return false;


	const colorMatch = compareValues(selectedCards.map(c => c.color))
	const countMatch = compareValues(selectedCards.map(c => c.count))
	const fillMatch = compareValues(selectedCards.map(c => c.fill))
	const shapeMatch = compareValues(selectedCards.map(c => c.shape))

	return (
		colorMatch != 0 && countMatch != 0 && fillMatch != 0 && shapeMatch != 0
	)
}

export default function Board() {
	const [selectedCount, setSelectedCount] = useState(0)
	
	const [deck, setDeck] = useState(null as Deck | null)
	const [cards, setCards] = useState([] as CardType[][])
	const [selected, setSelected] = useState([] as boolean[][])

	const [cardsLeft, setCardsLeft] = useState(0)

	const [availableSets, setAvailableSets] = useState([] as boolean[][][])
	const [hintIndex, setHintIndex] = useState(0);
	const [showHint, setShowHint] = useState(false)

	function doShowHint() {
		setHintIndex((hintIndex+1) % availableSets.length)
		setShowHint(true)
	}

	const shuffle = useCallback(() => {
		if (deck === null) return;
		const newCards: CardType[][] = []
		range(0, ROWS).forEach((_row, i) => {
			range(0, COLS).forEach((_e, j) => deck.replace(cards[i][j]))
		});
		deck.shuffleRemaining();
		range(0, ROWS).forEach(row => {
			newCards[row] = range(0, COLS).map(() => deck.draw())
		});
		setCards(newCards);
		setCardsLeft(deck.cardsLeft())
		setShowHint(false)
		setTimeout(() => findAllSets(newCards), 20);
	}, [deck, cards])

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
		var newAvailableSets = [];
		while (pos != null) {
			const selectedInner = clone2dArray(emptyGrid);
			const deflattened = [deflatten(pos[0]), deflatten(pos[1]), deflatten(pos[2])]
			deflattened.forEach(point => selectedInner[point[0]][point[1]] = true);
			if (checkSet(cards, selectedInner)) {
				newAvailableSets.push(selectedInner)
			}
			pos = stepForward(pos);
		}
		setAvailableSets(_.shuffle(newAvailableSets))
		console.log("# of sets: " + count)
	},[setAvailableSets])


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
								if (deck.canDraw()) {
									newCards[i][j] = deck.draw();
								} else {
									newCards[i][j] = emptyCard;
								}
								
								newSelected[i][j] = false;
							}
						})
					})
					setCards(newCards)
					setSelectedCount(0)
					setSelected(newSelected);
					console.log(deck.cardsLeft() + " cards left")
					setCardsLeft(deck.cardsLeft())
					setShowHint(false)
					setHintIndex(0)
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
		const empty = <Card
			count={-1}
			shape={-1}
			color={-1}
			fill={-1}
			selected={false}
			empty={true}
			onClick={() => {}}
		/>;

		return <>
			<table><tbody><tr>
				<td>
					<table>
						<tbody>
							{cards.map((row, i) => {
								return <tr key={`boardrow_${i}`}>
									{row.map((col, j) => {
										return <td key={`boardcol_${j}`}>{col.empty ? empty : <Card
											count={col.count}
											shape={col.shape}
											color={col.color}
											fill={col.fill}
											selected={selected[i][j]}
											empty={false}
											onClick={onClick(i, j)}
										/>}</td>
									})}
								</tr>
							})}
						</tbody>
					</table>
					<button onClick={shuffle}>Shuffle</button>
					<br />
					<br />
					Number of sets: {availableSets.length}
					<br />
					<br />
					Cards left: {cardsLeft}
				</td>
				<td style={{verticalAlign: "top"}}>
					<button onClick={doShowHint}>Show Hint</button>
					{showHint && <table><tbody>
					{_.range(0, ROWS).map((_row, i) => {
						return <tr>{_.range(0, COLS).map((_e, j) => {
							if (availableSets[hintIndex] && availableSets[hintIndex][i][j]) return <td style={{backgroundColor: "red"}}>&nbsp;&nbsp;&nbsp;&nbsp;</td>
							else return <td style={{border: "1px solid black"}}>&nbsp;&nbsp;&nbsp;&nbsp;</td>
						})}</tr>
					})}
					</tbody></table>}

				</td>
			</tr></tbody></table>
			
		</>},
		[cards, selected, availableSets, cardsLeft, onClick, showHint, hintIndex]
	);

	return result;
}