defmodule MindrianWeb.UserSocket do
  use Phoenix.Socket

  alias Mindrian.Accounts

  channel "ping:*", MindrianWeb.PingChannel
  channel "y_doc:*", MindrianWeb.YDocChannel
  channel "documents:*", MindrianWeb.DocumentsChannel

  @impl true
  def connect(_params, socket, connect_info) do
    session = connect_info[:session] || %{}
    # Session keys can be atoms or strings depending on how they're accessed
    token = session["user_token"] || session[:user_token]

    case token && Accounts.get_user_by_session_token(token) do
      {user, _token_inserted_at} ->
        {:ok, assign(socket, :user_id, user.id)}

      _ ->
        {:ok, socket}
    end
  end

  @impl true
  def id(socket) do
    if socket.assigns[:user_id] do
      "user_socket:#{socket.assigns.user_id}"
    end
  end
end
