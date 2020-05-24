import { chunks } from '../common'
import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
    const {
        query: { chunkId },
    } = req
    console.log(chunkId)
    // console.error('ppoop', req.query)
    res.status(200).json(chunks[Number(chunkId)])
}
