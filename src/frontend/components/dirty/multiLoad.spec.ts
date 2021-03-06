import { State, Action, reducer } from './utils'
import { produce } from 'immer'
import * as O from 'fp-ts/lib/Option'

describe('container', () => {
    const wrapper = (
        init,
        action,
        reducer: (draft: State, action: Action) => void,
    ) => produce<State, State>(init, (draft) => reducer(draft, action))

    assert({
        given: 'an initialised state',
        should: 'set chunk',

        actual: wrapper(
            {},
            { type: 'setChunk', payload: [{ katakana: 'よ' }], wait: true },
            reducer,
        ),
        expected: {
            nsw: [],
            wait: false,
            chunk: [
                {
                    katakana: 'よ',
                },
            ],
            wordIndex: 0,
        },
    })

    assert({
        given: 'an initialised state',
        should: 'set nsc',

        actual: wrapper(
            { chunkIndex: 1, nsc: [1] },
            { type: 'setNsc', payload: 3 },
            reducer,
        ),
        expected: {
            chunkIndex: 1,
            nsc: [0, 2, 3],
            chunkCount: 3,
        },
    })

    assert({
        given: 'an initialised state',
        should: 'choose a new word',
        actual: wrapper(
            { wordIndex: 0, nsw: [1] },
            { type: 'nextWord' },
            reducer,
        ),
        expected: { wordIndex: 1, nsw: [] },
    })

    assert({
        given: 'an initialised state',
        should: 'choose a new chunk and reset nsc',
        actual: wrapper(
            {
                chunkIndex: 0,
                nsc: [4],
                chunkCount: 4,
            },
            { type: 'nextChunk', payload: 4 },
            reducer,
        ),
        expected: {
            chunkIndex: 4,
            nsc: [0, 1, 2, 3],
            chunkCount: 4,
            wait: true,
        },
    })

    it('choose a new chunk', () => {
        const res = wrapper(
            { wordIndex: 1, chunkIndex: 0, nsw: [0], nsc: [2, 3] },
            { type: 'nextChunk', payload: 4 },
            reducer,
        )
        expect(res.chunkIndex).not.toEqual(0)
        expect(res.nsc.length).toEqual(1)
        expect(res.nsw).toEqual([0])
    })
})
