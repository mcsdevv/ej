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

describe('adjustDownstep', () => {
    it('should not change the downstep if its before the small character', () => {
        expect(adjustDownstep('ハチジョー', 2)).toEqual(2)
    })
    it('should decrement the downstep if its on the character just before the small', () => {
        expect(adjustDownstep('ハチジョー', 3)).toEqual(2)
    })
    it('decrement the downstep', () => {
        expect(adjustDownstep('コーシャク', 4)).toEqual(3)
    })
    it('decrement the downstep', () => {
        expect(adjustDownstep('オッチョコチョイ', 6)).toEqual(4)
    })
    it('should return nul if downstep is null', () => {
        expect(adjustDownstep('ハチジョー', null)).toEqual(null)
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
    it('should not have any duplicates', () => {
        const ds = getFakeDownSteps(word, 2)
        expect(ds).toEqual([0, 1, 4])
    })

    it('should not have any duplicates', () => {
        const ds = getFakeDownSteps(word, 3)
        expect(ds).toEqual([0, 1, 4])
    })
})

describe('getMVQDownSteps', () => {
    const downStep = 2
    const word = 'ハチジョー'

    it('the required number of options is > actual options', () => {
        const options = getMVQDownSteps(word, downStep, 9).sort()
        expect(options).toEqual([0, 1, 2, 4])
    })

    it('the required number of options is equal to actual options', () => {
        const options = getMVQDownSteps(word, downStep, 4).sort()
        expect(options).toEqual([0, 1, 2, 4])
    })

    it('the required number of options is < actual options', () => {
        const options = getMVQDownSteps(word, downStep, 2).sort()
        expect(options.length).toEqual(2)
    })
})
