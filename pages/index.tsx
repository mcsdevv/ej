import Main from '../components/pure/main'
import Link from 'next/link'
import { Container, Row } from 'react-bootstrap'

export default () => {
    return (
        <Main>
            <Container>
                <Row>
                    <Link href='/sentences'>
                        <a>Example Sentences</a>
                    </Link>
                </Row>
                <Row>
                    <Link href='/readings'>
                        <a>Word Readings</a>
                    </Link>
                </Row>
            </Container>
        </Main>
    )
}
