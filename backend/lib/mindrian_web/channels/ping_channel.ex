defmodule MindrianWeb.PingChannel do
  use Phoenix.Channel

  @impl true
  def join("ping:lobby", _payload, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_in("ping", _payload, socket) do
    {:reply, {:ok, %{message: "pong"}}, socket}
  end
end
