import Multiplechoice from '../pure/accentQuiz/multipleChoice/index'
import ManualEntry from '../pure/accentQuiz/manualEntry/index'
import Loader from '../pure/general/loader'

import { useImmerReducer } from 'use-immer'
import { chooseId } from '../pure/utils/common/wrapper'
import * as A from 'fp-ts/lib/Array'

import { Word } from '../../../backend/common/readings/readings'

import { onResponse } from './utils'

export type Action = {
    type: 'nextWord' | 'nextChunk' | 'setNsc' | 'setNsw' | 'setChunk'
    payload?: any
}

export type State = {
    chunkIndex: number
    wordIndex: number
    nsc: number[]
    nsw: number[]
    chunkCount: number
    chunk?: Word
}

export const reducer = (draft: State, action: Action): void => {
    switch (action.type) {
        case 'setChunk': {
            draft.chunk = action.payload
            break
        }
        case 'setNsc': {
            draft.chunkCount = action.payload
            draft.nsc = A.range(0, draft.chunkCount).filter(
                (x) => x !== draft.chunkIndex,
            )
            break
        }
        case 'setNsw': {
            draft.nsw = A.range(0, action.payload).filter(
                (x) => x !== draft.wordIndex,
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
                draft.nsc = A.range(0, draft.chunkCount).filter(
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
    const [state, dispatch] = useImmerReducer(reducer, {
        wordIndex: -1,
        chunkIndex: -1,
        chunkCount: -1,
        chunk: undefined,
        nsc: [],
        nsw: [],
    })

    onResponse(`/api/range/${audioType}`, (chunkCount) => {
        dispatch({ type: 'setNsc', payload: chunkCount })
        dispatch({ type: 'nextChunk' })
    })

    onResponse(
        `/api/chunk/${audioType}/${state.chunkIndex}`,
        (chunk) => {
            dispatch({ type: 'setChunk', payload: chunk })
            if (state.wordIndex === -1) {
                dispatch({ type: 'nextWord' })
            } else {
                dispatch({ type: 'setNsw', payload: chunk.length - 1 })
            }
        },
        state.chunkIndex > -1,
    )

    // console.log('~~~~')

    const word = state?.chunk?.[state.wordIndex]

    // console.log(state.chunkIndex)
    // console.log(state.nsc)
    // console.log(state.wordIndex)
    // console.log(state.nsw)
    // console.log(word?.audioFile)

    return (
        <Loader wait={!word}>
            <Multiplechoice
                {...word}
                onClickNext={() =>
                    state.nsw.length
                        ? dispatch({
                              type: 'nextWord',
                          })
                        : dispatch({
                              type: 'nextChunk',
                          })
                }
            />
        </Loader>
    )
}
