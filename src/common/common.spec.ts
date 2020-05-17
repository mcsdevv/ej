import { downStepToArray, isCorrect, chooseId } from './common'

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
