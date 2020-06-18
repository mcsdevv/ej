import { range } from 'lodash'

import * as O from 'fp-ts/lib/Option'
import { useEffect } from 'react'

import { useImmerReducer } from 'use-immer'

import { useAccent } from './utils'

import {
    bundleCharacters,
    adjustDownstep,
    DownStep,
    Particle,
} from '../utils/common/wrapper'

import Col from './col'
import Line from './line'
import { sWidth, radius } from './utils'
import React from 'react'

const height = 240
const colourDelay = '200ms'

type Props = {
    kana: string
    downStep: DownStep
    interactive: boolean
    particle: Particle
}

const Container = ({
    kana,
    downStep: dirtyDS,
    interactive,
    particle,
}: Props) => {
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
            <style jsx>
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

// Container.whyDidYouRender = true

export default Container
