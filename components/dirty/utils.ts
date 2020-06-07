import { useEffect } from 'react'
import useSWR from 'swr'
import fetch from 'node-fetch'

export const fetcher = (url: string): Promise<any> =>
    fetch(url).then((r) => r.json())

export const onResponse = (
    url: string,
    callback: (data: any) => void,
    ...conditions: boolean[]
) => {
    const { data } = useSWR<number>(
        () => (conditions.some((x) => !x) ? null : url),
        fetcher,
    )
    useEffect(() => {
        if (data) {
            callback(data)
        }
    }, [data])
}
