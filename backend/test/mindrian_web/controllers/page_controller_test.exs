defmodule MindrianWeb.PageControllerTest do
  use MindrianWeb.ConnCase

  test "GET / serves SPA", %{conn: conn} do
    conn = get(conn, ~p"/")
    # Should serve the React SPA
    assert html_response(conn, 200) =~ "mindrian-frontend"
    assert html_response(conn, 200) =~ "<div id=\"root\"></div>"
  end
end
