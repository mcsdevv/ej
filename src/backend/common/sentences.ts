import { pipe } from 'fp-ts/lib/pipeable'

import { execQuery, chunkByKatakana } from './utils'
import {
    DownStep,
    Particle,
} from '@/frontend/components/pure/utils/common/common'

export type Example = {
    audioFile: string
    downStep: DownStep
    particle: Particle
    katakana: string
    sentence: string
}

export const chunks: Example[][] = pipe(
    execQuery('./queries/sentences.sql'),
    chunkByKatakana,
)

// TODO cant just add a particle for the example sentences willy nilly, sometimes the next thing is another word e.g lookup 琴瑟相和す
