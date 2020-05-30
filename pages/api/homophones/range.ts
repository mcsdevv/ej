import DB from 'better-sqlite3-helper'
import { chunks } from './common'
import { NextApiRequest, NextApiResponse } from 'next'
import * as A from 'fp-ts/lib/Array'

export default (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json(A.range(0, chunks.length - 1))
}
