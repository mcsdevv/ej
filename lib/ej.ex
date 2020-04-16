defmodule Ej do
  import NHK
  import OJAD
  import DBRow

  @moduledoc """
  Documentation for `Ej`.
  """

  @doc """
  Hello world.

  ## Examples

      iex> Ej.hello()
      :world

  """
  def extractRecord(record, downSteps) do
    freq = Map.get(record, "frequency")
    hinshi = Map.get(record, "hinshi")
    dirtyNHK = Map.get(record, "nhk")
    cleanNHK = dirtyNHK && extractNHK(dirtyNHK, downSteps)
    dirtyOJAD = Map.get(record, "ojad")
    cleanOJAD = dirtyOJAD && extractOJAD(dirtyOJAD)
    %R{nhk: cleanNHK, ojad: cleanOJAD, frequency: freq, hinshi: hinshi}
  end

  def hello do
    with {:ok, f} <- File.read("./dict.json"),
         {:ok, downsteps} <- File.read("./downsteps.txt"),
         decoded <- Poison.decode!(f),
         clean =
           String.split(downsteps, "\n")
           |> Stream.map(fn x -> {x, x} end)
           |> Map.new() do
      decoded
      # |> Stream.filter(fn x -> x && Map.get(x, "nhk") end)
      |> Enum.map(fn x -> extractRecord(x, clean) end)
      |> Enum.filter(fn x -> x && (x.nhk || x.ojad) end)

      # |> Enum.map(fn x ->
      #   case x do
      #     %R{nhk: nil, ojad: %OJAD{conjugations: [head | _]}} ->
      #       %DBRow{hiragana: head.hiragana, kanji: head.hiragana, downstep: [head.accent]}

      #     %R{nhk: %NHK{kana: kana, kanji: kanji, yomi: yomi}} ->
      #       %DBRow{hiragana: kana, kanji: kanji, downstep: yomi}
      #   end
      # end)

      #   {x.nhk.kanji, x.nhk.kana, Enum.map(x.nhk.yomi, fn yomi -> yomi.accent end)}
      # end)
      # |> Enum.group_by(fn {_, [hiragana | _], _} -> hiragana == "はし" end)
      # |> Enum.to_list()

      # |> length()

      # |> Stream.filter_map(fn x -> !x end)
      # |> Enum.to_list()
      # |> List.first()

      # |> Enum.to_list()
      # |> length()

      # |> Stream.filter(fn x -> x && x.frequency end)
      # |> Stream.map(fn x -> {x.frequency, x.hinshi} end)
      # |> Enum.each(fn x -> IO.inspect(x) end)
    end
  end
end
