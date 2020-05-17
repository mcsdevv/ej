import Accent from '../accentWord/container'
import { Button, Container, Row, Col } from 'react-bootstrap'
import { useEffect } from 'react'
import * as R from 'rambda'

type Props = {
    audioFile: string
    katakana: string
    downstep: number
    onClickNext: () => void
}

// copy and pasted from SO
function shuffle(a: number[]) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

const getAcccentRows = (katakana: string, downstep: number) => {
    const potentialDS = shuffle(
        R.range(0, katakana.length).filter((x) => x !== downstep),
    )

    console.log(potentialDS)

    const rowCount = 2
    const optionCount = Math.min(4, katakana.length)
    const options = shuffle(
        R.take(optionCount - 1, potentialDS).concat([downstep]),
    )

    const rows = R.splitEvery(rowCount, options)

    return (
        <div style={{ height: '65%' }}>
            {rows.map((row, i) => (
                <Row
                    key={i}
                    style={{
                        height: `${100 / rowCount}%`,
                        // '50%',
                    }}
                >
                    {row.map((dS, i) => (
                        <Col
                            key={i}
                            style={{
                                height: '100%',
                            }}
                        >
                            <Button
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                variant='secondary'
                                onClick={() => {}}
                            >
                                <Accent
                                    kana={katakana}
                                    downStep={dS}
                                    interactive={false}
                                />
                            </Button>
                        </Col>
                    ))}
                </Row>
            ))}
        </div>
    )
}

export default ({ audioFile, katakana, downstep, onClickNext }: Props) => {
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

            {getAcccentRows(katakana, downstep)}
            {/* {getAcccentRows('フクロ', 1)} */}
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
