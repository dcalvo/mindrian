# Implementation Plan - Refactor AI to Structured Events

The goal is to move the local Gemini implementation from a simple text-stream model to a structured event model. This will allow the frontend to render rich UI for tool calls (pending states, results, file approvals) just like it handles the legacy Claude implementation.

## User Review Required

> [!IMPORTANT]
> **Gemini Terms of Use Compliance:**
> Your usage pattern—**Bring Your Own Key (BYOK)** in a desktop application where the AI issues **Function Calls** that are executed locally—is a standard and supported use case for the Gemini API.
>
> - **Privacy:** You are not sending file contents to Google unless the model explicitly requests to read them (which you can inspect/audit).
> - **Security:** Function Calling (Tool Use) is designed exactly for this: the model generates a "request" to run code, and your local app acts as the secure runtime environment.
> - **Keys:** Storing the User's API key locally using Electron's `safeStorage` (which you are already doing) is the correct security practice.

## Proposed Changes

### 1. Electron Backend Refactor

**File:** `electron/services/ai.ts`

- **Current:** Streams raw strings (`chunk.text()`) and manually injects markdown for tools (`*Tool (read_file)...*`).
- **New:** Define a `StreamEvent` type.
  - `{ type: 'text_delta', content: string }`
  - `{ type: 'tool_call', id: string, name: string, args: any }`
  - `{ type: 'tool_result', id: string, result: any }`
- Update the `chat` method to emit these objects instead of concatenated strings.

**File:** `electron/main.ts`

- Update the IPC handler `ai:chat` to forward these JSON objects over the `ai:stream-chunk` channel.

### 2. Frontend Context Refactor

**File:** `src/contexts/AIContext.tsx`

- **Current:** Appends text chunks to a simple string array.
- **New:**
  - State will mirror the `Message` type from `useChat.ts` (id, role, content, status, tool_calls).
  - `onStream` listener will:
    - On `text_delta`: Append text to the last assistant message.
    - On `tool_call`: Create a new tool_call entry in the message's `tool_calls` array (or create a new message if needed, depending on existing UI pattern).
    - On `tool_result`: Update the tool call status to 'completed'.

### 3. UI Unification

**File:** `src/features/workspace/ChatPane.tsx`

- Remove the implementation fork (`if (provider === 'gemini')`).
- Map `AIContext` messages seamlessly to the `Message` interface expected by `ChatMessage`.
- This enables the existing `<ToolCallDisplay />` and logic to start working for Gemini automatically.

## Verification Plan

### Automated Tests

- Since this relies heavily on the `window.ai` bridge which is hard to mock in standard unit tests without a full mocked implementation, verification will be primarily manual user testing.

### Manual Verification Steps

1. **Chat:** Send a simple "Hello". Verify text streams in normally.
2. **Tool Use:** Ask "List files in the current directory".
   - **Expected:** Instead of seeing raw JSON markdown, you should see the `ToolCallDisplay` component (likely a "Thinking..." or "Running list_dir..." UI block).
   - **Expected:** Once finished, the result should be collapsed/displayed cleanly in the UI.
3. **Multi-turn:** Ask the AI to "Read the file main.ts".
   - It should list dir (event 1), then read file (event 2).
   - Verify both tool calls appear in the chat history correctly.
