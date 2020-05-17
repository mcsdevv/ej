select
  *
from Reading
where
  id in (
    SELECT
      id -- r.audioFile
    from (
        select
          katakana
        from Reading
        where
          length(downstep) < 2
        group by
          katakana
        having
          length(group_concat(distinct downstep)) > 4
      ) l
    left join Reading r on l.katakana = r.katakana
    where
      downstep NOTNULL
    GROUP by
      r.downstep || r.katakana
    order by
      length(r.katakana) asc
  )