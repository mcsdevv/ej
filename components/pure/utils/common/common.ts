import * as A from 'fp-ts/lib/Array'
import * as Eq from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as NA from 'fp-ts/lib/NonEmptyArray'
import fetch from 'node-fetch'

export const dsEqual = (x: number | null, y: DownStep) =>
    O.getEq(Eq.eqNumber).equals(O.fromNullable(x), y)
export const boolsEq = A.getEq(Eq.eqBoolean).equals

export type DownStep = O.Option<number>

export const downStepToArray = (
    downStep: DownStep,
    length: number,
    hasParticle: boolean,
): boolean[] => {
    if (length <= 1 && !hasParticle) {
        return [true]
    }
    const totalLength = length - 1 + Number(hasParticle)

    if (O.isNone(downStep)) {
        return A.flatten([[false], A.replicate(totalLength, true)])
    }

    if (downStep.value === 0) {
        return A.flatten([[true], A.replicate(totalLength, false)])
    }

    return A.flatten([
        [false],
        A.replicate(downStep.value, true),
        A.replicate(
            Math.max(length - downStep.value - 1, 0) + Number(hasParticle),
            false,
        ),
    ])
}

export const isCorrect = (
    downStep: DownStep,
    array: boolean[],
    hasParticle: boolean,
): boolean =>
    boolsEq(array, downStepToArray(downStep, array.length, hasParticle)) ||
    array.length === 1

const between = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const chooseId = (ids: number[]): number =>
    !ids.length ? 0 : ids[between(0, ids.length - 1)]

export const fetcher = (url: string): Promise<any> =>
    fetch(url).then((r) => r.json())

export const smalls = ['ョ', 'ャ', 'ュ', 'ィ', 'ゥ', 'ォ', 'ァ', 'ェ']

export const getSmallCharacterIndexes = (katakana: string): number[] => {
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

    if (pipe(A.head(smallindexes), (x) => dsEqual(0, x))) {
        throw new Error('Word cannot start with little character')
    }

    const startIndexes = smallindexes.map((x) => x - 1).filter((x) => x > -1)

    const targetChars = array.filter((x, i) =>
        A.flatten<number>([smallindexes, startIndexes]).includes(i),
    )

    const pairs = A.chunksOf(2)(targetChars).map((x) => x.join(''))

    return array
        .map((x, i) =>
            startIndexes.includes(i)
                ? pairs[startIndexes.findIndex((j) => j == i)]
                : x,
        )
        .filter((x, i) => !smallindexes.includes(i))
}

export const shuffle = <T>(a: T[]) => {
    const swap = (n1: number, n2: number) => {
        const temp = a[n1]
        a[n1] = a[n2]
        a[n2] = temp
    }

    a.map((x, i) => {
        swap(Math.floor(Math.random() * 10) % a.length, i)
    })

    return a
}

export const getFakeDownSteps = (katakana: string, downStep: DownStep) => {
    const smallindexes = getSmallCharacterIndexes(katakana)
    const startIndexes = smallindexes.map((x) => x - 1).filter((x) => x > -1)
    const badIndexes = smallindexes.concat(startIndexes)

    const fakeDownSteps = A.range(0, katakana.length - 1)
        .filter((x) => !badIndexes.includes(x))
        .filter((x) => !dsEqual(x, downStep))

    return fakeDownSteps
}

export const getMVQDownSteps = (
    katakana: string,
    downStep: DownStep,
    maxOptionCount: number,
): DownStep[] => {
    const fakeDownSteps = getFakeDownSteps(katakana, downStep)
    const numTotake =
        fakeDownSteps.length + 1 < maxOptionCount
            ? fakeDownSteps.length
            : maxOptionCount - 1

    return pipe(
        fakeDownSteps,
        shuffle,
        A.takeLeft(numTotake),
        A.map(O.some),
        (array) => A.snoc(array, downStep),
        shuffle,
    )
}
