import NoSSR from 'react-no-ssr'
import { useState } from 'react'
import Pure from '../pure/accentQuiz/maunalEntry'
import Loader from 'react-loader-spinner'
import { Container, Row } from 'react-bootstrap'

import { useImmer } from 'use-immer'
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

type State = {
    chunkIndex: number
    wordIndex: number
    seenChunks: number[]
}

export default function ({ chunks }: Props) {
    const [wait, setWait] = useState<boolean>(false)
    const [finished, setFinished] = useState<boolean>(false)

    const [state, updateState] = useImmer<State>({
        wordIndex: 0,
        chunkIndex: 0,
        seenChunks: [],
    })

    const nextWord = async () => {
        updateState((draft) => {
            const chunk = chunks[draft.chunkIndex]
            const nextWordIndex = draft.wordIndex + 1
            if (nextWordIndex < chunk.length) {
                draft.wordIndex = nextWordIndex
            } else {
                draft.wordIndex = 0
                draft.seenChunks.push(draft.chunkIndex)
                const newChunkIndex = chooseId(
                    draft.seenChunks,
                    R.range(0, chunks.length - 1),
                )
                if (newChunkIndex) {
                    draft.chunkIndex = newChunkIndex
                } else {
                    setFinished(true)
                }
            }
        })
    }

    const word = chunks[state.chunkIndex][state.wordIndex]

    console.log(chunks)
    console.log(state)
    console.log(word)
    console.log(finished)

    return (
        // <>hello</>
        <NoSSR onSSR={<Loader width={500} height={1000} type='Hearts' />}>
            {finished ? (
                <div>FINISHED</div>
            ) : (
                <>
                    {!word ||
                        (wait && (
                            <Container className='h-100'>
                                <Row
                                    className='justify-content-center'
                                    style={{ height: '100%' }}
                                >
                                    <Loader
                                        width={500}
                                        height={1000}
                                        type='Hearts'
                                    />
                                </Row>
                            </Container>
                        ))}
                    {word && <Pure {...word} onClickNext={nextWord} />}
                </>
            )}
        </NoSSR>
    )
}

// TODO rename downstep to downStep
