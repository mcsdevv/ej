import { useAccent, State, Action } from './utils'
import { produce } from 'immer'
import * as O from 'fp-ts/lib/Option'

describe('container', () => {
    const { reducer: notInteractive } = useAccent(false, 3, O.none, false)
    const { reducer: interactive } = useAccent(false, 3, O.none, true)

    const wrapper = (
        init,
        action,
        reducer: (draft: State, action: Action) => void,
    ) => produce<State, State>(init, (draft) => reducer(draft, action))

    const allTrue = [true, true, true]
    const allFalse = [false, false, false]

    assert({
        given: 'interactive, non initial array',
        should: 'reset to initial',
        actual: wrapper(
            { array: allTrue, isCorrect: true },
            { type: 'reset' },
            interactive,
        ),
        expected: { array: allFalse, isCorrect: false },
    })

    assert({
        given: 'non interactive, non initial array',
        should: 'set to correct accent',
        actual: wrapper(
            { array: allTrue, isCorrect: false },
            { type: 'reset' },
            notInteractive,
        ),
        expected: { array: [false, true, true], isCorrect: true },
    })

    assert({
        given: 'interactive, initial array',
        should: 'toggle index',
        actual: wrapper(
            { array: allFalse, isCorrect: false },
            { type: 'toggle', index: 1 },
            interactive,
        ),
        expected: { array: [false, true, false], isCorrect: false },
    })

    assert({
        given: 'interactive, initial array',
        should: 'toggle correct index',
        actual: wrapper(
            { array: [false, true, false], isCorrect: false },
            { type: 'toggle', index: 2 },
            interactive,
        ),
        expected: { array: [false, true, true], isCorrect: true },
    })

    assert({
        given: 'interactive, initial array',
        should: 'toggle incorrect index',
        actual: wrapper(
            { array: [false, true, true], isCorrect: true },
            { type: 'toggle', index: 2 },
            interactive,
        ),
        expected: { array: [false, true, false], isCorrect: false },
    })
})
