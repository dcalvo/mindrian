defmodule MindrianWeb.Plugs.RequireLocalhost do
  @moduledoc """
  Plug that rejects requests not from localhost or private networks.

  Allows localhost (127.0.0.1, ::1) and private network IPs (10.x, 172.16-31.x, 192.168.x)
  for internal service-to-service communication (e.g., agent -> Phoenix).
  """
  import Plug.Conn
  import Bitwise

  def init(opts), do: opts

  def call(conn, _opts) do
    if local_or_private?(conn.remote_ip) do
      conn
    else
      conn
      |> put_status(:forbidden)
      |> Phoenix.Controller.json(%{error: "Forbidden"})
      |> halt()
    end
  end

  # IPv4 localhost
  defp local_or_private?({127, _, _, _}), do: true
  # IPv6 localhost
  defp local_or_private?({0, 0, 0, 0, 0, 0, 0, 1}), do: true
  # 10.0.0.0/8 private network
  defp local_or_private?({10, _, _, _}), do: true
  # 172.16.0.0/12 private network
  defp local_or_private?({172, second, _, _}) when second >= 16 and second <= 31, do: true
  # 192.168.0.0/16 private network
  defp local_or_private?({192, 168, _, _}), do: true
  # IPv4-mapped IPv6 addresses
  defp local_or_private?({0, 0, 0, 0, 0, 65535, high, _low}) do
    # Extract IPv4 from mapped address and check recursively
    a = high >>> 8
    b = high &&& 0xFF
    local_or_private?({a, b, 0, 0})
  end

  defp local_or_private?(_), do: false
end
