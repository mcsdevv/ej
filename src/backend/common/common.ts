import { chunks as sentences } from './sentences'
import { chunks as readings } from './readings'
import { chunks as withParticle } from './withParticle'

import { fromNullable, mapNullable, chain } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { fromOption, fold } from 'fp-ts/lib/Either'
import { lookup } from 'fp-ts/lib/Array'
import { lookup as mapLookup } from 'fp-ts/lib/Map'
import { eqString } from 'fp-ts/lib/Eq'

import { NextApiResponse } from 'next'

//TODO Should fix these types
export type Response = { json: any; status: number }
export type ErrorMessage = { error: string }

export const chunkMap = new Map<string, any>(
    Object.entries({ sentences, readings, withParticle }),
)

export const getChunksByMode = (_mode: string | string[]) =>
    pipe(
        fromNullable(_mode),
        mapNullable(String),
        chain((mode) => mapLookup(eqString)(mode, chunkMap)),
        fromOption(() => ({ error: `invalid mode: ${_mode}` })),
    )

export const getChunkById = (_chunkId: string | string[]) => <A>(chunks: A[]) =>
    pipe(
        fromNullable(_chunkId),
        mapNullable(Number),
        chain((chunkId) => lookup(chunkId, chunks)),
        fromOption(() => ({ error: `invalid chunkId: ${_chunkId}` })),
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

export const returnResponse = <A, B>(
    res: NextApiResponse,
    transformation?: (data: A) => B,
) =>
    fold(
        (error: ErrorMessage) => badRequest(res, error),
        (data: A) => success(res, transformation ? transformation(data) : data),
    )
