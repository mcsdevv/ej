import * as A from 'fp-ts/lib/Array'
import { isCorrect, downStepToArray, DownStep } from '../utils/common/wrapper'

export const sWidth = 3
export const radius = 40 - 2 * sWidth
export const wInterval = radius * 4
export const getHeight = (high: boolean) => (high ? 2 * radius : 4 * radius)
export const getCircleX = (index: number) => radius + index * wInterval + sWidth
export const animationDuration = 0.3

export type Action = {
    type: 'reset' | 'toggle'
    index?: number
}

export type State = {
    array: boolean[]
    isCorrect: boolean
}

export const useAccent = (
    hasParticle: boolean,
    length: number,
    downStep: DownStep,
    interactive: boolean,
) => {
    const getInitialArray = (): boolean[] =>
        interactive
            ? A.replicate(length, false)
            : downStepToArray(downStep, length, hasParticle)

    const reducer = (draft: State, action: Action): void => {
        switch (action.type) {
            case 'reset': {
                draft.array = getInitialArray()
                draft.isCorrect = !interactive
                break
            }
            case 'toggle': {
                const i = action.index!
                draft.array[i] = !draft.array[i]
                draft.isCorrect = isCorrect(downStep, draft.array, hasParticle)
                break
            }
        }
    }

    return { getInitialArray, reducer }
}
