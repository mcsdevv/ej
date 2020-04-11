defmodule EjTest do
  use ExUnit.Case
  doctest Ej

  test "greets the world" do
    assert Ej.hello() == :world
  end
end
