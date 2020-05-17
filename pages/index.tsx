import SingleLoad from '../components/dirty/singleLoad'
import MultiLoad from '../components/dirty/multiLoad'

import Main from '../components/pure/main'
import { chunks } from './api/homophones/common'

export async function getStaticProps(context: any) {
    return {
        props: { chunks },
    }
}

export default function Home({ chunks }: any) {
    return (
        <Main>
            <MultiLoad chunks={chunks} />
        </Main>
    )
}

// TODO rename downstep to downStep
