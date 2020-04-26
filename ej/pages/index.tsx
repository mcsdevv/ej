import ReactAudioPlayer from 'react-audio-player'
import Word from '../components/word'

export default function Home() {
	return (
		<div className='container'>
			<ReactAudioPlayer src='audio/○×式.yomi00013273_004A.wav' autoPlay={true} controls={true} />
			<Word hiragana={'はしが'} downStep={1} />
		</div>
	)
}
