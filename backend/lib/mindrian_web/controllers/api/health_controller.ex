defmodule MindrianWeb.API.HealthController do
  use MindrianWeb, :controller

  def index(conn, _params) do
    json(conn, %{status: "ok"})
  end
end
