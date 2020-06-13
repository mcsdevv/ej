import { NextApiRequest, NextApiResponse } from 'next'

import { pipe } from 'fp-ts/lib/pipeable'
import { gg, badRequest, success } from '../../../../backend/common/common'
import { fold, getOrElse } from 'fp-ts/lib/Either'

export default (req: NextApiRequest, res: NextApiResponse) => {
    const {
        query: { _mode, _chunkId },
    } = req

    pipe(
        gg(_mode, _chunkId),
        fold(
            (error) => badRequest(res, error),
            (data) => success(res, data),
        ),
    )

    //     fromNullable(_chunkId),
    //     mapNullable((chunkId: any) => Number(chunkId),
    //     filter((chunkId) => chunkId < chunks.length),
    //     mapNullable(
    //         (mode): Response => ({
    //             status: 200,
    //             json: func(chunkMap.get(mode)),
    //         }),
    //     ),
    //     getOrElse(
    //         (): Response => ({
    //             status: 400,
    //             json: { error: `invalid parameter: ${_mode}` },
    //         }),
    //     ),
    //     ({ status, json }) => res.status(status).json(json),
    // )
}
