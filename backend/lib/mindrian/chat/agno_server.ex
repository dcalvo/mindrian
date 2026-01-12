defmodule Mindrian.Chat.AgnoServer do
  @moduledoc """
  Supervises the Agno Python agent process.

  Starts the Agno agent server using uv and uvicorn on port 8000.
  """
  use GenServer
  require Logger

  @port "8000"
  @module "mindrian_agent:app"

  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @impl true
  def init(_opts) do
    if Application.get_env(:mindrian, :start_agent_server, false) do
      {:ok, %{port: nil}, {:continue, :start_agent}}
    else
      Logger.info("AgnoServer disabled, not starting Agno agent")
      :ignore
    end
  end

  @impl true
  def handle_continue(:start_agent, state) do
    agent_dir = agent_directory()

    Logger.info("Starting Agno agent on port #{@port}")

    uv_path = System.find_executable("uv") || "/usr/local/bin/uv"

    port =
      Port.open(
        {:spawn_executable, uv_path},
        [
          :binary,
          :exit_status,
          :stderr_to_stdout,
          args: ["run", "uvicorn", @module, "--host", "0.0.0.0", "--port", @port],
          cd: agent_dir
        ]
      )

    {:noreply, %{state | port: port}}
  end

  @impl true
  def handle_info({port, {:data, data}}, %{port: port} = state) do
    # Log agent output
    data
    |> String.split("\n", trim: true)
    |> Enum.each(&Logger.info("[agno] #{&1}"))

    {:noreply, state}
  end

  @impl true
  def handle_info({port, {:exit_status, status}}, %{port: port} = state) do
    Logger.error("Agno agent exited with status #{status}")
    # Let the supervisor restart us
    {:stop, {:agno_exited, status}, state}
  end

  @impl true
  def handle_info(msg, state) do
    Logger.debug("AgnoServer received unexpected message: #{inspect(msg)}")
    {:noreply, state}
  end

  @impl true
  def terminate(_reason, %{port: port}) when is_port(port) do
    Logger.info("Stopping Agno agent")

    # Port may already be closed if we're terminating due to exit_status
    try do
      Port.close(port)
    rescue
      ArgumentError -> :ok
    end

    :ok
  end

  def terminate(_reason, _state), do: :ok

  # In development, agent dir is at ../agent relative to backend
  # In production (release), it's at /app/agno_agent
  defp agent_directory do
    Application.get_env(:mindrian, :agno_agent_directory) ||
      Path.expand("../agent", File.cwd!())
  end
end
