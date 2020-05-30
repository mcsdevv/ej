import {
    downStepToArray,
    isCorrect,
    chooseId,
    getSmallCharacterIndexes,
    bundleCharacters,
    adjustDownstep,
    shuffle,
    getFakeDownSteps,
    getMVQDownSteps,
    DownStep,
} from './common'

import * as A from 'fp-ts/lib/Array'
import * as Eq from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import * as Ord from 'fp-ts/lib/Ord'
import { pipe } from 'fp-ts/lib/pipeable'

describe('downStep to arrray', () => {
    it('downStep to array', () => {
        expect(downStepToArray(O.some(0), 1, false)).toEqual([true])
    })
    it('downStep to array', () => {
        expect(downStepToArray(O.some(0), 1, true)).toEqual([true, false])
    })
    it('downStep to array', () => {
        expect(downStepToArray(O.none, 1, false)).toEqual([true])
    })
    it('downStep to array', () => {
        expect(downStepToArray(O.none, 1, true)).toEqual([false, true])
    })

    it('downStep to array', () => {
        expect(downStepToArray(O.none, 3, false)).toEqual([false, true, true])
    })

    it('downStep to array', () => {
        expect(downStepToArray(O.none, 3, true)).toEqual([
            false,
            true,
            true,
            true,
        ])
    })

    it('downStep to array', () => {
        expect(downStepToArray(O.some(2), 3, false)).toEqual([
            false,
            true,
            true,
        ])
    })

    it('downStep to array', () => {
        expect(downStepToArray(O.some(2), 3, true)).toEqual([
            false,
            true,
            true,
            false,
        ])
    })

    it('downStep to array', () => {
        expect(downStepToArray(O.some(1), 3, false)).toEqual([
            false,
            true,
            false,
        ])
    })

    it('downStep to array', () => {
        expect(downStepToArray(O.some(1), 3, true)).toEqual([
            false,
            true,
            false,
            false,
        ])
    })

    it('downStep to array', () => {
        expect(downStepToArray(O.some(3), 5, false)).toEqual([
            false,
            true,
            true,
            true,
            false,
        ])
    })

    it('downStep to array', () => {
        expect(downStepToArray(O.some(3), 5, true)).toEqual([
            false,
            true,
            true,
            true,
            false,
            false,
        ])
    })
})

describe('is correct', () => {
    it('downStep to array', () => {
        expect(isCorrect(O.some(0), [true], false)).toBeTruthy()
    })
    it('downStep to array', () => {
        expect(isCorrect(O.some(0), [false], false)).toBeTruthy()
    })

    it('downStep to array', () => {
        expect(isCorrect(O.none, [false, true, true], false)).toBeTruthy()
    })

    it('downStep to array', () => {
        expect(isCorrect(O.none, [false, true, false], false)).toBeFalsy()
    })
})

describe('choose id', () => {
    it('returns 0 if array is empty', () => {
        expect(chooseId([])).toBe(0)
    })

    it('returns a single element if the array is has 1', () => {
        expect(chooseId([5])).toBe(5)
    })
})

describe('get small indexes', () => {
    it('returns empty array if no small charters', () => {
        expect(getSmallCharacterIndexes('コンビニ')).toEqual([])
    })
    it('returns indexes of small charcters', () => {
        expect(getSmallCharacterIndexes('コンョビニィ')).toEqual([2, 5])
    })
})

describe('bundleCharacters', () => {
    it('should throw error', () => {
        expect(() => bundleCharacters('ョコチョイ')).toThrowError()
    })
    it('returns empty array if no small charters', () => {
        const res = bundleCharacters('ハチジョー')
        expect(res).toEqual(['ハ', 'チ', 'ジョ', 'ー'])
    })
    it('returns empty array if no small charters', () => {
        const res = bundleCharacters('オッチョコチョイ')
        expect(res).toEqual(['オ', 'ッ', 'チョ', 'コ', 'チョ', 'イ'])
    })
})

const just = <T>(param: O.Option<T>) => {
    if (O.isNone(param)) {
        throw new Error('Was NONE!')
    }

    return param.value
}

describe('adjustDownstep', () => {
    it('should not change the downStep if its before the small character', () => {
        expect(just(adjustDownstep('ハチジョー', O.some(2)))).toEqual(2)
    })
    it('should decrement the downStep if its on the character just before the small', () => {
        expect(just(adjustDownstep('ハチジョー', O.some(3)))).toEqual(2)
    })
    it('decrement the downStep', () => {
        expect(just(adjustDownstep('コーシャク', O.some(4)))).toEqual(3)
    })
    it('decrement the downStep', () => {
        expect(just(adjustDownstep('オッチョコチョイ', O.some(6)))).toEqual(4)
    })
    it('should return nul if downStep is null', () => {
        expect(adjustDownstep('ハチジョー', O.none)).toEqual(O.none)
    })
})

describe('shuffle', () => {
    const array = [0, 1, 2, 3, 4, 5]

    it('should not rempve or add any elements', () => {
        let shuffled = shuffle(array)

        let i = 10
        while (i > 0) {
            shuffled = shuffle(shuffled)
            expect(array).toEqual(shuffled.sort())
            i--
        }
    })
})

describe('getRandomDownSteps', () => {
    const word = 'ハチジョー'
    it('should not have any duplicates 2', () => {
        const ds = getFakeDownSteps(word, O.some(2))
        expect(ds).toEqual([0, 1, 4])
    })

    it('should not have any duplicates  3', () => {
        const ds = getFakeDownSteps(word, O.some(3))
        expect(ds).toEqual([0, 1, 4])
    })
})

describe('getMVQDownSteps', () => {
    const downStep = O.some(2)
    const word = 'ハチジョー'

    const byDownstep = pipe(
        Ord.ordNumber,
        Ord.contramap((ds: DownStep) => O.getOrElse(() => -1)(ds)),
    )

    it('the required number of options is > actual options', () => {
        const options = A.sort(byDownstep)(getMVQDownSteps(word, downStep, 9))
        expect(options).toEqual(A.map(O.some)([0, 1, 2, 4]))
    })

    it('the required number of options is equal to actual options', () => {
        const options = A.sort(byDownstep)(getMVQDownSteps(word, downStep, 4))
        expect(options).toEqual(A.map(O.some)([0, 1, 2, 4]))
    })

    it('the required number of options is < actual options', () => {
        const options = getMVQDownSteps(word, downStep, 2).sort()
        expect(options.length).toEqual(2)
    })
})
