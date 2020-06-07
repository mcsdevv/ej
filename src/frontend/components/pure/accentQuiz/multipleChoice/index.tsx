import Wrapper from '../wrapper'
import MultipleChoice from './multipleChoice'
import { DownStep } from '../../utils/common/common'
import { Particle } from '../../accentWord/container'
type Props = {
    audioFile: string
    onClickNext: () => void
    katakana: string
    downStep: DownStep
    particle: Particle
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
