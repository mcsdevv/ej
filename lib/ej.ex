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
    with {:ok, dirtyNHK} <- Map.fetch(record, "nhk"),
         {:ok, cleanNHK} <- extractNHK(dirtyNHK, downSteps),
         {:ok, dirtyOJAD} <- Map.fetch(record, "ojad"),
         {:ok, cleanOJAD} <- extractOJAD(dirtyOJAD) do
      {:ok, %R{nhk: cleanNHK, ojad: cleanOJAD}}
    end
  end

  def hello do
    with {:ok, f} <- File.read("./dict.json"),
         {:ok, downsteps} <- File.read("./downsteps.txt"),
         clean <- String.split(downsteps, "\n") |> Enum.map(fn x -> {x, x} end) |> Map.new() do
      Enum.map(Poison.decode!(f), &extractRecord(&1, clean))
    end
  end
end
