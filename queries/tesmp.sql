select
  katakana,
  group_concat(audioFile),
  nasal,
  unVoiced,
  downStep,
  count(katakana) c
from Reading
group by
  katakana,
  nasal,
  unVoiced,
  downStep
having
  c > 1