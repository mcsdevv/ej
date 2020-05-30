import { range } from 'lodash'
import * as A from 'fp-ts/lib/Array'
import * as NA from 'fp-ts/lib/NonEmptyArray'
import * as O from 'fp-ts/lib/Option'
import { useEffect } from 'react'

import { useImmer } from 'use-immer'

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
    const isParticle = O.isSome(particle)

    const bundled = bundleCharacters(kana)

    const combined = O.isSome(particle)
        ? bundled.concat([particle.value])
        : bundled

    const downStep = adjustDownstep(kana, dirtyDS)

    const getInitialArray = (): readonly boolean[] =>
        interactive
            ? A.replicate(combined.length, false)
            : downStepToArray(downStep, combined.length, isParticle)

    const [array, updateArray] = useImmer(getInitialArray())

    const getColour = (): string => {
        if (interactive) {
            return isCorrect(dirtyDS, array, isParticle) ? 'yellow' : 'red'
        }
        return 'cornflowerblue'
    }

    useEffect(() => {
        updateArray(() => getInitialArray())
    }, [kana, dirtyDS, particle])

    const onClick = (index: number) => {
        updateArray((draft) => {
            draft[index] = !draft[index]
        })
    }

    const columns = combined.map((x, i) => (
        <Col
            key={i}
            letter={x}
            index={i}
            conHeight={height}
            high={array[i]}
            onClick={() => onClick(i)}
            interactive={interactive}
        />
    ))

    const lines = range(0, combined.length - 1).map((i) => {
        return <Line key={i} index={i} high1={array[i]} high2={array[i + 1]} />
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
                        stroke: ${getColour()};
                        transition: stroke ${colourDelay};
                        stroke-width: 5px;
                    }

                    circle {
                        fill: ${getColour()};
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
