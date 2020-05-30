import { chunks } from '../common'
import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
    const {
        query: { chunkId },
    } = req
    console.log(chunkId)
    res.status(200).json(chunks[Number(chunkId)])
}
