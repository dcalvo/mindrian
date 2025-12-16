defmodule MindrianWeb.YDocChannel do
  @moduledoc """
  Phoenix channel for Yjs document synchronization.

  Handles the y-protocols sync messages between browser clients and the
  DocServer GenServer.
  """
  use MindrianWeb, :channel
  require Logger
  alias Mindrian.Collaboration.DocServer

  @impl true
  def join("y_doc:" <> doc_name, _payload, socket) do
    topic = "y_doc:#{doc_name}"

    case start_or_get_doc_server(doc_name, topic) do
      {:ok, pid} ->
        Process.monitor(pid)
        {:ok, assign(socket, doc_name: doc_name, doc_pid: pid)}

      {:error, reason} ->
        {:error, %{reason: reason}}
    end
  end

  @impl true
  def handle_in("yjs_sync", {:binary, data}, socket) do
    handle_yjs_message(data, socket)
  end

  def handle_in("yjs", {:binary, data}, socket) do
    handle_yjs_message(data, socket)
  end

  defp handle_yjs_message(data, socket) do
    server = socket.assigns.doc_pid

    case DocServer.process_message_v1(server, data, self()) do
      {:ok, replies} when is_list(replies) ->
        Enum.each(replies, fn reply ->
          send(self(), {:yjs, reply, server})
        end)

      :ok ->
        # Some messages (like awareness) may return just :ok
        :ok

      {:error, reason} ->
        Logger.warning("Error processing yjs message: #{inspect(reason)}")
    end

    {:noreply, socket}
  end

  @impl true
  def handle_info({:yjs, message, _proc}, socket) do
    push(socket, "yjs", {:binary, message})
    {:noreply, socket}
  end

  def handle_info({:DOWN, _ref, :process, _pid, reason}, socket) do
    Logger.warning("DocServer process down: #{inspect(reason)}")
    {:stop, {:error, "doc server crashed"}, socket}
  end

  @impl true
  def terminate(_reason, socket) do
    # Notify DocServer to remove this client's awareness state
    if pid = socket.assigns[:doc_pid] do
      DocServer.client_disconnected(pid, self())
    end

    :ok
  end

  defp start_or_get_doc_server(doc_name, topic) do
    case Registry.lookup(Mindrian.DocServerRegistry, doc_name) do
      [{pid, _}] ->
        {:ok, pid}

      [] ->
        DocServer.start([topic: topic, doc_name: doc_name],
          name: {:via, Registry, {Mindrian.DocServerRegistry, doc_name}}
        )
    end
    |> case do
      {:ok, pid} ->
        {:ok, pid}

      {:error, {:already_started, pid}} ->
        {:ok, pid}

      {:error, reason} ->
        Logger.error("Failed to start DocServer for #{doc_name}: #{inspect(reason)}")
        {:error, "failed to start doc server"}
    end
  end
end
