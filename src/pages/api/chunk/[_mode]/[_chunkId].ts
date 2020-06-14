import { NextApiRequest, NextApiResponse } from 'next'

import { pipe } from 'fp-ts/lib/pipeable'
import {
    getChunksByMode,
    getChunkById,
    returnResponse,
} from '../../../../backend/common/common'
import { chain } from 'fp-ts/lib/Either'

export default (req: NextApiRequest, res: NextApiResponse) => {
    const {
        query: { _mode, _chunkId },
    } = req
    pipe(
        getChunksByMode(_mode),
        chain(getChunkById(_chunkId)),
        returnResponse(res),
    )
}
