import NoSSR from 'react-no-ssr'
import useSWR from 'swr'
import { useState } from 'react'
import Main from '../components/main'
import Pure from '../components/accentQuiz/maunalEntry'
import fetch from 'node-fetch'

function between(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const chooseId = (currentId: number, ids: number[]) => {
    const filtered = ids.filter((x) => x !== currentId)
    return filtered[between(0, filtered.length - 1)]
}

type Data = {
    audioFile: string
    downstep: number
    katakana: string
}
const fetcher = (url: string) => fetch(url).then((r) => r.json())

const defaultIds = [18760]

export default function Home() {
    const ids =
        useSWR<number[], Error>(`/api/range`, fetcher)?.data || defaultIds

    const [id, setId] = useState(defaultIds[0])

    const data = useSWR<Data, Error>(`/api/word/${id}`, fetcher)?.data

    return (
        <Main>
            <NoSSR onSSR={<div>W8 M8</div>}>
                {data && (
                    <Pure
                        {...data}
                        onClickNext={() => setId(chooseId(id, ids))}
                    />
                )}
                {null}
            </NoSSR>
        </Main>
    )
}

// TODO rename downstep to downStep
