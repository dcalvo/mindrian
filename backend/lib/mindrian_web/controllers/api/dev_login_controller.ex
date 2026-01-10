defmodule MindrianWeb.API.DevLoginController do
  @moduledoc """
  Dev-only JSON API for logging in without CSRF.
  Used by CLI tools like chat-cli for testing.

  Only available when :dev_routes is enabled (dev/test environments).
  """
  use MindrianWeb, :controller

  alias Mindrian.Accounts
  alias MindrianWeb.UserAuth

  def create(conn, %{"email" => email, "password" => password}) do
    case Accounts.get_user_by_email_and_password(email, password) do
      nil ->
        conn
        |> put_status(:unauthorized)
        |> json(%{error: "Invalid email or password"})

      user ->
        conn
        |> UserAuth.log_in_user_api(user)
    end
  end

  def create(conn, _params) do
    conn
    |> put_status(:bad_request)
    |> json(%{error: "Missing email or password"})
  end
end
