import Loader from 'react-loader-spinner'
import { Container, Row } from 'react-bootstrap'

type Props = {
    wait: boolean
    children?: React.ReactNode
}

export default ({ wait, children }: Props) => (
    <>
        {wait ? (
            <Container className='h-100'>
                <Row
                    className='justify-content-center'
                    style={{ height: '80%' }}
                >
                    <Loader width={500} height={1000} type='Hearts' />
                </Row>
            </Container>
        ) : (
            children
        )}
    </>
)
