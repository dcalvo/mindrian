defmodule Mindrian.Agent.Tools do
  @moduledoc """
  Registry for AI agent tools.

  This module provides the registry of available tools and dispatches
  execution and description requests to the appropriate tool modules.
  """
  require Logger

  alias Mindrian.Accounts.Scope

  # Compile-time list of available tools
  @tools [
    Mindrian.Agent.Tools.CreateDocument,
    Mindrian.Agent.Tools.DeleteDocument,
    Mindrian.Agent.Tools.ReadDocument,
    Mindrian.Agent.Tools.EditDocument
  ]

  @doc """
  Returns all available tool definitions in Anthropic's format.
  """
  def definitions do
    Enum.map(@tools, & &1.definition())
  end

  @doc """
  Executes a tool with the given input, scoped to the user.

  Returns {:ok, result} or {:error, reason}.
  """
  def execute(tool_name, input, %Scope{} = scope) do
    Logger.info("Executing tool #{tool_name} with input: #{inspect(input)}")

    case find_tool(tool_name) do
      nil -> {:error, "Unknown tool: #{tool_name}"}
      tool -> tool.execute(input, scope)
    end
  end

  @doc """
  Returns a human-readable description of the tool action for the approval UI.
  """
  def describe_action(tool_name, input) do
    case find_tool(tool_name) do
      nil -> "Execute #{tool_name}"
      tool -> tool.describe_action(input)
    end
  end

  @doc """
  Returns the list of registered tool modules.
  """
  def registered_tools, do: @tools

  # Finds a tool module by name
  defp find_tool(name) do
    Enum.find(@tools, fn tool -> tool.name() == name end)
  end
end
