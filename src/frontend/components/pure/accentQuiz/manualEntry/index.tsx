import Wrapper from '../wrapper'
import ManualEntry from './maunalEntry'
import { DownStep, Particle } from '../../utils/common/wrapper'

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
        <ManualEntry
            katakana={katakana}
            downStep={downStep}
            particle={particle}
        />
    </Wrapper>
)
