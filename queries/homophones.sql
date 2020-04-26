
select 
*
-- count(*) 
from

    (select group_concat(jisho), hiragana, count(hiragana) numberOfWords, 
    group_concat(distinct downstep) downStepPatterns, count (distinct downstep) c from

        (select jisho, hiragana, downstep from Word w join Hiragana h on w.id = h.wordId
                                                    join Reading r on w.id = r.wordId
        group by jisho
    )



    group by hiragana
    -- having
    -- c > 2
    order by length(downStepPatterns) desc)





