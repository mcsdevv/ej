import DB from 'better-sqlite3-helper'
import { readFileSync } from 'fs-extra'
import { pipe } from 'fp-ts/lib/pipeable'
import * as A from 'fp-ts/lib/Array'
import * as NA from 'fp-ts/lib/NonEmptyArray'

export type Word = {
    audioFile: string
    downStep: number
    katakana: string
}

export const chunks: Word[][] = pipe(
    readFileSync('./queries/homophones.sql'),
    (o) => o.toString(),
    (query): Word[] => DB().query(query),
    NA.groupBy((r) => r.katakana),
    (x) => Object.values(x),
    A.chunksOf(2),
    A.flatten,
)
