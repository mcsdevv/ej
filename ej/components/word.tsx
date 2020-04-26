// import {} from 'lodash'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

export default function Word() {
	const hiragana = 'まるばつしき'

	const wordSquares = hiragana.split('').map((x, i) => <Square key={i} letter={x} />)

	const above = wordSquares.map((x, i) => <Square key={i} />)
	const below = wordSquares.map((x, i) => <Square key={i} />)

	return (
		<div className='container'>
			THIS IS THE WORD
			<SCon>
				{above}
				{wordSquares}
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
	letter?: string
}

function Square({ letter }: Props) {
	return (
		<div className='square'>
			{!letter ? (
				<button>
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
