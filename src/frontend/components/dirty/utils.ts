import { useEffect } from 'react'
import useSWR from 'swr'
import fetch from 'node-fetch'

export const fetcher = (url: string): Promise<any> =>
    fetch(url).then((r) => r.json())

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
