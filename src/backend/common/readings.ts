import { pipe } from 'fp-ts/lib/pipeable'
import { execQuery, chunkByKatakana } from './utils'
// import {
//     DownStep,
//     Particle,
// } from '@/frontend/components/pure/utils/common/wrapper'

export type Word = {
    audioFile: string
    downStep: any //TODO fix these types
    particle: any
    katakana: string
    sentence?: string
}

export const chunks: Word[][] = pipe(
    execQuery('./queries/readings.sql'),
    chunkByKatakana,
)
