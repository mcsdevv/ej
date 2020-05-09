select
  katakana,
  group_concat(audioFile),
  nasal,
  unVoiced,
  downstep,
  count(katakana) c
from Reading
group by
  katakana,
  nasal,
  unVoiced,
  downstep
having
  c > 1