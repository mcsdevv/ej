import NoSSR from 'react-no-ssr'
import { useState, useEffect } from 'react'
import Multiplechoice from '../pure/accentQuiz/multipleChoice/index'
import ManualEntry from '../pure/accentQuiz/manualEntry/index'
import useSWR from 'swr'
import { Suspense } from 'react'
import Loader from '../pure/general/loader'

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
}

export default () => {
    const { data: notSeenChunks } = useSWR<number[], Error>(
        `/api/homophones/range`,
        fetcher,
    )

    const [nsc, setNsc] = useState<number[]>()

    if (!nsc && notSeenChunks) {
        setNsc(notSeenChunks)
    }

    const [state, updateState] = useImmer<State>({
        wordIndex: 0,
        chunkIndex: 0,
    })

    useEffect(() => {
        updateState((draft) => {
            if (nsc) {
                draft.chunkIndex = chooseId(nsc)
            }
        })
    }, [nsc])

    const { data: chunk } = useSWR<Record[], Error>(
        `/api/homophones/chunk/${state.chunkIndex}`,
        fetcher,
    )

    console.log(state)
    console.log(chunk)

    // const onClick () => {
    //     if ()
    // }

    const word = chunk ? chunk[state.wordIndex] : undefined

    return (
        <NoSSR>{word ? <div>{word?.katakana}</div> : <div>loading</div>}</NoSSR>
    )
}
