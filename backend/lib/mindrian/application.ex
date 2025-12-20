defmodule Mindrian.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      MindrianWeb.Telemetry,
      Mindrian.Repo,
      {DNSCluster, query: Application.get_env(:mindrian, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Mindrian.PubSub},
      MindrianWeb.Presence,
      # Registry for DocServer processes (one per document)
      {Registry, keys: :unique, name: Mindrian.DocServerRegistry},
      # Registry for ConversationServer processes (one per conversation)
      {Registry, keys: :unique, name: Mindrian.ConversationServerRegistry},
      # Task supervisor for ConversationServer driver tasks
      {Task.Supervisor, name: Mindrian.DriverTaskSupervisor},
      # Python agent server (controlled by :start_agent_server config)
      Mindrian.AgentServer,
      # Start to serve requests, typically the last entry
      MindrianWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Mindrian.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    MindrianWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
