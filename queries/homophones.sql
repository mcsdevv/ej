SELECT
  id
from (
    select
      katakana
    from Reading
    where
      length(downstep) < 2
    group by
      katakana
    having
      downstep != length(katakana) - 1
      and length(group_concat(distinct downstep)) > 4
  ) l
left join Reading r on l.katakana = r.katakana
GROUP by
  audioFile
order by
  length(r.katakana) asc