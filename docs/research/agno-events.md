# Agno SSE Event Reference

Generated from `backend/scripts/agno_spike.exs` spike on 2025-12-19.

## Event Types

| Event | When | Key Payload Fields |
|-------|------|-------------------|
| `RunStarted` | Run begins | `run_id`, `session_id`, `model`, `agent_id` |
| `RunContent` | Text chunk | `content`, `content_type`, `citations` (on final chunk) |
| `RunContentCompleted` | Text streaming done | (minimal) |
| `ToolCallStarted` | Tool executing | `tool.tool_call_id`, `tool.tool_name`, `tool.tool_args`, `tool.confirmed` |
| `ToolCallCompleted` | Tool finished | `tool.result` (string), `tool.tool_call_error` (bool), `tool.metrics` |
| `RunPaused` | Needs confirmation | `run_id`, `tools[]`, `requirements[]` |
| `RunContinued` | After continue | `run_id` |
| `RunCompleted` | Run finished | `content` (full), `metrics` (tokens, duration) |

## Event Sequences

### Simple Text Response

```
RunStarted → RunContent* → RunContent(empty+citations) → RunContentCompleted → RunCompleted
```

### Auto-Execute Tool (e.g., list_documents)

```
RunStarted → RunContent(empty) → ToolCallStarted → ToolCallCompleted → RunContent* → RunContentCompleted → RunCompleted
```

### Confirmation Required - Approved

```
RunStarted → RunContent(empty) → RunContentCompleted → RunPaused
... POST /runs/{run_id}/continue with confirmed=true ...
RunContinued → ToolCallStarted → ToolCallCompleted → RunContent* → RunContentCompleted → RunCompleted
```

### Confirmation Required - Rejected

```
RunStarted → RunContent(empty) → RunContentCompleted → RunPaused
... POST /runs/{run_id}/continue with confirmed=false ...
RunContinued → RunContent* → RunContentCompleted → RunCompleted
```

Note: Rejected tools skip `ToolCallStarted`/`ToolCallCompleted` entirely.

## Payload Examples

### RunStarted

```json
{
  "event": "RunStarted",
  "agent_id": "mindrian-agent",
  "agent_name": "Mindrian Agent",
  "model": "claude-sonnet-4-5",
  "model_provider": "Anthropic",
  "run_id": "0fd604a7-66c1-4cd8-b64f-3332de76685e",
  "session_id": "session_9o3-3shY0Iw",
  "created_at": 1766183379
}
```

### RunContent (streaming chunk)

```json
{
  "event": "RunContent",
  "content": "Hello! I'm here to help you",
  "content_type": "str",
  "reasoning_content": "",
  "workflow_agent": false,
  "agent_id": "mindrian-agent",
  "run_id": "...",
  "session_id": "...",
  "created_at": 1766183380
}
```

### RunContent (final chunk with citations)

```json
{
  "event": "RunContent",
  "content": "",
  "content_type": "str",
  "citations": {
    "documents": [],
    "raw": [],
    "urls": []
  },
  "reasoning_content": "",
  "workflow_agent": false
}
```

### ToolCallStarted

```json
{
  "event": "ToolCallStarted",
  "agent_id": "mindrian-agent",
  "run_id": "...",
  "session_id": "...",
  "created_at": 1766183383,
  "tool": {
    "tool_call_id": "toolu_01QBYB8QZvTAGRMZSeMeNcHT",
    "tool_name": "list_documents",
    "tool_args": {},
    "requires_confirmation": null,
    "confirmed": null,
    "result": null,
    "tool_call_error": null,
    "metrics": null,
    "stop_after_tool_call": false
  }
}
```

### ToolCallCompleted

```json
{
  "event": "ToolCallCompleted",
  "content": "list_documents() completed in 0.0738s. ",
  "agent_id": "mindrian-agent",
  "run_id": "...",
  "session_id": "...",
  "created_at": 1766183383,
  "tool": {
    "tool_call_id": "toolu_01QBYB8QZvTAGRMZSeMeNcHT",
    "tool_name": "list_documents",
    "tool_args": {},
    "result": "{'success': True, 'result': {'count': 6, 'documents': [...]}}",
    "tool_call_error": false,
    "metrics": {
      "duration": 0.07380591600667685
    }
  }
}
```

### RunPaused

