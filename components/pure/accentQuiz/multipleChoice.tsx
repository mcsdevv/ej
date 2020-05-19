import Accent from '../accentWord/container'
import { Button, Container, Row, Col } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import * as R from 'rambda'
import css from 'styled-jsx/css'

type Props = {
    audioFile: string
    katakana: string
    downstep: number
    onClickNext: () => void
}
const rowCount = 2
// copy and pasted from SO
function shuffle(a: number[]) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

const {
    className: choiceButtonClassName,
    styles: choiceButtonStyles,
} = css.resolve`
    .btn {
        width: 100%;
        height: 100%;
    }
    .correct {
        background-color: yellow;
    }

    .incorrect {
        background-color: red;
    }
`
const {
    className: nextButtonClassName,
    styles: nextButtonStyles,
} = css.resolve`
    .btn {
        width: 100%;
        height: 100%;
        font-size: 500%;
    }
`

const { className: colClassName, styles: colStyles } = css.resolve`
    .col {
        height: 100%;
        padding: 5%;
    }
`

const { className: rowClassName, styles: rowStyles } = css.resolve`
    .row {
        height: ${100 / rowCount}%;
    }
`
type OptionProps = {
    isAnswer: boolean
    katakana: string
    downStep: number | null
}

const Option = ({ isAnswer, katakana, downStep }: OptionProps) => {
    const [clicked, setClicked] = useState(false)

    const correctnessClass = isAnswer ? 'correct' : 'incorrect'
    const currentClass = clicked ? correctnessClass : ''

    useEffect(() => {
        setClicked(false)
    }, [katakana, downStep])

    // TODO check out hachijou dowstep 2 and 3 are rendered the exact same

    return (
        <>
            <Button
                className={`${choiceButtonClassName} ${currentClass}`}
                variant='secondary'
                onClick={() => setClicked(true)}
            >
                <Accent
                    kana={katakana}
                    downStep={downStep}
                    interactive={false}
                />
            </Button>
            {choiceButtonStyles}
        </>
    )
}

const getAcccentRows = (katakana: string, downstep: number) => {
    const potentialDS = shuffle(
        R.range(0, katakana.length).filter((x) => x !== downstep),
    )

    console.log(potentialDS)

    const optionCount = Math.min(4, katakana.length)
    const options = shuffle(
        R.take(optionCount - 1, potentialDS).concat([downstep]),
    )

    const rows = R.splitEvery(rowCount, options)

    return (
        <div style={{ height: '65%' }}>
            {rows.map((row, i) => (
                <Row key={i} className={rowClassName}>
                    {row.map((dS, i) => (
                        <Col className={colClassName} key={i}>
                            <Option
                                downStep={dS}
                                katakana={katakana}
                                isAnswer={dS === downstep}
                            />
                        </Col>
                    ))}
                    {colStyles}
                </Row>
            ))}
            {rowStyles}
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
                    className={nextButtonClassName}
                    active={true}
                    variant='primary'
                    onClick={onClickNext}
                >
                    NEXT
                </Button>
                {nextButtonStyles}
            </Row>
        </Container>
    )
}
