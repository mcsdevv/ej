import { pipe } from 'fp-ts/lib/pipeable'
import { execQuery, chunkByKatakana } from './utils'

export const chunks = pipe(execQuery('./queries/readings.sql'), chunkByKatakana)
