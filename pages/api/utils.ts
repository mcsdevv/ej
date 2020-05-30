import DB from 'better-sqlite3-helper'
import { pipe } from 'fp-ts/lib/pipeable'
import * as A from 'fp-ts/lib/Array'
import * as NA from 'fp-ts/lib/NonEmptyArray'
import * as O from 'fp-ts/lib/Option'
import { readFileSync } from 'fs-extra'
import { DownStep } from '../../components/pure/utils/common/common'
import { Particle } from '../../components/pure/accentWord/container'

export type Word = {
    audioFile: string
    downStep: DownStep
    particle: Particle
    katakana: string
}

export type Dirty = {
    audioFile: string
    downStep: number | null
    particle: string | null
    katakana: string
}

export const execQuery = (fileName: string): Word[] =>
    pipe(
        readFileSync(fileName),
        (o) => o.toString(),
        (query): Dirty[] => DB().query(query),
        A.map((w) => ({
            ...w,
            downStep: O.fromNullable(w.downStep),
            particle: O.fromNullable(w.particle),
        })),
    )