```json
{
  "event": "RunPaused",
  "content": "I have tools to execute, but I need confirmation.",
  "run_id": "b17c47dc-0282-4af4-ab82-d204535348f0",
  "session_id": "...",
  "created_at": 1766183389,
  "tools": [
    {
      "tool_call_id": "toolu_014NwbC34YUX8CFu1fzMSzur",
      "tool_name": "create_document",
      "tool_args": {
        "title": "Spike Test"
      },
      "requires_confirmation": true,
      "confirmed": null,
      "result": null
    }
  ],
  "requirements": [
    {
      "confirmation": null,
      "confirmation_note": null,
      "tool_execution": { ... },
      "created_at": "2025-12-19T22:29:49.939793+00:00"
    }
  ]
}
```

### RunCompleted

```json
{
  "event": "RunCompleted",
  "content": "Hello! I'm here to help you with your research documents and deep connections on Mindrian.",
  "content_type": "str",
  "citations": {
    "documents": [],
    "raw": [],
    "urls": []
  },
  "agent_id": "mindrian-agent",
  "run_id": "...",
  "session_id": "...",
  "session_state": {},
  "created_at": 1766183381,
  "metrics": {
    "duration": 2.074189707986079,
    "input_tokens": 2798,
    "output_tokens": 31,
    "total_tokens": 2829,
    "time_to_first_token": 0.0044944160035811365,
    "provider_metrics": {
      "service_tier": "standard"
    }
  }
}
```

## Key Observations

1. **Chunk granularity**: Word/phrase level, not character-by-character
   - Examples: `"Hello! I'm here to help you"`, `" with your research documents"`

2. **Final RunContent**: Always ends with an empty content chunk containing `citations` object

3. **Tool result format**: `tool.result` is a stringified Python dict
   - Example: `"{'success': True, 'result': {...}}"`
   - Must be parsed as Python literal or JSON

4. **Rejection skips tool events**: No `ToolCallStarted`/`ToolCallCompleted` when rejected

5. **Pause timing**: `RunContentCompleted` fires BEFORE `RunPaused`

6. **Metrics in RunCompleted**: `duration`, `input_tokens`, `output_tokens`, `total_tokens`, `time_to_first_token`

## API Endpoints

### Start Run

```
POST /agents/{agent_id}/runs
Content-Type: application/x-www-form-urlencoded

message=...&stream=true&session_id=...&user_id=...&dependencies={"document_id": null}
```

### Continue Run (after pause)

```
POST /agents/{agent_id}/runs/{run_id}/continue
Content-Type: application/x-www-form-urlencoded

tools=[{"tool_call_id": "...", "tool_name": "...", "tool_args": {...}, "requires_confirmation": true, "confirmed": true|false}]&session_id=...&user_id=...&stream=true
```

### Cancel Run

```
POST /agents/{agent_id}/runs/{run_id}/cancel
```

## Fuzz Testing Results

Generated from `mix run scripts/agno_spike.exs fuzz`.

### Input Validation

| Test | Status | Behavior |
|------|--------|----------|
| Empty message | 422 | Proper validation: `Field required` |
| Whitespace only | 200 | `RunStarted` then `RunError` (Anthropic rejects) |
| 10k character message | 200 | Works fine |
| Unicode (中文, عربي, emoji) | 200 | Works fine |
| XSS/injection attempts | 200 | Handled safely, no execution |
| Newlines in message | 200 | Works fine |

### User/Session Validation

| Test | Status | Behavior |
|------|--------|----------|
| Invalid user_id | 200 | Agno accepts any string (Phoenix validates) |
| Empty user_id | 200 | Same - no Agno-side validation |
| Empty session_id | 200 | Agno auto-generates a UUID session_id |

### Continue Edge Cases

| Test | Status | Behavior |
|------|--------|----------|
| Invalid run_id | 200 | `RunError` event: "No runs found for run ID..." |
| Empty run_id | 404 | Route not found |
| Wrong tool_call_id | 200 | Agno accepts it and proceeds (!) |
| Double continue | 200 | `RunError`: "No runs found..." (already completed) |

### Other Edge Cases

| Test | Status | Behavior |
|------|--------|----------|
| Missing stream param | 200 | Returns non-streaming JSON with full response |
| Invalid dependencies JSON | 200 | Agno ignores invalid JSON, continues |
| Cancel invalid run | 500 | `{"detail": "Failed to cancel run"}` |
| Cancel completed run | 500 | Same server error |

### Key Insights

1. **Agno trusts user_id**: No validation - relies on Phoenix to authenticate
2. **Wrong tool_call_id accepted**: Agno doesn't validate tool_call_id matches the paused run
3. **Non-streaming mode exists**: Omit `stream=true` to get full JSON response
4. **Cancel is fragile**: Returns 500 for invalid/completed runs instead of proper error
5. **RunError event**: Used for async errors (invalid run_id, API errors)
6. **Anthropic validation**: Whitespace-only messages rejected at Anthropic level, not Agno
