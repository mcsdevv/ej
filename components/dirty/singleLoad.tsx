import NoSSR from 'react-no-ssr'
import useSWR from 'swr'
import { useState } from 'react'
import Pure from '../pure/accentQuiz/maunalEntry'
import Loader from 'react-loader-spinner'
import { Container, Row } from 'react-bootstrap'
import { chooseId, fetcher } from '../pure/utils/common/wrapper'

type Data = {
    audioFile: string
    downstep: number
    katakana: string
}

export default function () {
    const ids = useSWR<number[], Error>(`/api/range`, fetcher)?.data

    const [id, setId] = useState<number | null>(null)

    const pickrandomId = () => {
        const nextId = chooseId(id!, ids!)
        if (nextId) {
            setId(nextId)
        }
    }

    if (ids && !id) {
        pickrandomId()
    }

    const { data } = useSWR<Data, Error>(id ? `/api/word/${id}` : null, fetcher)

    return (
        <NoSSR onSSR={<Loader width={500} height={1000} type='Hearts' />}>
            {!data && (
                <Container className='h-100'>
                    <Row
                        className='justify-content-center'
                        style={{ height: '100%' }}
                    >
                        <Loader width={500} height={1000} type='Hearts' />
                    </Row>
                </Container>
            )}
            {data && <Pure {...data} onClickNext={pickrandomId} />}
        </NoSSR>
    )
}

// TODO rename downstep to downStep
