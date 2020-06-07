import { chunks as sentences } from '@/backend/common/sentences'
import { chunks as readings } from '@/backend/common/readings'
import { chunks as withParticle } from '@/backend/common/withParticle'

import { NextApiRequest, NextApiResponse } from 'next'

const chunkMap = new Map<string, any>(
    Object.entries({ sentences, readings, withParticle }),
)

export default (req: NextApiRequest, res: NextApiResponse) => {
    const {
        query: { _mode, _chunkId },
    } = req

    const mode = _mode.toString()
    const chunkId = Number(_chunkId)

    if (!chunkMap.has(mode)) {
        res.status(404).json({ error: 'mode not found' })
    }

    const chunks = new Map(
        chunkMap.get(mode).map((x: any, i: number) => [i, x]),
    )

    if (!chunks.has(chunkId)) {
        res.status(404).json({ error: 'chunk not found' })
    }

    res.status(200).json(chunks.get(chunkId))
}
