import DB from 'better-sqlite3-helper'
import { readFileSync } from 'fs-extra'
import { NextApiRequest, NextApiResponse } from 'next'
DB()
const query = readFileSync('./queries/homophones.sql').toString()
export default (req: NextApiRequest, res: NextApiResponse) => {
    const record = DB().query(query)
    // console.log(record)
    const payload = record.map((x) => x.id)
    res.status(200).json(payload)
}
