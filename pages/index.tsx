import ReactAudioPlayer from 'react-audio-player'
import NoSSR from 'react-no-ssr'
import Accent from '../components/accentWord/container'
import useSWR from 'swr'
import { useState } from 'react'
import { Button, Container, Col, Row } from 'react-bootstrap'
import Main from '../components/main'

function between(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const chooseId = (currentId: number, ids: number[]) => {
    const filtered = ids.filter((x) => x !== currentId)
    return filtered[between(0, filtered.length - 1)]
}

type Data = {
    audioFile: string
    downstep: number
    katakana: string
}

export default function Home() {
    const [ids, setRange] = useState([])

    useSWR(`/api/range`, async (url) => {
        await fetch(url)
            .then((res) => res.json())
            .then((json) => setRange(json))
    })

    // console.error(start, end)

    const [data, setData] = useState<Data | undefined>(undefined)

    const [id, setId] = useState(1)

    console.error(id)

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
            <NoSSR onSSR={<div>W8 M8</div>}>
                {data && (
                    <Container className='h-100'>
                        <Row style={{ height: '15%' }}>
                            <ReactAudioPlayer
                                style={{ width: '100%' }}
                                src={`audio/readings/${data.audioFile}`}
                                autoPlay={true}
                                controls={true}
                            />
                        </Row>

                        <Row style={{ height: '65%' }}>
                            <Accent
                                kana={data.katakana}
                                downStep={data.downstep}
                            />
                        </Row>

                        <Row style={{ height: '20%' }}>
                            <Button
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                active={true}
                                variant='primary'
                                onClick={() => {
                                    const temp = chooseId(id, ids)
                                    setId(temp)
                                }}
                            >
                                NEXT
                            </Button>
                        </Row>
                    </Container>
                )}
                {null}
            </NoSSR>
        </Main>
    )
}
// TODO fix server side rendering problem
// TODO rename downstep to downStep
