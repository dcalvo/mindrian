defmodule MindrianWeb.SPAController do
  use MindrianWeb, :controller

  def index(conn, _params) do
    conn
    |> put_resp_content_type("text/html")
    |> send_file(200, Application.app_dir(:mindrian, "priv/static/spa/index.html"))
  end
end
