import { Row, Col } from 'react-bootstrap'
import * as A from 'fp-ts/lib/Array'
import * as NA from 'fp-ts/lib/NonEmptyArray'
import css from 'styled-jsx/css'
import * as O from 'fp-ts/lib/Option'
import Option from './Option'
import { getMVQDownSteps, DownStep } from '../../utils/common/common'
import { Particle } from '../../accentWord/container'
import { cons } from 'fp-ts/lib/ReadonlyArray'
import { option } from 'fp-ts/lib/Option'

type Props = {
    audioFile: string
    katakana: string
    downStep: DownStep
    particle: Particle
}
const minRows = 2
const maxCols = 2
const maxOptions = 10

export default ({ audioFile, katakana, downStep, particle }: Props) => {
    const options = getMVQDownSteps(
        katakana + O.getOrElse(() => '')(particle),
        downStep,
        maxOptions,
    )

    console.log('opts', options)

    const rowsToDraw = Math.max(minRows, Math.ceil(options.length / maxCols))

    console.log('rtd', rowsToDraw)

    const rows = A.chunksOf(Math.ceil(options.length / rowsToDraw))(options)

    // console.log()

    const { className: colClassName, styles: colStyles } = css.resolve`
        .col {
            height: 100%;
            padding: 1%;
        }
    `

    const { className: rowClassName, styles: rowStyles } = css.resolve`
        .row {
            height: ${100 / rowsToDraw}%;
        }
    `

    return (
        <div style={{ height: '65%' }}>
            {rows.map((row, i) => (
                <Row key={i} className={rowClassName}>
                    {row.map((dS, i) => (
                        <Col className={colClassName} key={i}>
                            <Option
                                downStep={dS}
                                katakana={katakana}
                                particle={particle}
                                isAnswer={dS === downStep}
                                audioFile={audioFile}
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
