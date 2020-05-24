import DB from 'better-sqlite3-helper'
import { chunks } from './common'
import { NextApiRequest, NextApiResponse } from 'next'
import * as R from 'rambda'

export default (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json(R.range(0, chunks.length))
}
