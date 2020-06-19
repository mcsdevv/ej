import React from 'react'
import * as O from 'fp-ts/lib/Option'
import { useEffect } from 'react'
import { useImmerReducer } from 'use-immer'
import { useAccent } from './utils'
import { range } from 'fp-ts/lib/Array'

import {
    bundleCharacters,
    adjustDownstep,
    DownStep,
    Particle,
} from '../utils/common/wrapper'

import Col from './col'
import Line from './line'
import { radius } from './utils'

import styles from './accentWord.module.scss'

const height = 240

type Props = {
    katakana: string
    downStep: DownStep
    interactive: boolean
    particle: Particle
}

const Container = ({
    katakana,
    downStep: dirtyDS,
    interactive,
    particle,
}: Props) => {
    const hasParticle = O.isSome(particle)

    const combined = O.isSome(particle)
        ? bundleCharacters(katakana).concat([particle.value])
        : bundleCharacters(katakana)

    const downStep = adjustDownstep(katakana, dirtyDS)

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
    }, [katakana, dirtyDS, particle, interactive])

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

    const lines = range(0, combined.length - 2).map((i) => {
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
            className={`${styles.accentWord} ${
                !interactive
                    ? styles.default
                    : state.isCorrect
                    ? styles.correct
                    : styles.incorrect
            }`}
        >
            {lines}
            {columns}
        </svg>
    )
}

// Container.whyDidYouRender = true

export default Container
