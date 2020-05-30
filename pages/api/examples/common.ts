import { pipe } from 'fp-ts/lib/pipeable'
import * as A from 'fp-ts/lib/Array'
import * as NA from 'fp-ts/lib/NonEmptyArray'

import { execQuery } from '../utils'
import { DownStep } from '../../../components/pure/utils/common/common'
import { Particle } from '../../../components/pure/accentWord/container'

export type Example = {
    audioFile: string
    downStep: DownStep
    particle: Particle
    katakana: string
    sentence: string
}

export const chunks: Example[][] = pipe(
    execQuery('./queries/examples.sql'),
    NA.groupBy((r) => r.katakana),
    (x) => Object.values(x),
    A.chunksOf(3),
    A.flatten,
)
