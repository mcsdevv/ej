import DB from 'better-sqlite3-helper'
import { NextApiRequest, NextApiResponse } from 'next'
DB()

function between(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

export default (req: NextApiRequest, res: NextApiResponse) => {
	const id = between(1, 60000)

	const record = DB().query(`
        select hiragana, audioFile, downstep from Word w join Hiragana h on w.id = h.wordId
         join Reading r on w.Id = r.wordId where w.Id = ${id}
    `)

	console.log(record)
	res.status(200).json(record[0])
}
