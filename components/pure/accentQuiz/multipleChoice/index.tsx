import Wrapper from '../wrapper'
import MultipleChoice from './multipleChoice'
import { DownStep } from '../../utils/common/common'
type Props = {
    audioFile: string
    onClickNext: () => void
    katakana: string
    downStep: DownStep
    particle: string | null
}

export default ({
    audioFile,
    onClickNext,
    katakana,
    downStep,
    particle,
}: Props) => (
    <Wrapper audioFile={audioFile} onClickNext={onClickNext}>
        <MultipleChoice
            audioFile={audioFile}
            katakana={katakana}
            downStep={downStep}
            particle={particle}
        />
    </Wrapper>
)
