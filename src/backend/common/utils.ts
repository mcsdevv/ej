import DB from 'better-sqlite3-helper'
import { pipe } from 'fp-ts/lib/pipeable'
import * as A from 'fp-ts/lib/Array'
import * as NA from 'fp-ts/lib/NonEmptyArray'
import * as O from 'fp-ts/lib/Option'
import { readFileSync } from 'fs-extra'
import { shuffle } from '../../frontend/components/pure/utils/common/common'

export const execQuery = (fileName: string) =>
    pipe(
        readFileSync(fileName),
        (o) => o.toString(),
        (query) => DB().query(query),
        A.map((w) => ({
            ...w,
            downStep: O.fromNullable(w.downStep),
            particle: O.fromNullable(w.particle),
        })),
    )

type K = {
    katakana: string
}

export const chunkByKatakana = (words: K[]) =>
    pipe(
        words,
        NA.groupBy((r) => r.katakana),
        (x) => Object.values(x),
        A.chunksOf(5),
        A.map(A.flatten),
    )
