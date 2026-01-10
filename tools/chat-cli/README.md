# chat-cli

A WebSocket CLI tool for AI-friendly testing of Mindrian chat. Connects to Phoenix channels, sends messages, and logs all events as NDJSON for analysis.

## Test Accounts

The following test accounts are seeded in dev/test environments:

| Email | Password |
|-------|----------|
| `test1@mindrian.local` | `testpassword1` |
| `test2@mindrian.local` | `testpassword2` |
| `test3@mindrian.local` | `testpassword3` |

To get a workspace ID, use the API:
```bash
# Login and list workspaces
curl -c /tmp/cookies.txt -X POST http://localhost:4000/dev/api/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test1@mindrian.local","password":"testpassword1"}'

curl -b /tmp/cookies.txt http://localhost:4000/api/workspaces
```

## Installation

Dependencies are installed automatically on first run via the wrapper script:

```bash
./tools/run-chat-test --help
```

Or install manually:

```bash
cd tools/chat-cli
npm install
```

## Commands

### session - Interactive chat

Start an interactive session with REPL commands:

```bash
./tools/run-chat-test session \
  -e user@example.com \
  -p password \
  -w workspace-id
```

**REPL commands:**
- `/send <message>` or just type text - Send a message
- `/approve [tool_id]` - Approve pending tool call
- `/reject [tool_id] [reason]` - Reject pending tool call
- `/cancel` - Cancel current run
- `/status` - Show current status
- `/help` - Show help
- `/quit` - Exit

**Shortcuts:** `/s`, `/a`, `/r`, `/c`, `/h`, `/q`

### send - Single message

Send one message and optionally wait for a status:

```bash
./tools/run-chat-test send \
  -e user@example.com \
  -p password \
  -w workspace-id \
  -m "What is 2+2?" \
  --wait-for idle
```

### listen - Monitor events

Connect to an existing conversation and log events:

```bash
./tools/run-chat-test listen \
  -e user@example.com \
  -p password \
  -w workspace-id \
  -c conversation-id
```

## Options

| Option | Description |
|--------|-------------|
| `-e, --email <email>` | User email (required) |
| `-p, --password <password>` | User password (required) |
| `-w, --workspace <id>` | Workspace ID (required) |
| `-c, --conversation <id>` | Conversation ID (auto-generated if not provided) |
| `-u, --url <url>` | Backend URL (default: `http://localhost:4000`) |
| `--wait-for <status>` | Wait for status: `idle`, `running`, `awaiting_approval` |
| `--timeout <ms>` | Timeout in milliseconds (default: 60000) |

## Output Format

All output is NDJSON (newline-delimited JSON) on stdout. Prompts and errors go to stderr.

```json
{"ts":"2025-01-10T12:00:00.000Z","event":"session_start","email":"test@example.com","workspace":"ws-123"}
{"ts":"2025-01-10T12:00:01.000Z","event":"connected"}
{"ts":"2025-01-10T12:00:01.500Z","event":"joined","channel":"chat:conv-123","reply":{...}}
{"ts":"2025-01-10T12:00:02.000Z","event":"push_sent","ref":"1","push_event":"send_message","payload":{"id":"msg-1","content":"Hello"}}
{"ts":"2025-01-10T12:00:02.100Z","event":"push_reply","ref":"1","status":"ok"}
{"ts":"2025-01-10T12:00:02.200Z","event":"channel_event","type":"status_changed","status":"running"}
{"ts":"2025-01-10T12:00:02.300Z","event":"channel_event","type":"agent_started","message_id":"agent-1"}
{"ts":"2025-01-10T12:00:02.400Z","event":"channel_event","type":"agent_chunk","message_id":"agent-1","chunk":"Hi"}
{"ts":"2025-01-10T12:00:02.500Z","event":"channel_event","type":"agent_complete","message_id":"agent-1"}
{"ts":"2025-01-10T12:00:02.600Z","event":"channel_event","type":"status_changed","status":"idle"}
```

### Event Types

**Connection events:**
- `session_start` - Session configuration
- `connected` - WebSocket connected
- `disconnected` - WebSocket disconnected
- `joined` - Channel joined (includes initial conversation state)
- `join_error` - Channel join failed

**Push events:**
- `push_sent` - Message sent to server
- `push_reply` - Server response to push

**Channel events** (from backend):
- `status_changed` - Conversation status: `idle`, `running`, `awaiting_approval`
- `agent_started` - Agent message streaming started
- `agent_chunk` - Agent message text chunk
- `agent_complete` - Agent message finished
- `agent_cancelled` - Agent message cancelled
- `tool_call_requested` - Tool awaiting approval
- `tool_call_approved` - Tool approved by user
- `tool_call_executing` - Tool execution started
- `tool_call_completed` - Tool succeeded
- `tool_call_failed` - Tool failed with error
- `tool_call_rejected` - Tool rejected by user
- `tool_call_cancelled` - Tool cancelled

## AI Agent Usage

### Basic workflow

```bash
# 1. Start backend
./run-backend

# 2. Run a test and capture output
./tools/run-chat-test send \
  -e test@test.com -p test123 -w test-workspace \
  -m "List files in the current directory" \
  --wait-for idle > events.ndjson

# 3. Analyze the output
cat events.ndjson | jq -c 'select(.event == "channel_event")'
```

### Debugging message state issues

To verify tool call state transitions (e.g., "executing" should update same message as "approved"):

```bash
# Group tool call events by ID
cat events.ndjson | jq -s '
  [.[] | select(.type | startswith("tool_call"))]
  | group_by(.id)
  | map({id: .[0].id, transitions: [.[].type]})'
```

Expected output for a successful tool call:
```json
[{"id":"tool-123","transitions":["tool_call_requested","tool_call_approved","tool_call_executing","tool_call_completed"]}]
```

If the UI shows separate messages instead of updates, the bug is in frontend state management.

### Checking event sequences

```bash
# Verify agent message lifecycle
cat events.ndjson | jq -s '
  [.[] | select(.type | startswith("agent"))]
  | map({type, message_id})'

# Count events by type
cat events.ndjson | jq -s 'group_by(.type) | map({type: .[0].type, count: length})'

# Get all errors
cat events.ndjson | jq 'select(.event == "error" or .type == "error")'
```

### Interactive debugging

```bash
# Start interactive session, pipe to tee for logging
./tools/run-chat-test session \
  -e test@test.com -p test123 -w test-workspace \
  2>&1 | tee debug.ndjson
```

In the session:
```
[idle]> /send Delete the test file
[running]~
[Tool call requested: delete_file] Use /approve or /reject
[awaiting_approval]? /approve
[running]~
[idle]> /quit
```

## Development

```bash
cd tools/chat-cli

# Type check
npx tsc --noEmit

# Run directly
npm run cli -- session -e test@test.com -p test -w ws-123
```
