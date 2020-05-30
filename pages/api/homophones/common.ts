import { pipe } from 'fp-ts/lib/pipeable'
import * as A from 'fp-ts/lib/Array'
import * as NA from 'fp-ts/lib/NonEmptyArray'

import { Word, execQuery } from '../utils'

export const chunks: Word[][] = pipe(
    execQuery('./queries/homophones.sql'),
    NA.groupBy((r) => r.katakana),
    (x) => Object.values(x),
    A.chunksOf(2),
    A.flatten,
)
