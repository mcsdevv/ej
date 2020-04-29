import { cloneDeep, chunk, range } from 'lodash'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import { useState, useEffect } from 'react'

type Props = {
	hiragana: string
	downStep: number
}
export default function({ hiragana, downStep }: Props) {
	const width = 500
	const height = 140

	const [ array, setArray ] = useState(Array(hiragana.length).fill(false))

	const onClick = (index) => {
		console.error('here!')
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
		</svg>
	)
}

const caluclatePosition = (conWidth, conHeight, length, high) => {
	const sWidth = 3
	const radius = Math.min(conWidth / (length * 4), conHeight / 4) - 2 * sWidth
	const wInterval = conWidth / length + radius / 2
	const hInterval = high ? 2 * radius : conHeight - 2 * radius

	return { radius, wInterval, hInterval, sWidth }
}

const Pair = ({ index, conWidth, conHeight, length, high1, high2 }) => {
	let { radius, wInterval, hInterval } = caluclatePosition(conWidth, conHeight, length, high1)
	const hInterval1 = hInterval
	const hInterval2 = caluclatePosition(conWidth, conHeight, length, high2).hInterval

	return (
		<line
			x1={radius + index * wInterval}
			x2={radius + (index + 1) * wInterval}
			y1={hInterval1}
			y2={hInterval2}
			style={{ stroke: 'green', strokeWidth: '10px' }}
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
					cx={radius + index * wInterval}
					r={radius}
					fill='red'
					style={{ strokeWidth: `${sWidth}px`, stroke: 'blue' }}
				/>
				<text
					width={radius * 2}
					y={hInterval + radius / 2}
					x={+index * wInterval + radius / 4}
					style={{ fontSize: `${radius * 1.5}` }}
				>
					{letter}
				</text>
			</g>
			{/* The rectangle is invisible and is only here to make the g tag fill the entire column */}
			<rect x={conWidth / length * index} width={conWidth / length} height={conHeight} fill={'none'} />
		</g>
	)
}
