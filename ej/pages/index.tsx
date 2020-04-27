import ReactAudioPlayer from 'react-audio-player'
import Word from '../components/word'
import useSWR, { mutate } from 'swr'
import { useEffect, useState } from 'react'

export default function Home() {
	if (typeof window === 'undefined') {
		return <div>hello from server</div>
	}
	const [ data, setData ] = useState(null)
	console.error(data)

	useSWR('/api/word', (url) => {
		fetch(url).then((res) => res.json()).then((json) => setData(json))
	})

	return data ? (
		<div className='container'>
			<ReactAudioPlayer src={`audio/${data.audioFile}`} autoPlay={true} controls={true} />
			<Word hiragana={data.hiragana} downStep={data.downstep} />
			<button
				onClick={() => {
					mutate('/api/word')
					// load()
					// setData(load())
				}}
			>
				NEXT
			</button>
		</div>
	) : (
		'wait'
	)
}
