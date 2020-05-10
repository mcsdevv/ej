import { range } from 'lodash'
import * as R from 'rambda'
import { useEffect } from 'react'

import { useImmer } from 'use-immer'

import { isCorrect } from '../../src/common/wrapper'
import Col from './col'
import Line from './line'
import { sWidth, radius } from './utils'

type Props = {
    readonly kana: string
    readonly downStep: number | null
}

const height = 240
const colourDelay = '200ms'

const getColour = (
    downStep: number | null,
    array: readonly boolean[],
): string => {
    return isCorrect(downStep, array) ? 'green' : 'red'
}

const getInitialArray = (length: number): readonly boolean[] =>
    R.repeat(false, length)

export default ({ kana, downStep }: Props): JSX.Element => {
    const [array, updateArray] = useImmer(getInitialArray(kana.length))

    useEffect(() => {
        updateArray(() => getInitialArray(kana.length))
    }, [kana, downStep])

    const onClick = (index: number) => {
        updateArray((draft) => {
            draft[index] = !draft[index]
        })
    }

    const columns = kana
        .split('')
        .map((x, i) => (
            <Col
                key={i}
                letter={x}
                index={i}
                conHeight={height}
                high={array[i]}
                onClick={() => onClick(i)}
            />
        ))

    const lines = range(0, kana.length - 1).map((i) => {
        return <Line key={i} index={i} high1={array[i]} high2={array[i + 1]} />
    })

    return (
        <svg
            viewBox={`${-radius} 0 ${radius * 4 * kana.length} ${height}`}
            width='100%'
            height='100%'
        >
            {lines}
            {columns}
            <style global jsx>
                {`
                    line {
                        stroke: ${getColour(downStep, array)};
                        transition: stroke ${colourDelay};
                        stroke-width: 5px;
                    }

                    circle {
                        fill: ${getColour(downStep, array)};
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
