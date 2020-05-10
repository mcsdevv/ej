import ReactAudioPlayer from 'react-audio-player'
import Accent from '../components/accentWord/container'
import useSWR from 'swr'
import { useState } from 'react'
import { Button, Container, Col, Row } from 'react-bootstrap'
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
                <div className='container h-100'>
                    <Row className='justify-content-center h-100'>
                        <Col md={6}>
                            <div style={{ height: '10%' }}>
                                <ReactAudioPlayer
                                    style={{ width: '100%' }}
                                    src={`audio/readings/${data.audioFile}`}
                                    autoPlay={true}
                                    controls={true}
                                />
                            </div>

                            <div style={{ height: '70%' }}>
                                <Accent
                                    kana={data.katakana}
                                    downStep={data.downstep}
                                />
                            </div>
                            <div style={{ height: '20%' }}>
                                <Button
                                    style={{ width: '100%', height: '100%' }}
                                    active={true}
                                    variant='primary'
                                    onClick={() => {
                                        const temp = chooseId()
                                        setId(temp)
                                    }}
                                >
                                    NEXT
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            )}
        </Main>
    )
}
