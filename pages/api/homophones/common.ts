import DB from 'better-sqlite3-helper'
import { readFileSync } from 'fs-extra'
import * as R from 'rambda'

export type Record = {
    audioFile: string
    downStep: number
    katakana: string
}
// TODO FIX ME
const p = R.pipe as any
export const chunks = p(
    (filePath: string) => readFileSync(filePath),
    R.toString,
    (query: string): Record[] => DB().query(query),
    R.groupBy((record: Record) => record.katakana),
    R.values,
    R.splitEvery(3),
    R.map((x: Record[][]) => R.flatten(x)),
)('./queries/homophones.sql')
