import Accent from '../../accentWord/container'
import { Row } from 'react-bootstrap'

type Props = {
    katakana: string
    downStep: number | null
    particle: string | null
}

export default ({ katakana, downStep, particle }: Props) => (
    <Row style={{ height: '65%' }}>
        <Accent
            kana={katakana}
            downStep={downStep}
            particle={particle}
            interactive={true}
        />
    </Row>
)
