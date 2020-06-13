import { NextApiRequest, NextApiResponse } from 'next'
import { getChunk } from '../../../backend/common/common'

export default (req: NextApiRequest, res: NextApiResponse) => {
    const {
        query: { _mode },
    } = req

    getChunk(_mode, (chunks) => chunks.length - 1, res)
}
