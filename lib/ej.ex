defmodule Ej do
  import NHK
  import OJAD

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
    with freq <- Map.get(record, "frequency"),
         hinshi <- Map.get(record, "hinshi"),
         dirtyNHK <- Map.get(record, "nhk"),
         cleanNHK <- extractNHK(dirtyNHK, downSteps),
         dirtyOJAD <- Map.get(record, "ojad"),
         cleanOJAD <- extractOJAD(dirtyOJAD) do
      %R{nhk: cleanNHK, ojad: cleanOJAD, frequency: freq, hinshi: hinshi}
    end
  end

  def hello do
    with {:ok, f} <- File.read("./dict.json"),
         {:ok, downsteps} <- File.read("./downsteps.txt"),
         decoded <- Poison.decode!(f),
         clean <-
           String.split(downsteps, "\n")
           |> Stream.map(fn x -> {x, x} end)
           |> Map.new() do
      decoded
      # |> Stream.filter(fn x -> x && Map.get(x, "nhk") end)
      |> Stream.map(fn x -> extractRecord(x, clean) end)
      |> Stream.filter(fn x -> x && x.nhk end)
      |> Stream.map(fn x ->
        {x.nhk.kanji, x.nhk.kana, Enum.map(x.nhk.yomi, fn yomi -> yomi.accent end)}
      end)
      |> Enum.group_by(fn {_, [hiragana | _], _} -> hiragana == "はし" end)
      |> Enum.to_list()

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
