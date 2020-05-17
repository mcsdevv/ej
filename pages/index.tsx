import SingleLoad from '../components/dirty/singleLoad'
import MultiLoad from '../components/dirty/multiLoad'

import Main from '../components/pure/main'
import { chunks } from './api/homophones/common'
import AccentWord from '../components/pure/accentWord/container'

export async function getStaticProps(context: any) {
    return {
        props: { chunks },
    }
}

export default function Home({ chunks }: any) {
    return (
        <Main>
            {/* <MultiLoad chunks={chunks} /> */}
            <AccentWord kana='ハチジョー' downStep={3} />
        </Main>
    )
}

// TODO rename downstep to downStep
