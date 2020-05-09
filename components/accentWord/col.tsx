import { motion } from 'framer-motion'
import { getHeight, getCircleX, radius, wInterval } from './utils'

export default ({
    letter,
    index,
    conHeight,
    high,
    onClick,
}: {
    readonly letter: string
    readonly index: number
    readonly conHeight: number
    readonly high: boolean
    readonly onClick: () => void
}) => {
    const hInterval = getHeight(high)
    return (
        <g onClick={onClick} style={{ pointerEvents: 'all' }}>
            <g>
                <motion.circle
                    initial={{ cy: getHeight(high) }}
                    animate={{ cy: getHeight(high) }}
                    cx={getCircleX(index)}
                    r={radius}
                />
                <motion.text
                    width={radius * 2}
                    initial={{ y: hInterval + radius / 2 }}
                    animate={{ y: hInterval + radius / 2 }}
                    x={+index * wInterval + radius / 2}
                    style={{ fontSize: `${radius * 1.2}` }}
                >
                    {letter}
                </motion.text>
            </g>
            {/* The rectangle is invisible and is only here to make the g tag fill the entire column */}
            <rect
                x={wInterval * index - radius}
                width={wInterval}
                height={conHeight}
                fill={'none'}
            />
        </g>
    )
}
