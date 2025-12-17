defmodule MindrianWeb.API.UserController do
  use MindrianWeb, :controller

  def me(conn, _params) do
    case conn.assigns[:current_scope] do
      %{user: user} when not is_nil(user) ->
        json(conn, %{
          id: user.id,
          email: user.email
        })

      _ ->
        conn
        |> put_status(:unauthorized)
        |> json(%{error: "Not authenticated"})
    end
  end
end
