import Accent from '../../accentWord/container'
import { Row } from 'react-bootstrap'

type Props = {
    katakana: string
    downStep: number
}

export default ({ katakana, downStep }: Props) => (
    <Row style={{ height: '65%' }}>
        <Accent kana={katakana} downStep={downStep} interactive={true} />
    </Row>
)
