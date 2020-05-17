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
          and downstep NOTNULL
        group by
          katakana
        having
          downstep NOTNULL
          and length(group_concat(distinct downstep)) > 4
      ) l
    left join Reading r on l.katakana = r.katakana
    GROUP by
      r.downstep || r.katakana
    order by
      length(r.katakana) asc
  )