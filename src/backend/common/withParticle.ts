import { pipe } from 'fp-ts/lib/pipeable'
import * as A from 'fp-ts/lib/Array'
import * as NA from 'fp-ts/lib/NonEmptyArray'

import { execQuery, chunkByKatakana } from './utils'

export type WithParticle = {
    audioFile: string
    downStep: any //TODO fix tese types
    particle: any
    katakana: string
}

export const chunks: WithParticle[][] = pipe(
    execQuery('./queries/withParticle.sql'),
    chunkByKatakana,
)

// TODO cant just add a particle for the example sentences willy nilly, sometimes the next thing is another word e.g lookup 琴瑟相和す
