// import NoSSR from 'react-no-ssr'
import { useEffect } from 'react'
import Multiplechoice from '../pure/accentQuiz/multipleChoice/index'
import ManualEntry from '../pure/accentQuiz/manualEntry/index'
import useSWR from 'swr'
import Loader from '../pure/general/loader'

import { useImmer } from 'use-immer'
import { chooseId, fetcher } from '../pure/utils/common/wrapper'
import * as A from 'fp-ts/lib/Array'
import * as NA from 'fp-ts/lib/NonEmptyArray'

type State = {
    chunkIndex: number
    wordIndex: number
    nsc: number[]
}

type Props = {
    audioType: 'readings' | 'sentences' | 'withParticle'
}

export default ({ audioType }: Props) => {
    const { data: notSeenChunks } = useSWR<number, Error>(
        `/api/range/${audioType}`,
        fetcher,
    )

    const [state, updateState] = useImmer<State>({
        wordIndex: 0,
        chunkIndex: -1,
        nsc: [],
    })

    useEffect(() => {
        updateState((draft) => {
            if (notSeenChunks) {
                draft.nsc = A.range(0, notSeenChunks)
                draft.chunkIndex = chooseId(draft.nsc)
            }
        })
    }, [notSeenChunks])

    const { data: chunk } = useSWR(
        state.chunkIndex > -1
            ? `/api/chunk/${audioType}/${state.chunkIndex}`
            : null,
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
                    ? A.filter((x: number) => x !== draft.chunkIndex)(draft.nsc)
                    : A.range(0, notSeenChunks!)

            draft.chunkIndex = chooseId(draft.nsc)
            draft.wordIndex = 0
        })
    }

    const word = chunk?.[state.wordIndex]

    console.log('~~~~')
    console.log(state.nsc)
    // console.log(state.chunkIndex, state.wordIndex, word?.audioFile, chunk)
    // console.log(url)
    // console.log(state.wordIndex)
    // console.log(word?.audioFile)

    return (
        <Loader wait={!notSeenChunks || !word}>
            <Multiplechoice {...word} onClickNext={onClick} />
        </Loader>
    )
}
