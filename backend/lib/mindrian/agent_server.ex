defmodule Mindrian.AgentServer do
  @moduledoc """
  Supervises the Python agent process.

  Starts the Agno-based agent server using uv and uvicorn.
  The agent runs on port 8000 by default.
  """
  use GenServer
  require Logger

  @default_port "8000"

  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @impl true
  def init(_opts) do
    # Only start if enabled in config
    if Application.get_env(:mindrian, :start_agent_server, false) do
      {:ok, %{port: nil}, {:continue, :start_agent}}
    else
      Logger.info("AgentServer disabled, not starting Python agent")
      :ignore
    end
  end

  @impl true
  def handle_continue(:start_agent, state) do
    agent_dir = agent_directory()
    port_number = System.get_env("AGENT_PORT", @default_port)

    Logger.info("Starting Python agent on port #{port_number}")

    uv_path = System.find_executable("uv") || "/usr/local/bin/uv"

    # Don't specify env - let the subprocess inherit all environment variables
    # including ANTHROPIC_API_KEY from Fly secrets
    port =
      Port.open(
        {:spawn_executable, uv_path},
        [
          :binary,
          :exit_status,
          :stderr_to_stdout,
          args: [
            "run",
            "uvicorn",
            "mindrian_agent:app",
            "--host",
            "0.0.0.0",
            "--port",
            port_number
          ],
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
    |> Enum.each(&Logger.info("[agent] #{&1}"))

    {:noreply, state}
  end

  @impl true
  def handle_info({port, {:exit_status, status}}, %{port: port} = state) do
    Logger.error("Python agent exited with status #{status}")
    # Let the supervisor restart us
    {:stop, {:agent_exited, status}, state}
  end

  @impl true
  def handle_info(msg, state) do
    Logger.debug("AgentServer received unexpected message: #{inspect(msg)}")
    {:noreply, state}
  end

  @impl true
  def terminate(_reason, %{port: port}) when is_port(port) do
    Logger.info("Stopping Python agent")

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
  # In production (release), it should be configured or at a known path
  defp agent_directory do
    Application.get_env(:mindrian, :agent_directory) ||
      Path.expand("../agent", File.cwd!())
  end
end
