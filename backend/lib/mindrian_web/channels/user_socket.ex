defmodule MindrianWeb.UserSocket do
  use Phoenix.Socket

  channel "ping:*", MindrianWeb.PingChannel
  channel "y_doc:*", MindrianWeb.YDocChannel

  @impl true
  def connect(_params, socket, _connect_info) do
    {:ok, socket}
  end

  @impl true
  def id(_socket), do: nil
end
