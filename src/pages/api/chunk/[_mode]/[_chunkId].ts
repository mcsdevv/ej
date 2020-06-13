import { NextApiRequest, NextApiResponse } from 'next'

import { pipe } from 'fp-ts/lib/pipeable'
import {
    getChunkMode,
    getChunkById,
    badRequest,
    success,
} from '../../../../backend/common/common'
import { fold, map, flatten } from 'fp-ts/lib/Either'

export default (req: NextApiRequest, res: NextApiResponse) => {
    const {
        query: { _mode, _chunkId },
    } = req

    pipe(
        getChunkMode(_mode),
        map(getChunkById(_chunkId)),
        flatten,
        fold(
            (error) => badRequest(res, error),
            (data) => success(res, data),
        ),
    )
}
