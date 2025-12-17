defmodule MindrianWeb.PresenceChannel do
  use Phoenix.Channel

  alias MindrianWeb.Presence

  @impl true
  def join("presence:lobby", %{"user_id" => user_id, "email" => email}, socket)
      when is_binary(user_id) and is_binary(email) do
    send(self(), {:after_join, user_id, email})
    {:ok, assign(socket, user_id: user_id, email: email)}
  end

  def join("presence:lobby", _payload, _socket) do
    {:error, %{reason: "missing user_id or email"}}
  end

  @impl true
  def handle_info({:after_join, user_id, email}, socket) do
    {:ok, _} =
      Presence.track(socket, user_id, %{
        id: user_id,
        email: email,
        online_at: System.system_time(:second)
      })

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end
end
