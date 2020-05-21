select
  group_concat(distinct katakana),
  group_concat(distinct downStep),
  group_concat(distinct audioFile) af
from Reading
where
  length(downStep) < 2
group by
  katakana
having
  downStep != length(katakana) - 1
  and length(group_concat(distinct downStep)) > 4
order by
  length(katakana) asc