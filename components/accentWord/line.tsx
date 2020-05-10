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
    const hInterval1 = getHeight(high1)
    const hInterval2 = getHeight(high2)

    return (
        <motion.line
            initial={{ y1: hInterval1, y2: hInterval2 }}
            animate={{ y1: hInterval1, y2: hInterval2 }}
            x1={getCircleX(index)}
            x2={getCircleX(index + 1)}
        />
    )
}
