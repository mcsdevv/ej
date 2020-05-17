import {
    downStepToArray,
    isCorrect,
    chooseId,
    getSmallCharacterIndexes,
    bundleCharacters,
} from './common'

describe('downstep to arrray', () => {
    it('downstep to array', () => {
        expect(downStepToArray(0, 0)).toEqual([true])
    })
    it('downstep to array', () => {
        expect(downStepToArray(0, 1)).toEqual([true])
    })
    it('downstep to array', () => {
        expect(downStepToArray(null, 3)).toEqual([false, true, true])
    })

    it('downstep to array', () => {
        expect(downStepToArray(2, 3)).toEqual([false, true, true])
    })

    it('downstep to array', () => {
        expect(downStepToArray(1, 3)).toEqual([false, true, false])
    })

    it('downstep to array', () => {
        expect(downStepToArray(3, 5)).toEqual([false, true, true, true, false])
    })
})

describe('is correct', () => {
    it('downstep to array', () => {
        expect(isCorrect(0, [true])).toBeTruthy()
    })
    it('downstep to array', () => {
        expect(isCorrect(0, [false])).toBeTruthy()
    })
    it('downstep to array', () => {
        expect(downStepToArray(0, 1)).toEqual([true])
    })

    it('downstep to array', () => {
        expect(isCorrect(null, [false, true, true])).toBeTruthy()
    })

    it('downstep to array', () => {
        expect(isCorrect(null, [false, true, false])).toBeFalsy()
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
