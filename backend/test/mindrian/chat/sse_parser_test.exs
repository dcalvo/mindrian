defmodule Mindrian.Chat.SSEParserTest do
  use ExUnit.Case, async: true

  alias Mindrian.Chat.SSEParser

  describe "parse/2" do
    test "parses complete single event" do
      chunk = "event: RunStarted\ndata: {\"run_id\": \"123\"}\n\n"

      {events, buffer} = SSEParser.parse(chunk, "")

      assert buffer == ""
      assert events == [%{"event" => "RunStarted", "run_id" => "123"}]
    end

    test "parses multiple complete events" do
      chunk = """
      event: RunStarted
      data: {"run_id": "123"}

      event: RunContent
      data: {"content": "Hello"}

      """

      {events, buffer} = SSEParser.parse(chunk, "")

      assert buffer == ""
      assert length(events) == 2
      assert Enum.at(events, 0) == %{"event" => "RunStarted", "run_id" => "123"}
      assert Enum.at(events, 1) == %{"event" => "RunContent", "content" => "Hello"}
    end

    test "buffers incomplete event" do
      chunk = "event: RunStarted\ndata: {\"run_id\":"

      {events, buffer} = SSEParser.parse(chunk, "")

      assert events == []
      assert buffer == "event: RunStarted\ndata: {\"run_id\":"
    end

    test "combines buffer with new chunk" do
      buffer = "event: RunStarted\ndata: {\"run_id\":"
      chunk = " \"123\"}\n\n"

      {events, new_buffer} = SSEParser.parse(chunk, buffer)

      assert new_buffer == ""
      assert events == [%{"event" => "RunStarted", "run_id" => "123"}]
    end

    test "handles partial event at end" do
      chunk = """
      event: RunStarted
      data: {"run_id": "123"}

      event: RunContent
      data: {"content"
      """

      {events, buffer} = SSEParser.parse(chunk, "")

      assert length(events) == 1
      assert Enum.at(events, 0) == %{"event" => "RunStarted", "run_id" => "123"}
      assert buffer =~ "RunContent"
    end

    test "handles empty chunk with buffer" do
      buffer = "event: Test\ndata: {}\n\n"

      {events, new_buffer} = SSEParser.parse("", buffer)

      assert events == [%{"event" => "Test"}]
      assert new_buffer == ""
    end
  end

  describe "parse_event/1" do
    test "parses event with name and data" do
      event_text = "event: RunStarted\ndata: {\"run_id\": \"abc-123\"}"

      result = SSEParser.parse_event(event_text)

      assert result == %{"event" => "RunStarted", "run_id" => "abc-123"}
    end

    test "parses event with name only" do
      event_text = "event: Heartbeat"

      result = SSEParser.parse_event(event_text)

      assert result == %{"event" => "Heartbeat"}
    end

    test "parses event with multiple data lines" do
      event_text = "event: LargePayload\ndata: {\"key\":\ndata: \"value\"}"

      result = SSEParser.parse_event(event_text)

      assert result == %{"event" => "LargePayload", "key" => "value"}
    end

    test "returns nil for event with invalid JSON" do
      event_text = "event: BadData\ndata: not-valid-json"

      result = SSEParser.parse_event(event_text)

      assert result == nil
    end

    test "returns nil for empty event" do
      result = SSEParser.parse_event("")
      assert result == nil
    end

    test "handles nested JSON data" do
      event_text =
        "event: ToolCall\ndata: {\"tool\": {\"name\": \"read\", \"args\": {\"path\": \"/tmp\"}}}"

      result = SSEParser.parse_event(event_text)

      assert result == %{
               "event" => "ToolCall",
               "tool" => %{
                 "name" => "read",
                 "args" => %{"path" => "/tmp"}
               }
             }
    end

    test "ignores unknown line prefixes" do
      event_text = "event: Test\nid: 123\nretry: 5000\ndata: {\"ok\": true}"

      result = SSEParser.parse_event(event_text)

      assert result == %{"event" => "Test", "ok" => true}
    end
  end
end
