import { Button, Container, Row, Col } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import css from 'styled-jsx/css'

type Props = {
    audioFile: string
    onClickNext: () => void
    children: React.ReactNode
}

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

export default ({ audioFile, onClickNext, children }: Props) => {
    const a = new Audio(`audio/examples/${audioFile}`)
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

            {children}

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
