import DB from 'better-sqlite3-helper'
import { readFileSync } from 'fs-extra'
import * as R from 'rambda'

export type Record = {
    audioFile: string
    downstep: number
    katakana: string
}

export const chunks = R.pipe(
    (filePath: string) => readFileSync(filePath),
    R.toString,
    (query: string): Record[] => DB().query(query),
    R.groupBy((record: Record) => record.katakana),
    R.values,
    R.splitEvery(1),
    R.map((x) => R.flatten(x)),
)('./queries/homophones.sql')
