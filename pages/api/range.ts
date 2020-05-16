import DB from 'better-sqlite3-helper'
import { readFileSync } from 'fs-extra'
import { NextApiRequest, NextApiResponse } from 'next'

const query = readFileSync('./queries/homophones.sql').toString()

DB()
export default (req: NextApiRequest, res: NextApiResponse) => {
    const record = DB().query(query)
    console.log(record)
    const payload = record
    res.status(200).json(payload)
}
