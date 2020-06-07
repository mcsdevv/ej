import { State, Action, reducer } from './multiLoad'
import { produce } from 'immer'
import * as O from 'fp-ts/lib/Option'

describe('container', () => {
    const wrapper = (
        init,
        action,
        reducer: (draft: State, action: Action) => void,
    ) => produce<State, State>(init, (draft) => reducer(draft, action))

    const initState: State = {
        wordIndex: -1,
        chunkIndex: -1,
        nsw: [],
        nsc: [],
    }

    it('should set nsc', () => {
        const res = wrapper(
            { wordIndex: 1, chunkIndex: 1, nsw: [], nsc: [1] },
            { type: 'setNsc', notSeenChunks: 3 },
            reducer,
        )
        expect(res.chunkIndex).toEqual(1)
        expect(res.nsc).toEqual([0, 2, 3])
    })

    it('should set nsw', () => {
        const res = wrapper(
            { wordIndex: 1, chunkIndex: 1, nsw: [], nsc: [1] },
            { type: 'setNsw', notSeenWords: 3 },
            reducer,
        )
        expect(res.wordIndex).toEqual(1)
        expect(res.nsw).toEqual([0, 2, 3])
    })

    assert({
        given: 'an initialised state',
        should: 'choose a new word',
        actual: wrapper(
            { wordIndex: 0, chunkIndex: 1, nsw: [3], nsc: [0] },
            { type: 'nextWord' },
            reducer,
        ),
        expected: { wordIndex: 3, chunkIndex: 1, nsw: [], nsc: [0] },
    })

    assert({
        given: 'an initialised state',
        should: 'choose a new chunk and reset nsc',
        actual: wrapper(
            { wordIndex: 1, chunkIndex: 0, nsw: [0], nsc: [4] },
            { type: 'nextChunk', notSeenChunks: 4, notSeenWords: 4 },
            reducer,
        ),
        expected: {
            wordIndex: 1,
            chunkIndex: 4,
            nsw: [0],
            nsc: [0, 1, 2, 3],
        },
    })

    it('choose a new chunk', () => {
        const res = wrapper(
            { wordIndex: 1, chunkIndex: 0, nsw: [0], nsc: [2, 3] },
            { type: 'nextChunk', notSeenChunks: 4, notSeenWords: 4 },
            reducer,
        )
        expect(res.chunkIndex).not.toEqual(0)
        expect(res.nsc.length).toEqual(1)
        expect(res.nsw).toEqual([0])
    })
})
