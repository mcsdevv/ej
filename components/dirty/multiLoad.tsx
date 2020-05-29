import NoSSR from 'react-no-ssr'
import { useState, useEffect } from 'react'
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
    const [wait, setWait] = useState(false)

    const nscRes = useAxios(`/api/homophones/range`)[0]

    const notSeenChunks = nscRes.data

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

    const url = `/api/homophones/chunk/${state.chunkIndex}`

    const [chunkRes, refetch] = useAxios(url)
    const chunk = chunkRes.data

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
                    : notSeenChunks

            draft.chunkIndex = chooseId(draft.nsc)
            draft.wordIndex = 0
            refetch()
        })
    }

    if (chunkRes.loading) {
        return <Loader wait={true}></Loader>
    }
    const word = chunk[state.wordIndex]

    console.log('~~~~')
    console.log(state.chunkIndex, state.wordIndex, word?.audioFile, chunkRes)
    console.log(url)
    // console.log(state.wordIndex)
    // console.log(word?.audioFile)

    return (
        <NoSSR>
            <Loader wait={chunkRes.loading}>
                <Multiplechoice {...word} onClickNext={onClick} />
            </Loader>
        </NoSSR>
    )
}
