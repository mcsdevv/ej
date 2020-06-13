import { NextApiRequest, NextApiResponse } from 'next'
import { getChunksByMode, returnResponse } from '../../../backend/common/common'
import { pipe } from 'fp-ts/lib/pipeable'

export default (req: NextApiRequest, res: NextApiResponse) => {
    const {
        query: { _mode },
    } = req

    pipe(
        getChunksByMode(_mode),
        returnResponse(res, (chunks) => chunks.length - 1),
    )
}
