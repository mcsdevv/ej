select
  group_concat(distinct katakana),
  group_concat(distinct downstep),
  group_concat(distinct audioFile) af
from Reading
where
  length(downstep) < 2
group by
  katakana
having
  downstep != length(katakana) - 1
  and length(group_concat(distinct downstep)) > 4
order by
  length(katakana) asc