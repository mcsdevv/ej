import { cloneDeep } from 'lodash'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import { useState } from 'react'
import Square from './square'

type Props = {
	hiragana: string
	downStep: number
}

export default function Word({ hiragana, downStep }: Props) {
	const deepEq = (a, b) => {
		return JSON.stringify(a) === JSON.stringify(b)
	}

	const makeAnswer = (downStep) => {
		if (downStep === -1) {
			return [ false ].concat(Array(hiragana.length - 1).fill(true))
		}
		if (downStep === 0) {
			return [ true ].concat(Array(hiragana.length - 1).fill(false))
		}

		return [ false ].concat(Array(downStep).fill(true)).concat(Array(hiragana.length - downStep - 1).fill(false))
	}
	const answer = makeAnswer(downStep)

	const [ matrix, setMatrix ] = useState([ Array(hiragana.length).fill(false), Array(hiragana.length).fill(true) ])

	const [ correct, setCorrect ] = useState(false)

	const onClick = (row, col) => {
		const copy = cloneDeep(matrix)

		for (let i = 0; i < 2; i++) {
			copy[i][col] = false
		}
		copy[row][col] = true
		setMatrix(copy)

		console.log(answer, copy[0])

		if (deepEq(answer, copy[0])) {
			setCorrect(true)
			console.log('HERE')
		} else {
			setCorrect(false)
		}
	}
	console.log(correct)

	const middle = hiragana
		.split('')
		.map((x, i) => (
			<Square correct={correct} onClick={() => onClick(1, i)} key={i} letter={x} display={matrix[1][i]} />
		))

	const above = middle.map((x, i) => (
		<Square {...x.props} correct={correct} onClick={() => onClick(0, i)} key={i} display={matrix[0][i]} />
	))

	return (
		<div className='container'>
			THIS IS THE WORD
			<SCon length={hiragana.length}>
				{above}
				{middle}
				{/* {below} */}
			</SCon>
		</div>
	)
}

function SCon({ length, children }) {
	return (
		<div className='sCon'>
			{children}
			<style jsx>
				{`
					.sCon {
						width: ${55 * length}px;
						height: 150px;
					}
				`}
			</style>
		</div>
	)
}
