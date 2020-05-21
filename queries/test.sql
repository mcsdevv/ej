select
  *,
  CAST(downStep as ds)
from Reading
where
  length(downStep) like "%,%";