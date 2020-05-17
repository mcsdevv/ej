import Accent from '../accentWord/container'
import { Button, Container, Row } from 'react-bootstrap'
import { useEffect } from 'react'

type Props = {
    audioFile: string
    katakana: string
    downstep: number
    onClickNext: () => void
}

export default ({ audioFile, katakana, downstep, onClickNext }: Props) => {
    console.error(audioFile)
    const a = new Audio(`audio/readings/${audioFile}`)
    // Throws an error if the user has not yet interacted with page (chrome)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    const play = () => a.play().catch((e) => {})
    useEffect(() => {
        play()
    }, [audioFile])
    return (
        <Container className='h-100'>
            <Row className='justify-content-center' style={{ height: '15%' }}>
                <Button
                    onClick={() => {
                        play()
                    }}
                >
                    <i
                        className='fas fa-volume-up'
                        style={{ fontSize: '500%' }}
                    ></i>
                </Button>
            </Row>

            <Row style={{ height: '65%' }}>
                <Accent kana={katakana} downStep={downstep} />
            </Row>

            <Row style={{ height: '20%' }}>
                <Button
                    style={{
                        width: '100%',
                        height: '100%',
                        fontSize: '500%',
                    }}
                    active={true}
                    variant='primary'
                    onClick={onClickNext}
                >
                    NEXT
                </Button>
            </Row>
        </Container>
    )
}
