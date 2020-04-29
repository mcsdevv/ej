import { cloneDeep, chunk, head, range } from 'lodash'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import { useState, useEffect } from 'react'

type Props = {
	hiragana: string
	downStep: number
}

const sWidth = 3

const isCorrect = (downStep, array: boolean[]) => {
	if (downStep === -1) {
		return !head(array) && array.slice(1).every((x) => x)
	}

	if (downStep === 0) {
		return head(array) && array.slice(1).every((x) => !x)
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

export default function({ hiragana, downStep }: Props) {
	const width = 800
	const height = 240

	const [ array, setArray ] = useState(Array(hiragana.length).fill(false))

	useEffect(
		() => {
			setArray(Array(hiragana.length).fill(false))
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
			<Col
				key={i}
				letter={x}
				index={i}
				conHeight={height}
				conWidth={width}
				length={hiragana.length}
				high={array[i]}
				onClick={() => onClick(i)}
			/>
		))

	const lines = range(0, hiragana.length - 1).map((i) => {
		return (
			<Pair
				key={i}
				index={i}
				conHeight={height}
				conWidth={width}
				length={hiragana.length}
				high1={array[i]}
				high2={array[i + 1]}
			/>
		)
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

const caluclatePosition = (conWidth, conHeight, length, high) => {
	// const radius = Math.min(conWidth / (length * 4), conHeight / 4) - 2 * sWidth
	const radius = 40 - 2 * sWidth
	// const wInterval = conWidth / length + radius / 2
	const wInterval = radius * 4
	const hInterval = high ? 2 * radius : conHeight - 2 * radius

	return { radius, wInterval, hInterval, sWidth }
}

const Pair = ({ index, conWidth, conHeight, length, high1, high2 }) => {
	let { radius, wInterval, hInterval } = caluclatePosition(conWidth, conHeight, length, high1)
	const hInterval1 = hInterval
	const hInterval2 = caluclatePosition(conWidth, conHeight, length, high2).hInterval

	return (
		<line
			x1={radius + index * wInterval + sWidth}
			x2={radius + (index + 1) * wInterval}
			y1={hInterval1}
			y2={hInterval2}
			// style={{ stroke: 'green', strokeWidth: '10px' }}
		/>
	)
}

const Col = ({ letter, index, conWidth, conHeight, length, high, onClick }) => {
	let { radius, wInterval, hInterval, sWidth } = caluclatePosition(conWidth, conHeight, length, high)
	return (
		<g onClick={onClick} style={{ pointerEvents: 'all' }}>
			<g>
				<circle
					cy={hInterval}
					cx={radius + index * wInterval + sWidth}
					r={radius}
					// fill='red'
					// style={{ strokeWidth: `${sWidth}px`, stroke: 'blue' }}
				/>
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
