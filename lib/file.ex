defmodule R do
  @derive [Poison.Encoder]
  defstruct [:nhk, :ojad, :frequency, :hinshi]
end

defmodule Conjugation do
  defstruct [:hiragana, :html, :image, :male, :female]

  def extractConjugation(dirty) do
    with {:ok, image} <- Map.fetch(dirty, "image"),
         {:ok, male} <- Map.fetch(dirty, "male"),
         {:ok, female} <- Map.fetch(dirty, "female"),
         {:ok, html} <- Map.fetch(dirty, "html") do
      %Conjugation{image: image, male: male, female: female, html: html}
    end
  end
end

defmodule OJAD do
  import Conjugation

  defstruct [:midashi, :conjugations]

  def extractOJAD(dirty) do
    Map.get(dirty, "all")
    |> Enum.map(fn [hiragana, y] -> %Conjugation{extractConjugation(y) | hiragana: hiragana} end)
  end
end

defmodule Yomi do
  defstruct [:audio, :accent]

  def getAccent(images, notDownSteps) do
    [dS] = images -- notDownSteps
    Enum.find_index(images, fn image -> image == dS end)
  end

  def extractYomi(dirty, notDownSteps) do
    Enum.map(dirty, fn [audio, images] ->
      %Yomi{audio: audio, accent: getAccent(images, notDownSteps)}
    end)
  end
end

defmodule NHK do
  import Yomi
  defstruct [:jisho, :kanji, :kana, :yomi, :jishoWord, :katakana]

  def extractNHK(dirty, notDownSteps) do
    with {:ok, jishoT} <- Map.fetch(dirty, "jisho"),
         {:ok, kana} <- Map.fetch(dirty, "kana"),
         {:ok, yomi} <- Map.fetch(dirty, "yomi"),
         {:ok, katakana} <- Map.fetch(dirty, "katakana"),
         {:ok, jishoWord} <- Map.fetch(dirty, "jishoWord"),
         {:ok, kanjiT} <- Map.fetch(dirty, "kanji") do
      {:ok,
       %NHK{
         jisho: jishoT,
         kanji: kanjiT,
         kana: kana,
         yomi: extractYomi(yomi, notDownSteps),
         jishoWord: jishoWord,
         katakana: katakana
       }}
    end
  end
end
