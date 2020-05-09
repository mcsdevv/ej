import { motion } from 'framer-motion'
import { getHeight, getCircleX } from './utils'

export default ({
    index,
    high1,
    high2,
}: {
    readonly index: number
    readonly high1: boolean
    readonly high2: boolean
}) => {
    return (
        <motion.line
            initial={{ y1: getHeight(high1), y2: getHeight(high2) }}
            animate={{ y1: getHeight(high1), y2: getHeight(high2) }}
            x1={getCircleX(index)}
            x2={getCircleX(index + 1)}
        />
    )
}
