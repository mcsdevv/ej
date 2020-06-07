import { range } from 'lodash'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { useEffect } from 'react'

import { useImmerReducer } from 'use-immer'

import {
    isCorrect,
    bundleCharacters,
    adjustDownstep,
    downStepToArray,
    DownStep,
} from '../utils/common/wrapper'

import Col from './col'
import Line from './line'
import { sWidth, radius } from './utils'

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

export type Particle = O.Option<string>

type Props = {
    kana: string
    downStep: DownStep
    interactive: boolean
    particle: Particle
}

const height = 240
const colourDelay = '200ms'

export default ({
    kana,
    downStep: dirtyDS,
    interactive,
    particle,
}: Props): JSX.Element => {
    const hasParticle = O.isSome(particle)

    const combined = O.isSome(particle)
        ? bundleCharacters(kana).concat([particle.value])
        : bundleCharacters(kana)

    const downStep = adjustDownstep(kana, dirtyDS)

    const { getInitialArray, reducer } = useAccent(
        hasParticle,
        combined.length,
        downStep,
        interactive,
    )

    const [state, dispatch] = useImmerReducer(reducer, {
        array: getInitialArray(),
        isCorrect: false,
    })

    useEffect(() => {
        dispatch({ type: 'reset' })
    }, [kana, dirtyDS, particle, interactive])

    const color = !interactive
        ? 'cornflowerblue'
        : state.isCorrect
        ? 'yellow'
        : 'red'

    const columns = combined.map((x, i) => (
        <Col
            key={i}
            letter={x}
            index={i}
            conHeight={height}
            high={state.array[i]}
            onClick={() => dispatch({ type: 'toggle', index: i })}
            interactive={interactive}
        />
    ))

    const lines = range(0, combined.length - 1).map((i) => {
        return (
            <Line
                key={i}
                index={i}
                high1={state.array[i]}
                high2={state.array[i + 1]}
            />
        )
    })

    return (
        <svg
            viewBox={`${-radius} 0 ${radius * 4 * combined.length} ${height}`}
            width='100%'
            height='100%'
        >
            {lines}
            {columns}
            <style global jsx>
                {`
                    line {
                        stroke: ${color};
                        transition: stroke ${colourDelay};
                        stroke-width: 5px;
                    }

                    circle {
                        fill: ${color};
                        transition: fill ${colourDelay};
                        stroke-width: ${sWidth}px;
                        stroke: cornflowerblue;
                    }

                    text {
                        fill: white;
                    }
                `}
            </style>
        </svg>
    )
}
