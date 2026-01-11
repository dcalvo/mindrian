defmodule MindrianWeb.API.WorkspaceController do
  use MindrianWeb, :controller

  alias Mindrian.Documents
  alias Mindrian.Documents.Workspace

  def index(conn, _params) do
    scope = conn.assigns.current_scope
    workspaces = Documents.list_workspaces(scope)
    render(conn, :index, workspaces: workspaces)
  end

  def create(conn, %{"workspace" => workspace_params}) do
    scope = conn.assigns.current_scope

    case Documents.create_workspace(scope, workspace_params) do
      {:ok, %Workspace{} = workspace} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", ~p"/api/workspaces/#{workspace}")
        |> render(:show, workspace: workspace)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    scope = conn.assigns.current_scope

    if workspace = Documents.get_workspace(scope, id) do
      render(conn, :show, workspace: workspace)
    else
      conn
      |> put_status(:not_found)
      |> json(%{error: "Workspace not found"})
    end
  end

  def update(conn, %{"id" => id, "workspace" => workspace_params}) do
    scope = conn.assigns.current_scope

    if workspace = Documents.get_workspace(scope, id) do
      case Documents.update_workspace(workspace, workspace_params) do
        {:ok, %Workspace{} = workspace} ->
          render(conn, :show, workspace: workspace)

        {:error, changeset} ->
          conn
          |> put_status(:unprocessable_entity)
          |> render(:error, changeset: changeset)
      end
    else
      conn
      |> put_status(:not_found)
      |> json(%{error: "Workspace not found"})
    end
  end

  def delete(conn, %{"id" => id}) do
    scope = conn.assigns.current_scope

    if workspace = Documents.get_workspace(scope, id) do
      case Documents.delete_workspace(workspace) do
        {:ok, _} ->
          send_resp(conn, :no_content, "")

        {:error, _} ->
          conn
          |> put_status(:internal_server_error)
          |> json(%{error: "Failed to delete workspace"})
      end
    else
      conn
      |> put_status(:not_found)
      |> json(%{error: "Workspace not found"})
    end
  end
end
