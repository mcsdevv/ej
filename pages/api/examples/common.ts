import { pipe } from 'fp-ts/lib/pipeable'
import * as A from 'fp-ts/lib/Array'
import * as NA from 'fp-ts/lib/NonEmptyArray'

import { Word, execQuery } from '../utils'

export const chunks: Word[][] = pipe(
    execQuery('./queries/examples.sql'),
    NA.groupBy((r) => r.katakana),
    (x) => Object.values(x),
    A.chunksOf(1),
    A.flatten,
)
