select kanji, jishoWord, jisho from Word w join Hiragana h on w.id = h.wordId
join Kanji k on w.id = k.wordId where kanji != jishoWord