import Wrapper from '../wrapper'
import MultipleChoice from './multipleChoice'
type Props = {
    audioFile: string
    onClickNext: () => void
    katakana: string
    downStep: number
}

export default ({ audioFile, onClickNext, katakana, downStep }: Props) => (
    <Wrapper audioFile={audioFile} onClickNext={onClickNext}>
        <MultipleChoice
            audioFile={audioFile}
            katakana={katakana}
            downStep={downStep}
        />
    </Wrapper>
)
