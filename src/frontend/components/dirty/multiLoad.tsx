import Multiplechoice from '../pure/accentQuiz/multipleChoice/index'
import ManualEntry from '../pure/accentQuiz/manualEntry/index'
import Loader from '../pure/general/loader'
import { useImmerReducer } from 'use-immer'
import { useFetch, reducer } from './utils'

type Props = {
    audioType: 'readings' | 'sentences' | 'withParticle'
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
