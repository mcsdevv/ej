import Accent from '../../accentWord/container'
import { Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import css from 'styled-jsx/css'

type Props = {
    isAnswer: boolean
    katakana: string
    downStep: number | null
    audioFile: string
}

export default ({ isAnswer, katakana, downStep, audioFile }: Props) => {
    const [clicked, setClicked] = useState(false)

    const correctnessClass = isAnswer ? 'correct' : 'incorrect'
    const currentClass = clicked ? correctnessClass : ''

    useEffect(() => {
        setClicked(false)
    }, [audioFile])

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
