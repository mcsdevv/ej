select
  *,
  CAST(downstep as ds)
from Reading
where
  length(downstep) like "%,%";