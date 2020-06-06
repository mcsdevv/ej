import { chunks as sentences } from '../../../common/sentences/sentences'
import { chunks as readings } from '../../../common/readings/readings'
import { chunks as withParticle } from '../../../common/withParticle/withParticle'

import { NextApiRequest, NextApiResponse } from 'next'

const chunkMap = new Map<string, any>(
    Object.entries({ sentences, readings, withParticle }),
)

// console.log('cm', chunkMap)

export default (req: NextApiRequest, res: NextApiResponse) => {
    const {
        query: { _mode },
    } = req

    const mode = _mode.toString()

    if (!chunkMap.has(mode)) {
        res.status(404).json({ error: 'mode not found' })
    }
    const chunks = new Map(chunkMap.get(mode))

    res.status(200).json(chunks.size - 1)
}
