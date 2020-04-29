type Props = {
	letter: string
	display: boolean
	onClick: any
	correct: boolean
}

export default ({ letter, display, correct, onClick }: Props) => {
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
					border: 1px solid ${correct ? 'green' : 'red'};
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
