import { cloneDeep } from 'lodash'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import { useState, useEffect } from 'react'

type Props = {
	hiragana: string
	downStep: number
}
export default function({ hiragana, downStep }: Props) {
	const width = 800
	const height = 300

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
				index={i}
				conHeight={height}
				conWidth={width}
				length={hiragana.length}
				high={array[i]}
				onClick={() => onClick(i)}
			/>
		))

	return (
		<svg width={width} height={height}>
			{columns}
		</svg>
	)
}

const Col = ({ index, conWidth, conHeight, length, high, onClick }) => {
	const radius = Math.min(conWidth / (length * 4), conHeight / 4)
	const wInterval = conWidth / length + radius / 2
	const hInterval = high ? 2 * radius : conHeight - 2 * radius

	return (
		<a>
			<g onClick={onClick} style={{ pointerEvents: 'all' }}>
				<circle cy={hInterval} cx={radius + index * wInterval} r={radius} fill='red' />
				{/* The rectangle is invisible and is only here to make the g tag fill the entire column */}
				<rect x={conWidth / length * index} width={conWidth / length} height={conHeight} fill={'none'} />
			</g>
		</a>
	)
}
