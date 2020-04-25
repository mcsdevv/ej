


select hiragana, count(hiragana) numberOfWords, group_concat(distinct downstep) downStepPatterns from

    (select jisho, hiragana, downstep from Word w join Hiragana h on w.id = h.wordId
                                                join Reading r on w.id = r.wordId
    group by jisho
   )

group by hiragana
order by length(downStepPatterns) desc



