defmodule Mindrian.Chat.SSEParser do
  @moduledoc """
  Parser for Server-Sent Events (SSE) streams.

  Handles chunked SSE data and extracts structured events.

  ## Usage

      {events, new_buffer} = SSEParser.parse(chunk, buffer)

  Events are returned as maps with an "event" key for the event type
  and additional keys from the JSON data payload.
  """

  @doc """
  Parse an SSE chunk with a buffer from previous incomplete data.

  Returns `{events, new_buffer}` where:
  - `events` is a list of parsed event maps
  - `new_buffer` is any incomplete data to carry forward

  ## Examples

      iex> SSEParser.parse("event: RunStarted\\ndata: {\\"run_id\\": \\"123\\"}\\n\\n", "")
      {[%{"event" => "RunStarted", "run_id" => "123"}], ""}

      iex> SSEParser.parse("event: Partial", "")
      {[], "event: Partial"}
  """
  @spec parse(binary(), binary()) :: {[map()], binary()}
  def parse(chunk, buffer) do
    data = buffer <> chunk

    # Split on double newlines (event boundaries)
    parts = String.split(data, ~r/\n\n/)

    case parts do
      [single] ->
        # No complete events yet
        {[], single}

      parts ->
        # Last part is incomplete (or empty if chunk ended with \n\n)
        {complete, [last]} = Enum.split(parts, -1)

        events =
          complete
          |> Enum.reject(&(&1 == ""))
          |> Enum.map(&parse_event/1)
          |> Enum.reject(&is_nil/1)

        {events, last}
    end
  end

  @doc """
  Parse a single SSE event text block into a map.

  Returns `nil` if the event cannot be parsed.

  ## Event Format

  SSE events have this format:
      event: EventName
      data: {"json": "payload"}

  Multiple data lines are concatenated before JSON parsing.
  """
  @spec parse_event(binary()) :: map() | nil
  def parse_event(event_text) do
    lines = String.split(event_text, "\n")

    {event_name, data_lines} =
      Enum.reduce(lines, {nil, []}, fn line, {event, data} ->
        cond do
          String.starts_with?(line, "event:") ->
            name = line |> String.trim_leading("event:") |> String.trim()
            {name, data}

          String.starts_with?(line, "data:") ->
            json = line |> String.trim_leading("data:") |> String.trim()
            {event, [json | data]}

          true ->
            {event, data}
        end
      end)

    case Enum.reverse(data_lines) do
      [] ->
        # Event with no data payload
        if event_name, do: %{"event" => event_name}, else: nil

      data_lines ->
        json_str = Enum.join(data_lines, "")

        case Jason.decode(json_str) do
          {:ok, parsed} ->
            if event_name, do: Map.put(parsed, "event", event_name), else: parsed

          {:error, _} ->
            nil
        end
    end
  end
end
