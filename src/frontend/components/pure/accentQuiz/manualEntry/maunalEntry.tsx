import Accent from '../../accentWord/accentWord'
import { Row } from 'react-bootstrap'
import { DownStep, Particle } from '../../utils/common/wrapper'

type Props = {
    katakana: string
    downStep: DownStep
    particle: Particle
}

export default ({ katakana, downStep, particle }: Props) => (
    <Row style={{ height: '65%' }}>
        <Accent
            katakana={katakana}
            downStep={downStep}
            particle={particle}
            interactive={true}
        />
    </Row>
)
