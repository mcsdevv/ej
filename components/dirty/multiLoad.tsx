import NoSSR from 'react-no-ssr'
import { useState } from 'react'
import Pure from '../pure/accentQuiz/maunalEntry'
import Loader from 'react-loader-spinner'
import { Container, Row } from 'react-bootstrap'
import { chooseId, fetcher } from '../../src/common/wrapper'
import * as R from 'rambda'

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export type Record = {
    audioFile: string
    downstep: number
    katakana: string
}

type Props = {
    chunks: Record[][]
}

export default function ({ chunks }: Props) {
    const seenChunks = []

    // const ids = useSWR<number[], Error>(`/api/homophones/range`, fetcher)?.data

    // console.log(ids)

    const [id, setId] = useState<number>(0)

    // const pickrandomId = () => {
    //     const nextId = chooseId(id, R.range(0, chunks.length - 1))
    //     if (nextId) {
    //         setId(nextId)
    //     }
    // }

    const words = chunks[id]

    // const words = useSWR<Record[], Error>(
    //     id ? `/api/homophones/chunks/${id}` : null,
    //     fetcher,
    // )?.data
    // console.log(words)

    const [wordId, setWordId] = useState<number>(0)
    const word = words[wordId]

    return (
        // <>hello</>
        <NoSSR onSSR={<Loader width={500} height={1000} type='Hearts' />}>
            {!word && (
                <Container className='h-100'>
                    <Row
                        className='justify-content-center'
                        style={{ height: '100%' }}
                    >
                        <Loader width={500} height={1000} type='Hearts' />
                    </Row>
                </Container>
            )}
            {word && (
                <Pure
                    {...word}
                    onClickNext={async () => {
                        const nextId = wordId + 1

                        if (nextId < words.length) {
                            setWordId(nextId)
                        } else {
                            setWordId(-1)
                            await sleep(5000)
                            setId(id + 1)
                            setWordId(0)
                        }
                    }}
                />
            )}
        </NoSSR>
    )
}

// TODO rename downstep to downStep
