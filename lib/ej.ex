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
  def extractRecord(record, notDownSteps) do
    with {:ok, dirtyNHK} <- Map.fetch(record, "nhk"),
         {:ok, cleanNHK} <- extractNHK(dirtyNHK, notDownSteps) do
      {:ok, %R{nhk: cleanNHK, ojad: Map.get(record, "ojad") |> extractOJAD()}}
    end
  end

  def hello do
    with {:ok, f} <- File.read("./small.json"),
         {:ok, notDownSteps} <- File.read("./notDownSteps.txt") do
      Enum.map(Poison.decode!(f), &extractRecord(&1, String.split(notDownSteps, "\n")))
    end
  end
end
