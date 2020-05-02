
select group_concat(audioFile), part, count(part) c from

(select 
audioFile, 
substr(audioFile, length(audioFile) - 8 ) part 
-- substr(audioFile, length(audioFile) - 16, 8 ) part 
from Reading)


-- join
-- Kanji k on w.id = k.wordId


group by part
-- where kanji = "円"
-- where 

ORDER by c ASC


