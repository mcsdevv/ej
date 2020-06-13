import { chunks as sentences } from './sentences'
import { chunks as readings } from './readings'
import { chunks as withParticle } from './withParticle'

import { fromNullable, mapNullable, flatten } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { fromOption, fold } from 'fp-ts/lib/Either'
import { NextApiResponse } from 'next'
import { lookup } from 'fp-ts/lib/Array'
import { lookup as mapLookup } from 'fp-ts/lib/Map'

import { eqString } from 'fp-ts/lib/Eq'

export type Response = { json: unknown; status: number }
export type ErrorMessage = { error: string }

export const chunkMap = new Map<string, unknown>(
    Object.entries({ sentences, readings, withParticle }),
)

export const getChunkMode = (_mode: unknown) =>
    pipe(
        fromNullable(_mode),
        mapNullable(String),
        mapNullable((mode) => mapLookup(eqString)(mode, chunkMap)),
        flatten,
        fromOption(() => ({ error: `invalid mode: ${_mode}` })),
    )

export const getChunkById = (_chunkId: unknown) => <A>(chunks: A[][]) =>
    pipe(
        fromNullable(_chunkId),
        mapNullable(Number),
        mapNullable((chunkId) => lookup(chunkId, chunks)),
        flatten,
        fromOption(() => ({
            error: `invalid chunkId: ${_chunkId}`,
        })),
    )

export const success = <A>({ json, status }: NextApiResponse, data: A) => {
    status(200)
    json(data)
}

export const badRequest = (
    { json, status }: NextApiResponse,
    error: ErrorMessage,
) => {
    status(400)
    json(error)
}

export const returnResponse = (
    res: NextApiResponse,
    transformation: <A, B>(data: A) => B,
) =>
    fold(
        (error: ErrorMessage) => badRequest(res, error),
        (data) => success(res, transformation(data)),
    )
