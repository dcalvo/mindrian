defmodule MindrianWeb.PageController do
  use MindrianWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end
