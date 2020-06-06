select *
from Reading
where id in (
    SELECT id -- r.audioFile
    from (
        select katakana
        from Reading
        where length(downStep) < 2
        group by katakana
        having length(group_concat(distinct downStep)) > 4
      ) l
      left join Reading r on l.katakana = r.katakana
    where downStep NOTNULL
    GROUP by r.downStep || r.katakana
    order by length(r.katakana) asc
  )
order by katakana