import Wrapper from '../wrapper'
import ManualEntry from './maunalEntry'
type Props = {
    audioFile: string
    onClickNext: () => void
    katakana: string
    downStep: number
}

export default ({ audioFile, onClickNext, katakana, downStep }: Props) => (
    <Wrapper audioFile={audioFile} onClickNext={onClickNext}>
        <ManualEntry katakana={katakana} downStep={downStep} />
    </Wrapper>
)
