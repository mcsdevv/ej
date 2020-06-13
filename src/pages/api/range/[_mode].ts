import { NextApiRequest, NextApiResponse } from 'next'
import {
    getChunkMode,
    badRequest,
    success,
} from '../../../backend/common/common'
import { pipe } from 'fp-ts/lib/pipeable'
import { fold } from 'fp-ts/lib/Either'

export default (req: NextApiRequest, res: NextApiResponse) => {
    const {
        query: { _mode },
    } = req

    pipe(
        getChunkMode(_mode),
        fold(
            (error) => badRequest(res, error),
            (chunks) => success(res, chunks.length - 1),
        ),
    )
}
