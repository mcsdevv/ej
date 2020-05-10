import ReactAudioPlayer from 'react-audio-player'
import NoSSR from 'react-no-ssr'
import Accent from '../components/accentWord/container'
import useSWR from 'swr'
import { useState, useEffect } from 'react'
import { Button, Container, Col, Row } from 'react-bootstrap'
import Main from '../components/main'

const playAudio = () => {
    const aE = document.getElementsByClassName('audio-element')[0] as any
    if (!aE) {
        return
    }
    aE.load()
    aE.play()
}

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

    useEffect(() => {
        playAudio()
    })

    return (
        <Main>
            <NoSSR onSSR={<div>W8 M8</div>}>
                {data && (
                    <Pure
                        {...data}
                        onClickNext={() => setId(chooseId(id, ids))}
                    />
                )}
                {null}
            </NoSSR>
        </Main>
    )
}

type Props = {
    audioFile: string
    katakana: string
    downstep: number
    onClickNext: () => void
}

const Pure = ({ audioFile, katakana, downstep, onClickNext }: Props) => {
    return (
        <Container className='h-100'>
            <Row className='justify-content-center' style={{ height: '15%' }}>
                <Button onClick={playAudio}>
                    <i
                        className='fas fa-volume-up'
                        style={{ fontSize: '500%' }}
                    ></i>
                </Button>

                <audio className='audio-element'>
                    <source src={`audio/readings/${audioFile}`}></source>
                </audio>
            </Row>

            <Row style={{ height: '65%' }}>
                <Accent kana={katakana} downStep={downstep} />
            </Row>

            <Row style={{ height: '20%' }}>
                <Button
                    style={{
                        width: '100%',
                        height: '100%',
                        fontSize: '500%',
                    }}
                    active={true}
                    variant='primary'
                    onClick={onClickNext}
                >
                    NEXT
                </Button>
            </Row>
        </Container>
    )
}

// TODO rename downstep to downStep
