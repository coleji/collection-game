import * as _ from 'lodash'
import { useMemo } from 'react'
import Board from './Board';

function App() {
	const board = useMemo(() => new Board(), []);

	return <>
		<table>
			<tbody>
				{board.cards.map(row => {
					return <tr>
						{row.map(col => {
							return <td>{col.sprite()}</td>
						})}
					</tr>
				})}
			</tbody>
		</table>
	</>
}

export default App
