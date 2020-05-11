import NoSSR from 'react-no-ssr'
import useSWR from 'swr'
import { useState } from 'react'
import Main from '../components/main'
import Pure from '../components/accentQuiz/maunalEntry'
import fetch from 'node-fetch'
import Loader from 'react-loader-spinner'
import { Container, Row } from 'react-bootstrap'

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
const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Home() {
    const ids = useSWR<number[], Error>(`/api/range`, fetcher)?.data

    const [id, setId] = useState<number | null>(null)

    const pickrandomId = () => setId(chooseId(id!, ids!))

    if (ids && !id) {
        pickrandomId()
    }

    const { data } = useSWR<Data, Error>(id ? `/api/word/${id}` : null, fetcher)

    return (
        <Main>
            <NoSSR onSSR={<Loader width={500} height={1000} type='Hearts' />}>
                {!data && (
                    <Container className='h-100'>
                        <Row
                            className='justify-content-center'
                            style={{ height: '100%' }}
                        >
                            <Loader width={500} height={1000} type='Hearts' />
                        </Row>
                    </Container>
                )}
                {data && <Pure {...data} onClickNext={pickrandomId} />}
            </NoSSR>
        </Main>
    )
}

// TODO rename downstep to downStep
