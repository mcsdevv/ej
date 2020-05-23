import Wrapper from '../wrapper'
import ManualEntry from './maunalEntry'
type Props = {
    audioFile: string
    onClickNext: () => void
    katakana: string
    downStep: number | null
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
