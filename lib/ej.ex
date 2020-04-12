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
    with {:ok, freq} <- Map.fetch(record, "frequency"),
         {:ok, hinshi} <- Map.fetch(record, "hinshi"),
         {:ok, dirtyNHK} <- Map.fetch(record, "nhk"),
         {:ok, cleanNHK} <- extractNHK(dirtyNHK, downSteps),
         {:ok, dirtyOJAD} <- Map.fetch(record, "ojad"),
         {:ok, cleanOJAD} <- extractOJAD(dirtyOJAD) do
      {:ok, %R{nhk: cleanNHK, ojad: cleanOJAD, frequency: freq, hinshi: hinshi}}
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
      # |> Stream.map(&extractRecord(&1, clean))

      // TODO: Check which records are getting turned into null..

      |> Stream.filter(fn x -> !x end)
      |> Enum.to_list()
      |> length()

      # |> Stream.filter(fn x -> x && x.frequency end)
      # |> Stream.map(fn x -> {x.frequency, x.hinshi} end)
      # |> Enum.each(fn x -> IO.inspect(x) end)
    end
  end
end
