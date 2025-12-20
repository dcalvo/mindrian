defmodule Mindrian.Chat.Tool do
  @moduledoc """
  Behaviour for AI agent tools.

  Tools allow the agent to interact with the user's environment.
  Each tool implementation provides:
  - A unique name
  - A description for the AI
  - An input schema in Anthropic's JSON Schema format
  - An execution function
  - A human-readable description for the approval UI

  ## Example

      defmodule MyApp.Chat.Tools.CreateDocument do
        use Mindrian.Chat.Tool

        @impl true
        def name, do: "create_document"

        @impl true
        def description, do: "Create a new document in the user's workspace."

        @impl true
        def input_schema do
          %{
            type: "object",
            properties: %{
              title: %{type: "string", description: "The document title"}
            },
            required: ["title"]
          }
        end

        @impl true
        def execute(%{"title" => title}, scope) do
          case Documents.create_document(scope, %{title: title}) do
            {:ok, doc} -> {:ok, %{document_id: doc.id}}
            {:error, _} -> {:error, "Failed to create document"}
          end
        end

        @impl true
        def describe_action(%{"title" => title}) do
          "Create document titled \"" <> title <> "\""
        end
      end
  """

  alias Mindrian.Accounts.Scope

  @doc "Returns the unique name of the tool."
  @callback name() :: String.t()

  @doc "Returns a description of what the tool does (for the AI)."
  @callback description() :: String.t()

  @doc "Returns the JSON Schema for the tool's input parameters."
  @callback input_schema() :: map()

  @doc "Executes the tool with the given input and user scope."
  @callback execute(input :: map(), scope :: Scope.t()) :: {:ok, any()} | {:error, String.t()}

  @doc "Returns a human-readable description for the approval UI."
  @callback describe_action(input :: map()) :: String.t()

  @doc """
  Builds the Anthropic API tool definition from the behaviour callbacks.
  """
  defmacro __using__(_opts) do
    quote do
      @behaviour Mindrian.Chat.Tool

      @doc """
      Returns the tool definition in Anthropic API format.
      """
      def definition do
        %{
          name: name(),
          description: description(),
          input_schema: input_schema()
        }
      end

      defoverridable []
    end
  end
end
