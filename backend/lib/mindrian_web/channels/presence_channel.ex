defmodule MindrianWeb.PresenceChannel do
  use MindrianWeb, :channel

  alias Mindrian.Accounts
  alias MindrianWeb.Presence

  @impl true
  def join("presence:lobby", _payload, socket) do
    send(self(), :after_join)
    {:ok, socket}
  end

  @impl true
  def handle_info(:after_join, socket) do
    user_id = socket.assigns.user_id
    user = Accounts.get_user!(user_id)

    {:ok, _} =
      Presence.track(socket, to_string(user_id), %{
        id: user_id,
        email: user.email,
        online_at: System.system_time(:second)
      })

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end
end
