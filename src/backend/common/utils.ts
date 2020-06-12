import DB from 'better-sqlite3-helper'
import { pipe } from 'fp-ts/lib/pipeable'
import * as A from 'fp-ts/lib/Array'
import * as NA from 'fp-ts/lib/NonEmptyArray'
import * as O from 'fp-ts/lib/Option'
import { readFileSync } from 'fs-extra'
import { shuffle } from '@/frontend/components/pure/utils/common/common'

export const execQuery = (fileName: string): any[] =>
    pipe(
        readFileSync(fileName),
        (o) => o.toString(),
        (query): any[] => DB().query(query),
        A.map((w) => ({
            ...w,
            downStep: O.fromNullable(w.downStep),
            particle: O.fromNullable(w.particle),
        })),
    )

export const chunkByKatakana = (words: any[]) =>
    pipe(
        words,
        NA.groupBy((r) => r.katakana),
        (x) => Object.values(x),
        A.chunksOf(10),
        shuffle,
        A.map(A.flatten),
    )
