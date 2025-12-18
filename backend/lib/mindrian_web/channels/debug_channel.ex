defmodule MindrianWeb.DebugChannel do
  @moduledoc """
  Channel for receiving agent debug events in development.

  Only available in non-production environments.
  """
  use MindrianWeb, :channel

  alias Mindrian.Agent.Debug

  @impl true
  def join("debug:agent", _payload, socket) do
    if Mix.env() == :prod do
      {:error, %{reason: "not available in production"}}
    else
      Phoenix.PubSub.subscribe(Mindrian.PubSub, Debug.topic())
      {:ok, socket}
    end
  end

  @impl true
  def handle_info({:agent_debug, payload}, socket) do
    push(socket, "debug_event", payload)
    {:noreply, socket}
  end
end
