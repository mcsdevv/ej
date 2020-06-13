import React from 'react'
import { motion } from 'framer-motion'
import {
    getHeight,
    getCircleX,
    radius,
    wInterval,
    animationDuration,
} from './utils'

type Props = {
    letter: string
    index: number
    conHeight: number
    high: boolean
    onClick: (e: any) => void
    interactive: boolean
}

export default ({
    letter,
    index,
    conHeight,
    high,
    onClick,
    interactive,
}: Props) => {
    const hInterval = getHeight(high)

    return (
        <g
            className={high ? 'high' : 'low'}
            onClick={onClick}
            style={{ pointerEvents: interactive ? 'all' : 'none' }}
        >
            <g>
                <motion.circle
                    transition={{
                        duration: animationDuration,
                    }}
                    initial={{ cy: hInterval }}
                    animate={{ cy: hInterval }}
                    cx={getCircleX(index)}
                    r={radius}
                />
                <motion.text
                    transition={{
                        duration: animationDuration,
                    }}
                    width={radius * 2}
                    initial={{
                        y:
                            letter.length === 1
                                ? hInterval + radius / 2
                                : hInterval + radius / 3,
                    }}
                    animate={{
                        y:
                            letter.length === 1
                                ? hInterval + radius / 2
                                : hInterval + radius / 3,
                    }}
                    x={
                        letter.length === 1
                            ? +index * wInterval + radius / 2 - 3
                            : +index * wInterval + radius / 3 - 2
                    }
                    style={{
                        fontSize: `${
                            letter.length === 1 ? radius * 1.2 : radius * 0.8
                        }`,
                    }}
                >
                    {letter}
                </motion.text>
            </g>
            {/* The rectangle is invisible and is only here to make the g tag fill the entire column */}
            <rect
                x={wInterval * index - radius}
                width={wInterval}
                height={conHeight + radius}
                fill={'none'}
            />
        </g>
    )
}
