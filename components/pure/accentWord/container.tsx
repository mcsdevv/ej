import { range } from 'lodash'
import * as R from 'rambda'
import { useEffect } from 'react'

import { useImmer } from 'use-immer'

import {
    isCorrect,
    bundleCharacters,
    adjustDownstep,
    downStepToArray,
} from '../utils/common/wrapper'
import Col from './col'
import Line from './line'
import { sWidth, radius } from './utils'

type Props = {
    readonly kana: string
    readonly downStep: number | null
    interactive: boolean
}

const height = 240
const colourDelay = '200ms'

export default ({
    kana,
    downStep: dirtyDS,
    interactive,
}: Props): JSX.Element => {
    const bundled = bundleCharacters(kana)
    const downStep = adjustDownstep(kana, dirtyDS)

    const getInitialArray = (): readonly boolean[] =>
        interactive
            ? R.repeat(false, bundled.length)
            : downStepToArray(downStep, bundled.length)

    const [array, updateArray] = useImmer(getInitialArray())

    const getColour = (): string => {
        if (interactive) {
            return isCorrect(dirtyDS, array) ? 'yellow' : 'red'
        }
        return 'cornflowerblue'
    }

    useEffect(() => {
        updateArray(() => getInitialArray())
    }, [kana, downStep])

    const onClick = (index: number) => {
        updateArray((draft) => {
            draft[index] = !draft[index]
        })
    }

    const columns = bundled.map((x, i) => (
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

    const lines = range(0, bundled.length - 1).map((i) => {
        return <Line key={i} index={i} high1={array[i]} high2={array[i + 1]} />
    })

    return (
        <svg
            viewBox={`${-radius} 0 ${radius * 4 * bundled.length} ${height}`}
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
