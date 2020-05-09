import ReactAudioPlayer from 'react-audio-player'
import Container from '../components/accentWord/container'
import useSWR from 'swr'
import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Main from '../components/main'

function between(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export default function Home() {
    if (typeof window === 'undefined') {
        return <div>hello from server</div>
    }

    const [ids, setRange] = useState([859])

    const chooseId = () => {
        return ids[between(0, ids.length - 1)]
    }

    useSWR(`/api/range`, async (url) => {
        await fetch(url)
            .then((res) => res.json())
            .then((json) => setRange(json))
    })

    // console.error(start, end)

    const [data, setData] = useState({
        katakana: 'こんにちは',
        audioFile: 'blah',
        downstep: 3,
    })

    const [id, setId] = useState(chooseId())

    useSWR(`/api/word/${id}`, (url) => {
        fetch(url)
            .then((res) => res.json())
            .then((json) => setData(json))
    })

    const fromServer = useSWR(
        `/api/range`,
        async (url) => await fetch(url).then((res) => res.json()),
    )

    console.log(fromServer)

    return (
        <Main>
            {data && (
                <div className='container'>
                    <ReactAudioPlayer
                        src={`audio/readings/${data.audioFile}`}
                        autoPlay={true}
                        controls={true}
                    />
                    <Container kana={data.katakana} downStep={data.downstep} />
                    <Button
                        active={true}
                        variant='primary'
                        onClick={() => {
                            let temp = chooseId()
                            // console.error('temp', temp)
                            while (temp === id) {
                                // console.error('SAME')
                                temp = chooseId()
                            }
                            // console.error('temp', temp)

                            setId(temp)
                        }}
                    >
                        NEXT
                    </Button>
                </div>
            )}
        </Main>
    )
}
