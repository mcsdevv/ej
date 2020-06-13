import { pipe } from 'fp-ts/lib/pipeable'

import { execQuery, chunkByKatakana } from './utils'

export const chunks = pipe(
    execQuery('./queries/sentences.sql'),
    chunkByKatakana,
)

// TODO cant just add a particle for the example sentences willy nilly, sometimes the next thing is another word e.g lookup 琴瑟相和す
