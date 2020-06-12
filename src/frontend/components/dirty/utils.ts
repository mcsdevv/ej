import { useEffect } from 'react'
import fetch from 'node-fetch'
import * as A from 'fp-ts/lib/Array'
import { Word } from '@/backend/common/readings'
import { chooseId } from '../pure/utils/common/wrapper'

export const fetcher = (url: string): Promise<any> =>
    fetch(url).then((r) => r.json())

export const useFetch = (
    url: string,
    onSuccess: <S>(data: S) => void,
    onError: (error: Error) => void,
    ...conditions: boolean[]
) => {
    useEffect(() => {
        if (conditions.every((x) => x)) {
            fetch(url)
                .then((raw) => raw.json())
                .then((data) => onSuccess(data))
                .catch((error) => onError(error))
        }
    }, [url])
}

export type Action = {
    type: 'nextWord' | 'nextChunk' | 'setNsc' | 'setNsw' | 'setChunk'
    payload?: any
}

export type State = {
    chunkIndex: number
    wordIndex: number
    nsc: number[]
    nsw: number[]
    chunkCount: number
    chunk?: Word[]
    wait: boolean
}

export const reducer = (draft: State, action: Action): void => {
    // console.log(action)
    switch (action.type) {
        case 'setChunk': {
            draft.chunk = action.payload
            const range = A.range(0, draft.chunk!.length - 1)
            draft.wordIndex = 0
            draft.nsw = range.filter((x) => x !== draft.wordIndex)
            draft.wait = false
            return
        }
        case 'setNsc': {
            draft.chunkCount = action.payload
            draft.nsc = A.range(0, draft.chunkCount).filter(
                (x) => x !== draft.chunkIndex,
            )
            return
        }
        case 'nextWord': {
            draft.wordIndex++
            draft.nsw = A.filter((x: number) => x !== draft.wordIndex)(
                draft.nsw,
            )
            return
        }
        case 'nextChunk': {
            draft.wait = true
            draft.chunkIndex = chooseId(draft.nsc)
            if (draft.nsc.length > 1) {
                draft.nsc = draft.nsc.filter((x) => x !== draft.chunkIndex)
            } else {
                draft.nsc = A.range(0, draft.chunkCount).filter(
                    (x) => x !== draft.chunkIndex,
                )
            }
            return
        }
    }
}

// export const get = useSWR(
//     () => (conditions.some((x) => !x) ? null : url),
//     fetcher,
// )

// export const onResponse = (
//     url: string,
//     callback: (data: any) => void,
//     ...conditions: boolean[]
// ) => {
//     const res = useSWR(conditions.some((x) => !x) ? null : url, fetcher)

//     console.log(url, res)
//     const { data, isValidating } = res
//     useEffect(() => {
//         if (data) {
//             callback(data)
//         }
//     }, [data])
// }
