import Accent, { Particle } from '../../accentWord/container'
import { Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import css from 'styled-jsx/css'
import { DownStep } from '../../utils/common/wrapper'

type Props = {
    isAnswer: boolean
    katakana: string
    downStep: DownStep
    audioFile: string
    particle: Particle
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

export default ({
    isAnswer,
    katakana,
    downStep,
    particle,
    audioFile,
}: Props) => {
    // console.log('¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥')
    // console.log(katakana, downStep, particle, false)

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
                variant='light'
                onClick={() => setClicked(true)}
            >
                <Accent
                    kana={katakana}
                    downStep={downStep}
                    particle={particle}
                    interactive={false}
                />
            </Button>
            {choiceButtonStyles}
        </>
    )
}
