defmodule MindrianWeb.API.UserController do
  use MindrianWeb, :controller

  # Token valid for 2 weeks (same as session token)
  @max_age 86400 * 14

  def me(conn, _params) do
    case conn.assigns[:current_scope] do
      %{user: user} when not is_nil(user) ->
        socket_token =
          Phoenix.Token.sign(MindrianWeb.Endpoint, "user socket", user.id, max_age: @max_age)

        json(conn, %{
          id: user.id,
          email: user.email,
          socket_token: socket_token
        })

      _ ->
        conn
        |> put_status(:unauthorized)
        |> json(%{error: "Not authenticated"})
    end
  end
end
