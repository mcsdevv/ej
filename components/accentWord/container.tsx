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
	const height = 400

	const columns = hiragana
		.split('')
		.map((x, i) => <Col index={i} conHeight={height} conWidth={width} length={hiragana.length} high={true} />)

	return (
		<svg width={width} height={height}>
			{columns}
		</svg>
	)
}

const Col = ({ index, conWidth, conHeight, length, high }) => {
	const radius = conWidth / (length * 4)
	const wInterval = conWidth / length + radius / 2
	const hInterval = high ? 2 * radius : conHeight - 2 * radius

	return <circle cy={hInterval} cx={radius + index * wInterval} r={radius} fill='red' />
}
