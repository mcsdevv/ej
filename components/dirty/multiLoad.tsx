// import NoSSR from 'react-no-ssr'
import { useEffect } from 'react'
import Multiplechoice from '../pure/accentQuiz/multipleChoice/index'
import ManualEntry from '../pure/accentQuiz/manualEntry/index'
import useSWR from 'swr'
import Loader from '../pure/general/loader'

import { useImmerReducer } from 'use-immer'
import { chooseId, fetcher } from '../pure/utils/common/wrapper'
import * as A from 'fp-ts/lib/Array'
import * as NA from 'fp-ts/lib/NonEmptyArray'

export type Action = {
    type: 'nextWord' | 'nextChunk' | 'setNsc' | 'setNsw'
    notSeenChunks?: number
    notSeenWords?: number
}

export type State = {
    chunkIndex: number
    wordIndex: number
    nsc: number[]
    nsw: number[]
}

export const reducer = (draft: State, action: Action): void => {
    switch (action.type) {
        case 'setNsw': {
            draft.nsw = A.range(0, action.notSeenWords!).filter(
                (x) => x !== draft.wordIndex,
            )
            break
        }
        case 'setNsc': {
            draft.nsc = A.range(0, action.notSeenChunks!).filter(
                (x) => x !== draft.chunkIndex,
            )
            break
        }
        case 'nextWord': {
            draft.wordIndex = chooseId(draft.nsw)
            draft.nsw = A.filter((x: number) => x !== draft.wordIndex)(
                draft.nsw,
            )
            break
        }
        case 'nextChunk': {
            draft.chunkIndex = chooseId(draft.nsc)
            if (draft.nsc.length > 1) {
                draft.nsc = draft.nsc.filter((x) => x !== draft.chunkIndex)
            } else {
                draft.nsc = A.range(0, action.notSeenChunks!).filter(
                    (x) => x !== draft.chunkIndex,
                )
            }
            break
        }
    }
}

type Props = {
    audioType: 'readings' | 'sentences' | 'withParticle'
}

export default ({ audioType }: Props) => {
    const { data: notSeenChunks } = useSWR<number, Error>(
        `/api/range/${audioType}`,
        fetcher,
    )

    const [state, dispatch] = useImmerReducer(reducer, {
        wordIndex: -1,
        chunkIndex: -1,
        nsc: [],
        nsw: [],
    })

    useEffect(() => {
        if (notSeenChunks) {
            dispatch({ type: 'setNsc', notSeenChunks })
            dispatch({ type: 'nextChunk' })
        }
    }, [notSeenChunks])

    const { data: chunk } = useSWR(
        state.chunkIndex > -1
            ? `/api/chunk/${audioType}/${state.chunkIndex}`
            : null,
        fetcher,
    )

    useEffect(() => {
        if (chunk) {
            if (state.wordIndex === -1) {
                dispatch({ type: 'nextWord' })
            } else {
                dispatch({ type: 'setNsw', notSeenWords: chunk.length - 1 })
            }
        }
    }, [chunk])

    const onClick = () =>
        state.nsw.length
            ? dispatch({
                  type: 'nextWord',
                  notSeenChunks,
              })
            : dispatch({
                  type: 'nextChunk',
                  notSeenChunks,
              })

    console.log('~~~~')
    // console.log(state.nsc)

    const word = chunk?.[state.wordIndex]

    console.log(state.chunkIndex)
    console.log(state.nsc)
    console.log(state.wordIndex)
    console.log(state.nsw)
    // console.log(url)
    // console.log(state.wordIndex)
    console.log(word?.audioFile)

    return (
        <Loader wait={!notSeenChunks || !word}>
            <Multiplechoice {...word} onClickNext={onClick} />
        </Loader>
    )
}
