import { cloneDeep } from 'lodash'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import { useState, useEffect } from 'react'
import Square from './square'

type Props = {
	hiragana: string
	downStep: number
}

const deepEq = (a, b) => {
	return JSON.stringify(a) === JSON.stringify(b)
}

const makeAnswer = (downStep, hiragana) => {
	if (downStep === -1) {
		return [ false ].concat(Array(hiragana.length - 1).fill(true))
	}
	if (downStep === 0) {
		return [ true ].concat(Array(hiragana.length - 1).fill(false))
	}

	return [ false ].concat(Array(downStep).fill(true)).concat(Array(hiragana.length - downStep - 1).fill(false))
}

const makeMatrix = (hiragana) => [ Array(hiragana.length).fill(true), Array(hiragana.length).fill(false) ]

export default function Word({ hiragana, downStep }: Props) {
	const answer = makeAnswer(downStep, hiragana)

	const [ matrix, setMatrix ] = useState(makeMatrix(hiragana))
	const [ correct, setCorrect ] = useState(false)

	useEffect(
		() => {
			setMatrix(makeMatrix(hiragana))
			setCorrect(false)
		},
		[ hiragana ],
	)

	const onClick = (row, col) => {
		const copy = cloneDeep(matrix)
		copy[0][col] = false
		copy[1][col] = false
		copy[row][col] = true
		setMatrix(copy)
		if (deepEq(answer, copy[0])) {
			setCorrect(true)
		} else {
			setCorrect(false)
		}
	}

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
			<SCon length={hiragana.length}>
				{above}
				{middle}
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
