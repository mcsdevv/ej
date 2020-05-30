import { Row, Col } from 'react-bootstrap'
import * as A from 'fp-ts/lib/Array'
import * as NA from 'fp-ts/lib/NonEmptyArray'
import css from 'styled-jsx/css'
import Option from './Option'
import { getMVQDownSteps, DownStep } from '../../utils/common/common'
import { Particle } from '../../accentWord/container'

type Props = {
    audioFile: string
    katakana: string
    downStep: DownStep
    particle: Particle
}
const rowCount = 2

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

export default ({ audioFile, katakana, downStep, particle }: Props) => {
    const options = getMVQDownSteps(katakana, downStep, rowCount * 2)

    const rowsToDraw = options.length <= 1 ? options.length : rowCount

    const rows = A.chunksOf(rowsToDraw)(options)

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
