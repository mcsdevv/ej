import Accent from '../../accentWord/container'
import { Row } from 'react-bootstrap'
import { DownStep } from '../../utils/common/wrapper'

type Props = {
    katakana: string
    downStep: DownStep
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
