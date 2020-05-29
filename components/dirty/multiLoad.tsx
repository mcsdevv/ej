import NoSSR from 'react-no-ssr'
import { useEffect } from 'react'
import Multiplechoice from '../pure/accentQuiz/multipleChoice/index'
import ManualEntry from '../pure/accentQuiz/manualEntry/index'
import useSWR from 'swr'
import { Suspense } from 'react'
import Loader from '../pure/general/loader'
import useAxios from 'axios-hooks'

import { useImmer } from 'use-immer'
import { chooseId, fetcher } from '../pure/utils/common/wrapper'
import * as R from 'rambda'
import { stat } from 'fs'

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export type Record = {
    audioFile: string
    downStep: number
    katakana: string
    particle: string | null
    sentence?: string //for debuggiong
}

type State = {
    chunkIndex: number
    wordIndex: number
    nsc: number[]
}

export default () => {
    const { data: notSeenChunks } = useSWR<number[], Error>(
        `/api/homophones/range`,
        fetcher,
    )

    const [state, updateState] = useImmer<State>({
        wordIndex: 0,
        chunkIndex: 0,
        nsc: [],
    })

    useEffect(() => {
        updateState((draft) => {
            if (notSeenChunks) {
                draft.nsc = notSeenChunks
                draft.chunkIndex = chooseId(draft.nsc)
            }
        })
    }, [notSeenChunks])

    const { data: chunk } = useSWR(
        `/api/homophones/chunk/${state.chunkIndex}`,
        fetcher,
    )

    const onClick = () => {
        updateState((draft) => {
            if (!chunk) {
                return
            }
            const nextWordId = draft.wordIndex + 1
            if (nextWordId < chunk.length) {
                draft.wordIndex = nextWordId
                return
            }

            draft.nsc =
                draft.nsc.length > 1
                    ? R.without([draft.chunkIndex], draft.nsc)
                    : notSeenChunks!

            draft.chunkIndex = chooseId(draft.nsc)
            draft.wordIndex = 0
        })
    }
    // console.log(nsc)

    const word = chunk ? chunk[state.wordIndex] : undefined

    console.log('~~~~')
    console.log(state.chunkIndex, state.wordIndex, word?.audioFile, chunk)
    // console.log(url)
    // console.log(state.wordIndex)
    // console.log(word?.audioFile)

    return (
        <NoSSR>
            <Loader wait={!word}>
                <Multiplechoice {...word} onClickNext={onClick} />
            </Loader>
        </NoSSR>
    )
}
