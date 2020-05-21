import DB from 'better-sqlite3-helper'
import { NextApiRequest, NextApiResponse } from 'next'
DB()

export default (req: NextApiRequest, res: NextApiResponse) => {
    console.error('DASDASDA')
    console.error(req)

    const {
        query: { wordId },
    } = req

    const record = DB().query(`
        select katakana, audioFile, downStep from Reading where id = ${wordId};`)

    res.status(200).json(record[0])
}
