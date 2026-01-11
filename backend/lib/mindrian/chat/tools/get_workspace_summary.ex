defmodule Mindrian.Chat.Tools.GetWorkspaceSummary do
  @moduledoc """
  Tool for getting a summary of the current workspace.
  """
  use Mindrian.Chat.Tool

  alias Mindrian.Documents

  @impl true
  def name, do: "get_workspace_summary"

  @impl true
  def description do
    "Get a summary of the current workspace including document count, folder count, and recent activity."
  end

  @impl true
  def input_schema do
    %{
      type: "object",
      properties: %{},
      required: []
    }
  end

  @impl true
  def execute(input, scope) do
    workspace_id = input["workspace_id"]

    case Documents.get_workspace_summary(scope, workspace_id) do
      nil ->
        {:error, "Workspace not found"}

      summary ->
        {:ok, summary}
    end
  end

  @impl true
  def describe_action(_input) do
    "Get workspace summary"
  end
end
