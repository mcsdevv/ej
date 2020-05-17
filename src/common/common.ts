import * as R from 'rambda'
import fetch from 'node-fetch'

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

const between = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const chooseId = (ids: number[]): number => {
    if (!ids.length) {
        return 0
    }
    return ids[between(0, ids.length - 1)]
}

export const fetcher = (url: string): Promise<any> =>
    fetch(url).then((r) => r.json())

export const getSmallCharacterIndexes = (katakana: string): number[] => {
    const smalls = ['ョ', 'ャ', 'ュ', 'ィ', 'ゥ', 'ォ', 'ァ', 'ェ']
    return katakana
        .split('')
        .map((x, i) => ({
            x,
            i,
        }))
        .filter(({ x }) => smalls.includes(x))
        .map(({ i }) => i)
}

export const adjustDownstep = (katakana: string, downStep: number | null) => {
    if (downStep === null) {
        return null
    }
    const smallindexes = getSmallCharacterIndexes(katakana)

    return downStep - smallindexes.filter((x) => x <= downStep).length
}

export const bundleCharacters = (katakana: string): string[] => {
    const array = katakana.split('')
    const smallindexes = getSmallCharacterIndexes(katakana)

    if (smallindexes.length && R.head(smallindexes) === 0) {
        throw new Error('Word cannot start with little character')
    }

    const startIndexes = smallindexes.map((x) => x - 1).filter((x) => x > -1)

    const targetChars = array.filter((x, i) =>
        R.flatten<number>([smallindexes, startIndexes]).includes(i),
    )

    const pairs = R.splitEvery(2, targetChars).map((x) => x.join(''))

    const res = array
        .map((x, i) => {
            if (startIndexes.includes(i)) {
                return pairs[startIndexes.findIndex((j) => j == i)]
            }
            return x
        })
        .filter((x, i) => !smallindexes.includes(i))

    return res
}
