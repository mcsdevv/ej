defmodule DBRow do
  defstruct [:hiragana, :kanji, :downstep]
end

defmodule R do
  @derive [Poison.Encoder]
  defstruct [:nhk, :ojad, :frequency, :hinshi]
end

defmodule Conjugation do
  defstruct [:hiragana, :accent, :image, :male, :female]

  def extractConjugation(dirty, hiragana) do
    with [{_, _, list}] <-
           Floki.find(Floki.parse_fragment!(Map.get(dirty, "html")), ".accent_top .inner .char") do
      accent =
        case list do
          [] -> -1
          [letter] -> String.length(List.first(String.split(hiragana, letter, parts: 2)))
        end

      %Conjugation{
        image: Map.get(dirty, "image"),
        male: Map.get(dirty, "male"),
        female: Map.get(dirty, "female"),
        accent: accent,
        hiragana: hiragana
      }
    else
      _ -> nil
    end
  end
end

defmodule OJAD do
  import Conjugation

  defstruct [:midashi, :conjugations]

  def extractOJAD(dirty) do
    conj =
      Map.get(dirty, "all")
      |> Enum.map(fn [hiragana | [y | _]] -> extractConjugation(y, hiragana) end)
      |> Enum.filter(fn x -> x && true end)

    case conj do
      [] ->
        nil

      _ ->
        %OJAD{
          conjugations: conj,
          midashi: Map.get(dirty, "midashi")
        }
    end
  end
end

defmodule Yomi do
  defstruct [:audio, :accent]

  def getAccent(images, downsteps) do
    case Enum.find_index(images, fn image -> Map.has_key?(downsteps, image) end) do
      nil -> -1
      num -> num
    end
  end

  def extractYomi(dirty, downsteps) do
    Enum.map(dirty, fn [audio, images] ->
      %Yomi{audio: audio, accent: getAccent(images, downsteps)}
    end)
  end
end

defmodule NHK do
  import Yomi
  defstruct [:jisho, :kanji, :kana, :yomi, :jishoWord, :katakana]

  def extractNHK(dirty, downsteps) do
    %NHK{
      jisho: Map.get(dirty, "jisho"),
      kanji: Map.get(dirty, "kanji"),
      kana: Map.get(dirty, "kana"),
      yomi: extractYomi(Map.get(dirty, "yomi"), downsteps),
      jishoWord: Map.get(dirty, "jishoWord"),
      katakana: Map.get(dirty, "katakana")
    }
  end
end
