import { cloneDeep, tail, head, range } from 'lodash'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import { useState, useEffect } from 'react'

type Props = {
	hiragana: string
	downStep: number
}

const sWidth = 3
const radius = 40 - 2 * sWidth
const wInterval = radius * 4

const isCorrect = (downStep, array: boolean[]) => {
	if (downStep === -1) {
		return !head(array) && tail(array).every((x) => x)
	}

	if (downStep === 0) {
		return head(array) && tail(array).every((x) => !x)
	}

	return (
		!head(array) &&
		array.slice(downStep, downStep + 1).every((x) => x) &&
		array.slice(downStep + 1).every((x) => !x)
	)
}

const getColour = (downStep, array) => {
	return isCorrect(downStep, array) ? 'green' : 'red'
}

const getInitialArray = (length) => Array(length).fill(false)

export default ({ hiragana, downStep }: Props) => {
	const width = 800
	const height = 240

	const [ array, setArray ] = useState(getInitialArray(hiragana.length))

	useEffect(
		() => {
			setArray(getInitialArray(hiragana.length))
		},
		[ hiragana ],
	)

	const onClick = (index) => {
		const copy = cloneDeep(array)
		copy[index] = !copy[index]
		setArray(copy)
	}

	const columns = hiragana
		.split('')
		.map((x, i) => (
			<Col key={i} letter={x} index={i} conHeight={height} high={array[i]} onClick={() => onClick(i)} />
		))

	const lines = range(0, hiragana.length - 1).map((i) => {
		return <Pair key={i} index={i} high1={array[i]} high2={array[i + 1]} />
	})

	return (
		<svg width={width} height={height}>
			{lines}
			{columns}
			<style global jsx>
				{`
					line {
						stroke: ${getColour(downStep, array)};
						stroke-width: 5px;
					}

					circle {
						fill: ${getColour(downStep, array)};
						stroke-width: ${sWidth}px;
						stroke: cornflowerblue;
					}

					text {
						fill: white;
					}
				`}
			</style>
		</svg>
	)
}

const getHeight = (high: boolean) => {
	return high ? 2 * radius : 4 * radius
}

const getCircleX = (index) => radius + index * wInterval + sWidth

const Pair = ({ index, high1, high2 }) => {
	const hInterval1 = getHeight(high1)
	const hInterval2 = getHeight(high2)

	return <line x1={getCircleX(index)} x2={getCircleX(index + 1)} y1={hInterval1} y2={hInterval2} />
}

const Col = ({ letter, index, conHeight, high, onClick }) => {
	const hInterval = getHeight(high)
	return (
		<g onClick={onClick} style={{ pointerEvents: 'all' }}>
			<g>
				<circle cy={hInterval} cx={getCircleX(index)} r={radius} />
				<text
					width={radius * 2}
					y={hInterval + radius / 2}
					x={+index * wInterval + radius / 2}
					style={{ fontSize: `${radius * 1.2}` }}
				>
					{letter}
				</text>
			</g>
			{/* The rectangle is invisible and is only here to make the g tag fill the entire column */}
			<rect x={wInterval * index - radius} width={wInterval} height={conHeight} fill={'none'} />
		</g>
	)
}
