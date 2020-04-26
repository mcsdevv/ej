import ReactAudioPlayer from 'react-audio-player'
import Word from '../components/word'
import useSWR from 'swr'

export default function Home() {
	const fetcher = (url) => fetch(url).then((r) => r.json())
	let data
	if (typeof window !== 'undefined') {
		data = useSWR('/api/word', fetcher).data
		console.log(data)
	}

	return data ? (
		<div className='container'>
			<ReactAudioPlayer src={`audio/${data.audioFile}`} autoPlay={true} controls={true} />
			<Word hiragana={data.hiragana} downStep={data.downstep} />
		</div>
	) : (
		'wait'
	)
}
