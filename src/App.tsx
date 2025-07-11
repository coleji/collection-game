import * as _ from 'lodash'
import { useMemo } from 'react'
import Board from './Board';

function App() {
	console.log("Rendering app")

	const board = useMemo(() => <Board />, [])

	return board
}

export default App
