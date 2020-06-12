import Multiplechoice from '../pure/accentQuiz/multipleChoice/index'
import ManualEntry from '../pure/accentQuiz/manualEntry/index'
import Loader from '../pure/general/loader'

import { useImmerReducer } from 'use-immer'
import { chooseId } from '../pure/utils/common/wrapper'
import * as A from 'fp-ts/lib/Array'

import { Word } from '@/backend/common/readings'

import { onResponse, fetcher } from './utils'

import { isEqual } from 'lodash'
import { stat, watchFile } from 'fs'
import useSWR from 'swr'
import { useEffect } from 'react'

export type Action = {
    type: 'nextWord' | 'nextChunk' | 'setNsc' | 'setNsw' | 'setChunk' | 'wait'
    payload?: any
}

export type State = {
    chunkIndex: number
    wordIndex: number
    nsc: number[]
    nsw: number[]
    chunkCount: number
    chunk?: Word[]
    wait: boolean
}

export const reducer = (draft: State, action: Action): void => {
    // console.log(action)
    switch (action.type) {
        case 'wait': {
            draft.wait = true
            return
        }
        case 'setChunk': {
            draft.chunk = action.payload
            const range = A.range(0, draft.chunk!.length - 1)
            draft.wordIndex = chooseId(range)
            draft.nsw = range.filter((x) => x !== draft.wordIndex)
            draft.wait = false
            return
        }
        case 'setNsc': {
            draft.chunkCount = action.payload
            draft.nsc = A.range(0, draft.chunkCount).filter(
                (x) => x !== draft.chunkIndex,
            )
            return
        }
        case 'nextWord': {
            draft.wordIndex = chooseId(draft.nsw)
            draft.nsw = A.filter((x: number) => x !== draft.wordIndex)(
                draft.nsw,
            )
            return
        }
        case 'nextChunk': {
            draft.chunkIndex = chooseId(draft.nsc)
            if (draft.nsc.length > 1) {
                draft.nsc = draft.nsc.filter((x) => x !== draft.chunkIndex)
            } else {
                draft.nsc = A.range(0, draft.chunkCount).filter(
                    (x) => x !== draft.chunkIndex,
                )
            }
            return
        }
    }
}

type Props = {
    audioType: 'readings' | 'sentences' | 'withParticle'
}

const useFetch = (
    url: string,
    onSuccess: <S>(data: S) => void,
    onError: (error: Error) => void,
    ...conditions: boolean[]
) => {
    useEffect(() => {
        if (conditions.every((x) => x)) {
            fetch(url)
                .then((raw) => raw.json())
                .then((data) => onSuccess(data))
                .catch((error) => onError(error))
        }
    }, [url])
}

const multiLoader = ({ audioType }: Props) => {
    const [state, dispatch] = useImmerReducer(reducer, {
        wordIndex: 0,
        chunkIndex: -1,
        chunkCount: -1,
        chunk: undefined,
        nsc: [],
        nsw: [],
        wait: false,
    })

    useFetch(
        `/api/range/${audioType}`,
        (chunkCount) => {
            dispatch({
                type: 'setNsc',
                payload: chunkCount,
            })
            dispatch({
                type: 'nextChunk',
            })
        },
        (error) => console.error(error),
    )

    useFetch(
        `/api/chunk/${audioType}/${state.chunkIndex}`,
        (chunk) => {
            dispatch({
                type: 'setChunk',
                payload: chunk,
            })
        },
        (error) => console.error(error),
        state.chunkIndex !== -1,
    )

    console.log('~~~~')

    const word = state?.chunk?.[state.wordIndex]

    // console.log(state.chunkIndex)
    // console.log(state.nsc)
    // console.log(state.wordIndex)
    // console.log(state.nsw)
    console.log(state)
    console.log(word?.audioFile)

    return (
        <Loader wait={!word || state.wait}>
            <Multiplechoice
                {...word}
                onClickNext={() => {
                    if (state.nsw.length) {
                        dispatch({
                            type: 'nextWord',
                        })
                    } else {
                        dispatch({
                            type: 'wait',
                        })
                        dispatch({
                            type: 'nextChunk',
                        })
                    }
                }}
            />
        </Loader>
    )
}

multiLoader.whyDidYouRender = true

export default multiLoader
