-- Up
CREATE TABLE `Word` (
  id INTEGER PRIMARY KEY,
  jisho TEXT,
  jishoWord TEXT
);
-- CREATE TABLE `Kanji` (id INTEGER PRIMARY KEY, kanji TEXT, wordId INTEGER,
--     CONSTRAINT kanji_word FOREIGN KEY (wordId)
--         REFERENCES Word (id)
-- );
-- CREATE TABLE `Hiragana` (id INTEGER PRIMARY KEY, hiragana TEXT, wordId INTEGER,
--     CONSTRAINT hiragana_word FOREIGN KEY (wordId)
--         REFERENCES Word (id)
-- );
-- CREATE TABLE `Katakana` (id INTEGER PRIMARY KEY, katakana TEXT, wordId INTEGER,
--     CONSTRAINT katakana_word FOREIGN KEY (wordId)
--         REFERENCES Word (id)
-- );
-- CREATE TABLE `Reading` (id INTEGER PRIMARY KEY, downStep INTEGER, audioFile TEXT, wordId INTEGER,
--     CONSTRAINT reading_word FOREIGN KEY (wordId)
--         REFERENCES Word (id)
-- );
CREATE TABLE `ParticleReading` (
  id INTEGER PRIMARY KEY,
  downStep INTEGER,
  katakana TEXT,
  audioFile TEXT,
  particle TEXT,
  wordId INTEGER,
  nasal TEXT,
  unVoiced TEXT,
  CONSTRAINT reading_word FOREIGN KEY (wordId) REFERENCES Word (id)
);
CREATE TABLE `Reading` (
  id INTEGER PRIMARY KEY,
  downStep INTEGER,
  katakana TEXT,
  audioFile TEXT,
  wordId INTEGER,
  nasal TEXT,
  unVoiced TEXT,
  CONSTRAINT reading_word FOREIGN KEY (wordId) REFERENCES Word (id)
);
CREATE TABLE `Example` (
  id INTEGER PRIMARY KEY,
  downStep INTEGER,
  sentence TEXT,
  particle TEXT,
  katakana TEXT,
  audioFile TEXT,
  wordId INTEGER,
  nasal TEXT,
  unVoiced TEXT,
  CONSTRAINT reading_word FOREIGN KEY (wordId) REFERENCES Word (id)
);
-- Down
DROP TABLE IF EXISTS `Word`;
DROP TABLE IF EXISTS `Kanji`;
DROP TABLE IF EXISTS `Hiragana`;
DROP TABLE IF EXISTS `Katakana`;
DROP TABLE IF EXISTS `Reading`;
DROP TABLE IF EXISTS `ParticleReading`;
DROP TABLE IF EXISTS `Example`;