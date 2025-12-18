defmodule Mindrian.Agent.SSEParser do
  @moduledoc """
  Parse Server-Sent Events (SSE) text chunks into structured Agno events.

  SSE format:
      event: EventName
      data: {"json": "payload"}

      event: AnotherEvent
      data: {"more": "data"}

  Events are separated by blank lines. This parser handles incomplete chunks
  by maintaining a buffer of unparsed data.
  """

  @doc """
  Parse SSE data, returning parsed events and remaining buffer.

  ## Examples

      iex> SSEParser.parse("event: RunStarted\\ndata: {\\"run_id\\": \\"123\\"}\\n\\n")
      {[%{"event" => "RunStarted", "run_id" => "123"}], ""}

      iex> SSEParser.parse("event: Partial")
      {[], "event: Partial"}

  """
  @spec parse(binary(), binary()) :: {[map()], binary()}
  def parse(chunk, buffer \\ "") do
    data = buffer <> chunk

    # Split on double newlines (event boundaries)
    # Keep partial data in buffer
    {events_raw, remaining} = split_events(data)

    events =
      events_raw
      |> Enum.map(&parse_event/1)
      |> Enum.reject(&is_nil/1)

    {events, remaining}
  end

  # Split data into complete events and remaining partial data
  defp split_events(data) do
    # Events are separated by blank lines (\n\n)
    parts = String.split(data, ~r/\n\n/)

    case parts do
      # Single part with no separator - all goes to buffer
      [single] ->
        {[], single}

      # Multiple parts - last might be incomplete
      parts ->
        {complete, [last]} = Enum.split(parts, -1)
        # Filter out empty strings from complete events
        complete = Enum.reject(complete, &(&1 == ""))
        {complete, last}
    end
  end

  # Parse a single SSE event block into a map
  defp parse_event(event_text) do
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

          # Ignore comments (lines starting with :) and empty lines
          true ->
            {event, data}
        end
      end)

    # Combine data lines and parse JSON
    case Enum.reverse(data_lines) do
      [] ->
        # No data, just event name
        if event_name, do: %{"event" => event_name}, else: nil

      data_lines ->
        json_str = Enum.join(data_lines, "")

        case Jason.decode(json_str) do
          {:ok, parsed} ->
            # Merge event name into parsed data
            if event_name do
              Map.put(parsed, "event", event_name)
            else
              parsed
            end

          {:error, _} ->
            # Invalid JSON - skip this event
            nil
        end
    end
  end
end
