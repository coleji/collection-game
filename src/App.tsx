import * as _ from 'lodash'
import { useState } from 'react'
import Board from './Board';

function App() {
	console.log("Rendering app")
	const [board, _setBoard] = useState<Board>(new Board());

	return <>
		<table>
			<tbody>
				{board.cards.map((row, i) => {
					return <tr key={`boardrow_${i}`}>
						{row.map((col, j) => {
							return <td key={`boardcol_${j}`}>{col.sprite()}</td>
						})}
					</tr>
				})}
			</tbody>
		</table>
	</>
}

export default App
