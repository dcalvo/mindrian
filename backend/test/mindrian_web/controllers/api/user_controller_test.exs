defmodule MindrianWeb.API.UserControllerTest do
  use MindrianWeb.ConnCase

  import Mindrian.AccountsFixtures

  describe "GET /api/me" do
    test "returns 401 when not authenticated", %{conn: conn} do
      conn = get(conn, ~p"/api/me")
      assert json_response(conn, 401) == %{"error" => "Not authenticated"}
    end

    test "returns user data when authenticated", %{conn: conn} do
      user = user_fixture()
      conn = log_in_user(conn, user)
      conn = get(conn, ~p"/api/me")

      response = json_response(conn, 200)
      assert response["id"] == user.id
      assert response["email"] == user.email
      assert is_binary(response["socket_token"])
    end
  end
end
