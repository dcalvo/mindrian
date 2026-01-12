defmodule MindrianWeb.API.WorkspaceJSON do
  alias Mindrian.Documents.Workspace

  @doc """
  Renders a list of workspaces.
  """
  def index(%{workspaces: workspaces}) do
    %{data: for(workspace <- workspaces, do: data(workspace))}
  end

  @doc """
  Renders a single workspace.
  """
  def show(%{workspace: workspace}) do
    %{data: data(workspace)}
  end

  def error(%{changeset: changeset}) do
    # Simple error rendering, usually you'd use a dedicated ErrorJSON helper
    # Assuming MindrianWeb.ChangesetJSON or similar exists, or simple manual traversal
    errors =
      Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
        Regex.replace(~r"%{(\w+)}", msg, fn _, key ->
          opts |> Keyword.get(String.to_existing_atom(key), key) |> to_string()
        end)
      end)

    %{errors: errors}
  end

  defp data(%Workspace{} = workspace) do
    %{
      id: workspace.id,
      title: workspace.title,
      icon: workspace.icon,
      bg_color: workspace.bg_color,
      icon_color: workspace.icon_color,
      owner_id: workspace.owner_id,
      inserted_at: workspace.inserted_at,
      updated_at: workspace.updated_at
    }
  end
end
