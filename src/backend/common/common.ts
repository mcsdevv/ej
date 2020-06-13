import { chunks as sentences } from './sentences'
import { chunks as readings } from './readings'
import { chunks as withParticle } from './withParticle'

import {
    fromNullable,
    mapNullable,
    filter,
    getOrElse,
    flatten,
} from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import {
    left,
    right,
    reduce,
    chain,
    map,
    fromOption,
    flatten as EFlatten,
} from 'fp-ts/lib/Either'
import { NextApiResponse } from 'next'
import { lookup } from 'fp-ts/lib/Array'
import { sequenceT } from 'fp-ts/lib/Apply'

export type Response = { json: any; status: number }
export type ErrorMessage = { error: string }

export const chunkMap = new Map<string, any>(
    Object.entries({ sentences, readings, withParticle }),
)
export const getC = (_mode: any) =>
    pipe(
        fromNullable(_mode),
        mapNullable((mode) => mode.toString()),
        filter((mode) => chunkMap.has(mode)),
        mapNullable((mode) => right(chunkMap.get(mode))),
        getOrElse(() => left({ error: `invalid mode: ${_mode}` })),
    )

export const getId = (_chunkId: any, chunks: any[][]) =>
    pipe(
        fromNullable(_chunkId),
        mapNullable(Number),
        mapNullable((chunkId) => lookup(chunkId, chunks)),
        flatten,
        fromOption(() => ({
            error: `invalid chunkId: ${_chunkId}`,
        })),
    )

export const gg = (_mode: any, _chunkId: any) =>
    pipe(
        getC(_mode),
        map((chunks) => getId(_chunkId, chunks)),
        EFlatten,
    )

export const success = ({ json, status }: NextApiResponse, data: any) => {
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

export const getChunk = (
    _mode: any,
    func: (chunks: any[][]) => any,
    res: NextApiResponse,
) =>
    pipe(
        fromNullable(_mode),
        mapNullable((mode) => mode.toString()),
        filter((mode) => chunkMap.has(mode)),
        mapNullable(
            (mode): Response => ({
                status: 200,
                json: func(chunkMap.get(mode)),
            }),
        ),
        getOrElse(
            (): Response => ({
                status: 400,
                json: { error: `invalid parameter: ${_mode}` },
            }),
        ),
        ({ status, json }) => res.status(status).json(json),
    )
