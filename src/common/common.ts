import * as R from 'rambda'

export const downStepToArray = (downStep: number | null, length: number) => {
    if (length <= 1) {
        return [true]
    }

    if (downStep === null) {
        return [false].concat(R.repeat(true, length - 1))
    }

    if (downStep === 0) {
        return [true].concat(R.repeat(false, length - 1))
    }

    return [false]
        .concat(R.repeat(true, downStep))
        .concat(R.repeat(false, Math.max(length - downStep - 1, 0)))
}

export const isCorrect = (
    downStep: number | null,
    array: readonly boolean[],
): boolean => {
    return (
        R.equals(array, downStepToArray(downStep, array.length)) ||
        array.length === 1
    )
}

