import SingleLoad from '../components/dirty/singleLoad'
import MultiLoad from '../components/dirty/multiLoad'

import Main from '../components/pure/main'
import { getChunks } from './api/homophones/common'

export async function getStaticProps(context: any) {
    const chunks = { lists: getChunks() }
    // getChunks()
    console.log(chunks)
    return {
        props: chunks,
    }
}

export default function Home({ lists }: any) {
    return (
        <Main>
            <MultiLoad chunks={lists} />
        </Main>
    )
}

// TODO rename downstep to downStep
