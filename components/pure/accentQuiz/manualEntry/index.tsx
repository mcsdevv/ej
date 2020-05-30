import Wrapper from '../wrapper'
import ManualEntry from './maunalEntry'
import { DownStep } from '../../utils/common/wrapper'
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
        <ManualEntry
            katakana={katakana}
            downStep={downStep}
            particle={particle}
        />
    </Wrapper>
)
