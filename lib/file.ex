defmodule R do
  @derive [Poison.Encoder]
  defstruct [:nhk, :ojad, :frequency, :hinshi]
end

defmodule Conjugation do
  defstruct [:hiragana, :accent, :image, :male, :female]

  def extractConjugation(dirty, hiragana) do
    with {:ok, image} <- Map.fetch(dirty, "image"),
         {:ok, male} <- Map.fetch(dirty, "male"),
         {:ok, female} <- Map.fetch(dirty, "female"),
         {:ok, html} <- Map.fetch(dirty, "html"),
         [{_, _, list}] <- Floki.find(Floki.parse_fragment!(html), ".accent_top .inner .char") do
      accent =
        case list do
          [] -> -1
          [letter] -> String.length(List.first(String.split(hiragana, letter, parts: 2)))
        end

      %Conjugation{
        image: image,
        male: male,
        female: female,
        accent: accent,
        hiragana: hiragana
        # Regex.named_captures(~r{accent_top mola_-(?<downStep>\d)}, html)
      }
    end
  end
end

defmodule OJAD do
  import Conjugation

  defstruct [:midashi, :conjugations]

  def extractOJAD(dirty) do
    dirty &&
      with {:ok, dirtyAll} <- Map.fetch(dirty, "all") do
        {:ok,
         dirtyAll
         |> Stream.map(fn [hiragana | [y | _]] ->
           extractConjugation(y, hiragana)
         end)}
      end
  end
end

defmodule Yomi do
  defstruct [:audio, :accent]

  @spec getAccent([any], [any]) :: nil | non_neg_integer
  def getAccent(images, downsteps) do
    case Enum.find_index(images, fn image -> Map.has_key?(downsteps, image) end) do
      nil -> -1
      num -> num
    end
  end

  def extractYomi(dirty, downsteps) do
    Stream.map(dirty, fn [audio, images] ->
      %Yomi{audio: audio, accent: getAccent(images, downsteps)}
    end)
  end
end

defmodule NHK do
  import Yomi
  defstruct [:jisho, :kanji, :kana, :yomi, :jishoWord, :katakana]

  def extractNHK(dirty, downsteps) do
    dirty &&
      with {:ok, jishoT} <- Map.fetch(dirty, "jisho"),
           {:ok, kana} <- Map.fetch(dirty, "kana"),
           {:ok, yomi} <- Map.fetch(dirty, "yomi"),
           #  |> IO.inspect()

           {:ok, katakana} <- Map.fetch(dirty, "katakana"),
           {:ok, jishoWord} <- Map.fetch(dirty, "jishoWord"),
           {:ok, kanjiT} <- Map.fetch(dirty, "kanji") do
        {:ok,
         %NHK{
           jisho: jishoT,
           kanji: kanjiT,
           kana: kana,
           yomi: extractYomi(yomi, downsteps),
           jishoWord: jishoWord,
           katakana: katakana
         }}
      end
  end
end
