defmodule MindrianWeb.Plugs.RequireLocalhost do
  @moduledoc """
  Plug that rejects requests not from localhost.
  """
  import Plug.Conn

  def init(opts), do: opts

  def call(conn, _opts) do
    case conn.remote_ip do
      {127, 0, 0, 1} -> conn
      {0, 0, 0, 0, 0, 0, 0, 1} -> conn
      _ ->
        conn
        |> put_status(:forbidden)
        |> Phoenix.Controller.json(%{error: "Forbidden"})
        |> halt()
    end
  end
end
