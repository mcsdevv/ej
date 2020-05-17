import NoSSR from 'react-no-ssr'
import { useState } from 'react'
import Pure from '../pure/accentQuiz/maunalEntry'
import Loader from 'react-loader-spinner'
import { Container, Row } from 'react-bootstrap'

import { useImmer } from 'use-immer'
import { chooseId } from '../../src/common/wrapper'
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
    notSeenChunks: number[]
}

export default function ({ chunks }: Props) {
    const [wait, setWait] = useState<boolean>(false)
    const [finished, setFinished] = useState<boolean>(false)

    const [state, updateState] = useImmer<State>({
        wordIndex: 0,
        chunkIndex: chooseId(R.range(0, chunks.length - 1)),
        notSeenChunks: chunks.map((x, i) => i),
    })

    const nextWord = async () => {
        const chunk = chunks[state.chunkIndex]
        const nextWordIndex = state.wordIndex + 1
        if (nextWordIndex < chunk.length) {
            updateState((draft) => {
                draft.wordIndex = nextWordIndex
            })
        } else {
            setWait(true)
            await sleep(1000)

            updateState((draft) => {
                draft.wordIndex = 0
                draft.notSeenChunks = R.without(
                    [draft.chunkIndex],
                    draft.notSeenChunks,
                )

                if (!draft.notSeenChunks.length) {
                    setFinished(true)
                } else {
                    draft.chunkIndex = chooseId(draft.notSeenChunks)
                }
            })
            setWait(false)
        }
    }
    console.log(chunks)
    console.log(state)

    const word = chunks[state.chunkIndex][state.wordIndex]

    return (
        // <>hello</>
        <NoSSR
            onSSR={
                <Loader
                    timeout={2000}
                    width={500}
                    height={1000}
                    type='Hearts'
                />
            }
        >
            {finished ? (
                <div>FINISHED</div>
            ) : (
                <>
                    {wait && (
                        <Container className='h-100'>
                            <Row
                                className='justify-content-center'
                                style={{ height: '100%' }}
                            >
                                <Loader
                                    timeout={2000}
                                    width={500}
                                    height={1000}
                                    type='Hearts'
                                />
                            </Row>
                        </Container>
                    )}
                    {!wait && <Pure {...word} onClickNext={nextWord} />}
                </>
            )}
        </NoSSR>
    )
}

// TODO rename downstep to downStep
