import DB from 'better-sqlite3-helper'
import { NextApiRequest, NextApiResponse } from 'next'
DB()

export default (req: NextApiRequest, res: NextApiResponse) => {
    const {
        query: { wordId },
    } = req

    const record = DB().query(`
        select katakana, audioFile, downstep from Reading where id = ${wordId};`)

    console.log(record)
    res.status(200).json(record[0])
}
