import DB from 'better-sqlite3-helper'
import { pipe } from 'fp-ts/lib/pipeable'
import { readFileSync } from 'fs-extra'

export type Word = {
    audioFile: string
    downStep: number
    katakana: string
}

export const execQuery = (fileName: string): Word[] =>
    pipe(
        readFileSync(fileName),
        (o) => o.toString(),
        (query): Word[] => DB().query(query),
    )
