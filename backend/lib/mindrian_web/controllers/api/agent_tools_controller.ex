defmodule MindrianWeb.API.AgentToolsController do
  @moduledoc """
  Controller for agent tool endpoints.

  These endpoints are called by the Agno Python microservice when executing tools.
  Trusts user_id from request body - these routes are internal network only.
  """
  use MindrianWeb, :controller

  alias Mindrian.Accounts
  alias Mindrian.Accounts.Scope

  alias Mindrian.Chat.Tools.{
    ListDocuments,
    CreateDocument,
    ReadDocument,
    EditDocument,
    DeleteDocument
  }

  plug :load_user_from_body

  defp load_user_from_body(conn, _opts) do
    with %{"user_id" => user_id} when is_binary(user_id) <- conn.body_params,
         user when not is_nil(user) <- Accounts.get_user(user_id) do
      workspace_id = conn.body_params["workspace_id"]

      conn
      |> assign(:current_scope, %Scope{user: user})
      |> assign(:workspace_id, workspace_id)
    else
      _ ->
        conn
        |> put_status(:bad_request)
        |> json(%{success: false, error: "Invalid user_id"})
        |> halt()
    end
  end

  def list_documents(conn, params) do
    params = Map.put(params, "workspace_id", conn.assigns.workspace_id)
    {:ok, result} = ListDocuments.execute(params, conn.assigns.current_scope)
    json(conn, %{success: true, result: result})
  end

  def create_document(conn, params) do
    params = Map.put(params, "workspace_id", conn.assigns.workspace_id)

    case CreateDocument.execute(params, conn.assigns.current_scope) do
      {:ok, result} ->
        json(conn, %{success: true, result: result})

      {:error, reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{success: false, error: reason})
    end
  end

  def read_document(conn, params) do
    params = Map.put(params, "workspace_id", conn.assigns.workspace_id)

    case ReadDocument.execute(params, conn.assigns.current_scope) do
      {:ok, result} ->
        json(conn, %{success: true, result: result})

      {:error, reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{success: false, error: reason})
    end
  end

  def edit_document(conn, params) do
    params = Map.put(params, "workspace_id", conn.assigns.workspace_id)

    case EditDocument.execute(params, conn.assigns.current_scope) do
      {:ok, result} ->
        json(conn, %{success: true, result: result})

      {:error, reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{success: false, error: reason})
    end
  end

  def delete_document(conn, params) do
    params = Map.put(params, "workspace_id", conn.assigns.workspace_id)

    case DeleteDocument.execute(params, conn.assigns.current_scope) do
      {:ok, result} ->
        json(conn, %{success: true, result: result})

      {:error, reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{success: false, error: reason})
    end
  end
end
