import { cloneDeep } from 'lodash'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import { useState } from 'react'

export default function Word() {
	const hiragana = 'まるばつしき'

	const [ state, setState ] = useState([
		Array(hiragana.length).fill(false),
		Array(hiragana.length).fill(true),
		Array(hiragana.length).fill(false),
	])

	const onClick = (row, col) => {
		const copy = cloneDeep(state)

		for (let i = 0; i < 3; i++) {
			copy[i][col] = false
		}
		copy[row][col] = true
		setState(copy)
	}

	const middle = hiragana
		.split('')
		.map((x, i) => <Square onClick={() => onClick(1, i)} key={i} letter={x} display={state[1][i]} />)

	const above = middle.map((x, i) => (
		<Square {...x.props} onClick={() => onClick(0, i)} key={i} display={state[0][i]} />
	))
	const below = middle.map((x, i) => (
		<Square {...x.props} onClick={() => onClick(2, i)} key={i} display={state[2][i]} />
	))

	return (
		<div className='container'>
			THIS IS THE WORD
			<SCon>
				{above}
				{middle}
				{below}
			</SCon>
		</div>
	)
}

function SCon({ children }) {
	return (
		<div className='sCon'>
			{children}
			<style jsx>
				{`
					.sCon {
						width: 400px;
						height: 150px;
					}
				`}
			</style>
		</div>
	)
}

type Props = {
	letter: string
	display: boolean
	onClick: any
}

function Square({ letter, display, onClick }: Props) {
	return (
		<div className='square'>
			{!display ? (
				<button onClick={onClick}>
					<p />
				</button>
			) : (
				<p>{letter}</p>
			)}
			<style jsx>{`
				.square {
					float: left;
					display: table-cell;
					width: 50px;
					height: 50px;
					border: 5px solid red;
				}
				button {
					width: 100%;
					height: 100%;
				}
				p {
					text-align: center;
				}
			`}</style>
		</div>
	)
}
