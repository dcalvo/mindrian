# Mindrian
## System Design Document

**Date:** December 2025
**Status:** MVP collaborative editing implemented (see `blocknote-collaboration-plan.md`)

---

## 0. Technology Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Backend** | Elixir Phoenix | Channels for real-time, phx.gen.auth, excellent WebSocket support |
| **Database** | PostgreSQL | JSON columns for BlockNote content, reliable |
| **Yjs Server** | y_ex | Elixir bindings for y-crdt (Rust). Server can understand/manipulate CRDT state |
| **Frontend** | Vite + React | Fast builds, minimal footprint, no framework bloat |
| **Routing** | TanStack Router | Type-safe routes, lightweight (~12kb) |
| **Editor** | BlockNote.js | Block-based WYSIWYG, React-native, has Yjs integration |
| **Real-time** | Phoenix Channels + Yjs | Channels as transport, Yjs for CRDT sync |
| **AI** | Anthropic Claude API | Streaming responses, called from backend only |

**Explicitly not using:**
- TanStack Query — unnecessary; Phoenix Channels push all data we need
- State management library (Redux, Zustand) — React state + context sufficient
- Next.js — too heavy, we don't need SSR
- CSS framework — TBD, possibly Tailwind or minimal custom CSS

---

## 1. Problem Statement

Users need a tool to develop ideas into structured knowledge artifacts. The current landscape forces a choice between:

- **Note-taking apps** (Notion, Obsidian): Good for structure, no AI co-creation
- **AI chat interfaces** (ChatGPT, Claude): Good for ideation, artifacts are disposable
- **Writing tools** (Google Docs): Good for editing, no knowledge graph

We're building a hybrid: **AI-assisted wiki creation** where conversation and artifact exist in productive tension.

---

## 2. Core Concepts

### 2.1 Mental Model

```
┌─────────────────────────────────────────────────────────────┐
│                        USER'S MIND                          │
│                                                             │
│    Vague idea → Conversation → Structured Page → Knowledge  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      THE SYSTEM                             │
│                                                             │
│   Chat Mode ────────────────────────────► Page Mode         │
│   (exploration)                           (refinement)      │
│                                                             │
│   "What am I thinking about?"    "Help me improve this"     │
│   "What structure makes sense?"  "Find me sources"          │
│   "Create a page from this"      "Connect to other ideas"   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Key Entities

| Entity | Description | Relationships |
|--------|-------------|---------------|
| **Page** | A wiki-style document with blocks | Lives in folders, links to other pages |
| **Folder** | Organizational container | Contains pages, can nest (TBD: depth limit?) |
| **Block** | Unit of content within a page | Paragraphs, headings, lists, etc. |
| **Link** | Connection between pages | Source page → Target page, with anchor text |
| **Suggestion** | AI-proposed change to a page | Attached to page, pending user action |
| **Skill** | A specialized AI capability | Invoked by chat agent or directly |

### 2.3 The Two Modes

**Chat-Only Mode**
- No page selected
- Full-screen chat interface
- Purpose: Explore an idea, develop structure, decide what to create
- Exit: User creates a page (transitions to Page+Chat)

**Page+Chat Mode**  
- Page open in editor
- Chat pane alongside
- Purpose: Refine content, get AI assistance on specific sections
- AI edits appear as suggestions (tracked changes)

---

## 3. System Boundaries

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│                       Vite + React                              │
│                     TanStack Router                             │
│                                                                 │
│  ┌───────────┐  ┌─────────────────────┐  ┌──────────────────┐  │
│  │ File Tree │  │   Content Editor    │  │    Chat Pane     │  │
│  │           │  │                     │  │                  │  │
│  │           │  │  ┌───────────────┐  │  │                  │  │
│  │           │  │  │ BlockNote.js  │  │  │                  │  │
│  │           │  │  │ + Yjs client  │  │  │                  │  │
│  │           │  │  └───────────────┘  │  │                  │  │
│  │           │  │                     │  │                  │  │
│  │           │  │  ┌───────────────┐  │  │                  │  │
│  │           │  │  │ Suggestions   │  │  │                  │  │
│  │           │  │  │ Overlay       │  │  │                  │  │
│  │           │  │  └───────────────┘  │  │                  │  │
│  └───────────┘  └─────────────────────┘  └──────────────────┘  │
│                                                                 │
│         ▲                    ▲                    ▲             │
│         │                    │                    │             │
│         ▼                    ▼                    ▼             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              WebSocket Connection (Channels)             │   │
│  │                                                          │   │
│  │   tree:user_id    page:page_id      chat:user_id        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          BACKEND                                │
│                       Elixir Phoenix                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Channel Layer                          │   │
│  │                                                          │   │
│  │  • Authenticates connections                             │   │
│  │  • Routes messages to appropriate handlers               │   │
│  │  • Broadcasts updates to subscribers                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│         ┌────────────────────┼────────────────────┐            │
│         ▼                    ▼                    ▼            │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐      │
│  │   Content   │     │    Sync     │     │   Agents    │      │
│  │   Context   │     │   Context   │     │   Context   │      │
│  │             │     │             │     │             │      │
│  │ • CRUD ops  │     │ • y_ex      │     │ • Skills    │      │
│  │ • Search    │     │ • Broadcast │     │ • Streaming │      │
│  │ • Links     │     │ • Presence  │     │ • Context   │      │
│  └─────────────┘     └─────────────┘     └─────────────┘      │
│         │                    │                    │            │
│         │                    │                    │            │
│         │              ┌─────▼─────┐              │            │
│         │              │   y_ex    │              │            │
│         │              │           │              │            │
│         │              │ • Parse   │              │            │
│         │              │   updates │              │            │
│         │              │ • Extract │              │            │
│         │              │   content │              │            │
│         │              │ • Apply   │              │            │
│         │              │   changes │              │            │
│         │              └─────┬─────┘              │            │
│         │                    │                    │            │
│         └────────────────────┼────────────────────┘            │
│                              ▼                                  │
│                    ┌─────────────────┐                         │
│                    │   PostgreSQL    │                         │
│                    └─────────────────┘                         │
│                                                                 │
│                              │                                  │
│                              ▼                                  │
│                    ┌─────────────────┐                         │
│                    │  Anthropic API  │                         │
│                    └─────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
```

**Key role of y_ex**: The Elixir Yjs binding allows the server to be a *participant* in the CRDT, not just a relay. This enables:
- Extracting page text for full-text search indexing
- Reading page content to build AI context
- Potentially applying AI suggestions server-side
- Validating updates before persistence

---

## 4. Key Interfaces

### 4.1 Frontend ↔ Backend Communication

Three WebSocket channels, each with distinct responsibilities:

**Tree Channel** (`tree:{user_id}`)
```
Purpose: Keep file tree synchronized across devices

Client → Server:
  • create_folder(name, parent_id?)
  • create_page(title, folder_id?)
  • move_item(id, type, new_parent_id, new_position)
  • rename_item(id, type, new_name)
  • delete_item(id, type)

Server → Client:
  • tree_updated(full_tree)  // Simple: just send whole tree on any change
```

**Page Channel** (`page:{page_id}`)
```
Purpose: Real-time collaborative editing via Yjs

Client → Server:
  • yjs_update(binary_delta)      // Yjs update vector
  • awareness_update(cursor_state) // Cursor position, selection

Server → Client:
  • yjs_update(binary_delta)       // Broadcast to other clients
  • awareness_update(user_id, state)
  • initial_state(yjs_snapshot)    // On join

Persistence: 
  • Server persists Yjs state on debounced interval (~1s)
  • Full snapshot vs. incremental updates TBD (see Research Questions)
```

**Chat Channel** (`chat:{user_id}`)
```
Purpose: AI agent communication with streaming

Client → Server:
  • send_message(content, context)
    - context.page_id: current page (null if chat-only mode)
    - context.mentioned_page_ids: pages referenced via @
    - context.capabilities: {can_search, can_create_pages}
    - context.selection: selected text in editor (if any)

Server → Client:
  • chunk(text)              // Streaming token
  • complete(full_response, suggestions?)
  • error(reason)

Suggestions format (when AI proposes edits):
  • type: insert | replace | delete
  • target: block_id or position
  • content: proposed blocks
  • reasoning: why AI suggests this
```

### 4.2 Agent System Interface

```
┌─────────────────────────────────────────────────────────────┐
│                     SKILL INTERFACE                         │
│                                                             │
│  Every skill must define:                                   │
│                                                             │
│  • name: identifier for routing                             │
│  • description: what this skill does (for chat agent)       │
│  • accepts: what context/input it needs                     │
│  • produces: what output format it returns                  │
│  • streams: boolean - does it stream or return complete?    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    CONTEXT STRUCTURE                        │
│                                                             │
│  Passed to every skill invocation:                          │
│                                                             │
│  • user_message: what the user typed                        │
│  • current_page: {title, content} or null                   │
│  • mentioned_pages: [{title, content}, ...]                 │
│  • selection: highlighted text in editor (if any)           │
│  • capabilities: what the skill is allowed to do            │
│  • conversation_history: recent messages (sliding window)   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    SKILL CATALOG                            │
│                                                             │
│  Chat (router)                                              │
│  ├── Accepts: any user message                              │
│  ├── Produces: response text + optional suggestions         │
│  ├── Can route to: other skills                             │
│  └── Streams: yes                                           │
│                                                             │
│  Expander                                                   │
│  ├── Accepts: block or selection to expand                  │
│  ├── Produces: replacement blocks                           │
│  └── Streams: yes                                           │
│                                                             │
│  Researcher                                                 │
│  ├── Accepts: claim or topic to find sources for            │
│  ├── Produces: citations + suggested insertions             │
│  ├── Requires: web search capability                        │
│  └── Streams: yes                                           │
│                                                             │
│  Linker                                                     │
│  ├── Accepts: page content                                  │
│  ├── Produces: suggested internal wiki links                │
│  ├── Requires: access to page index                         │
│  └── Streams: no (returns complete)                         │
│                                                             │
│  Structurer                                                 │
│  ├── Accepts: unstructured notes or conversation            │
│  ├── Produces: proposed page outline                        │
│  └── Streams: yes                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 Suggestion System Interface

```
┌─────────────────────────────────────────────────────────────┐
│                  SUGGESTION LIFECYCLE                       │
│                                                             │
│   AI generates    User sees in     User acts    Applied to  │
│   suggestion  →   editor as    →   (accept/  →  Yjs doc     │
│                   tracked change   reject)      or discarded│
│                                                             │
└─────────────────────────────────────────────────────────────┘

Suggestion types:

INSERT
  • Where: after block_id, or at position N
  • What: array of new blocks
  • Display: green highlighted blocks with (+) marker

REPLACE  
  • Where: specific block_id
  • What: new version of that block
  • Display: strikethrough old, green new (inline diff)

DELETE
  • Where: specific block_id
  • What: n/a
  • Display: strikethrough with (−) marker

Key question: How does this interact with Yjs?
  • Option A: Suggestions are separate from Yjs doc, applied on accept
  • Option B: Suggestions are a "layer" within Yjs (using sub-documents)
  • Recommendation: Start with A (simpler), migrate to B for multiplayer
```

---

## 5. Data Model

### 5.1 Entity Relationships

```
┌──────────┐       ┌──────────┐       ┌──────────┐
│   User   │──────<│  Folder  │──────<│   Page   │
└──────────┘  owns └──────────┘contains└──────────┘
                        │                   │
                        │ parent            │
                        ▼                   │
                   ┌──────────┐             │
                   │  Folder  │             │
                   │  (self)  │             │
                   └──────────┘             │
                                            │
                   ┌────────────────────────┤
                   │                        │
                   ▼                        ▼
            ┌──────────┐            ┌──────────────┐
            │   Link   │            │  Suggestion  │
            │          │            │              │
            │ source ──┼──► Page    │ page_id      │
            │ target ──┼──► Page    │ status       │
            └──────────┘            └──────────────┘
```

### 5.2 Key Design Decisions

**Page Content Storage**
```
Decision: Store as JSON blob (BlockNote native format)
Rationale: 
  • Matches BlockNote's internal representation
  • Avoids impedance mismatch
  • Simpler initial implementation
  
Trade-off: 
  • Cannot query individual blocks via SQL
  • Cannot do block-level permissions
  
Migration path: 
  • Can extract to normalized `blocks` table later if needed
  • JSON structure is stable, migration is mechanical
```

**Yjs State Storage**
```
Decision: Store binary Yjs document state in pages table
Options we considered:
  A. Store full Yjs state blob (simple, but grows over time)
  B. Store Yjs updates as append-only log (complex, good for history)
  C. Store both: periodic snapshots + recent updates
  
Recommendation: Start with A, profile, migrate to C if needed
```

**Folder Nesting**
```
Decision: Allow nesting, but consider depth limit
Question: Is there a UX or performance reason to limit depth?
  • Obsidian: unlimited
  • Notion: unlimited but UI gets unwieldy past 3-4 levels
  
Recommendation: No hard limit, but UI should discourage deep nesting
```

---

## 6. User Interface Specifications

### 6.1 Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────┐  ┌─────────────────────────────────────────────────┐   │
│  │     │  │                    Header                       │   │
│  │     │  │  [Logo]  [Page Title]            [User] [Sync]  │   │
│  │     │  └─────────────────────────────────────────────────┘   │
│  │     │                                                        │
│  │     │  ┌──────────────────────────┬──────────────────────┐   │
│  │ F   │  │                          │                      │   │
│  │ i   │  │                          │                      │   │
│  │ l   │  │                          │                      │   │
│  │ e   │  │       Content Area       │     Chat Pane        │   │
│  │     │  │       (collapsible)      │   (collapsible)      │   │
│  │ T   │  │                          │                      │   │
│  │ r   │  │                          │                      │   │
│  │ e   │  │                          │                      │   │
│  │ e   │  │                          │                      │   │
│  │     │  │                          │                      │   │
│  └─────┘  └──────────────────────────┴──────────────────────┘   │
│                                                                  │
│  ◄─────────────── Resizable panes ─────────────────────────────► │
└─────────────────────────────────────────────────────────────────┘

Mode transitions:
  • Chat-only: Content area collapsed, chat pane full width
  • Page+Chat: Both visible, resizable
  • Page-only: Chat pane collapsed (for focused writing)
```

### 6.2 File Tree Behaviors

```
Interactions:
  • Click page → Open in editor
  • Click folder → Expand/collapse
  • Drag page → Reorder or move to folder
  • Drag folder → Reorder or nest
  • Right-click → Context menu (rename, delete, new page, new folder)
  • Double-click page title → Inline rename

Visual states:
  • Current page: highlighted
  • Folder with contents: chevron indicator
  • Empty folder: different icon or no chevron
  • Syncing: subtle indicator
  • New/unsaved: dot indicator (if we have unsaved state)

Question: Do we show page previews on hover? (adds complexity)
```

### 6.3 Editor Behaviors

```
BlockNote handles:
  • Block creation, deletion, reordering
  • Rich text formatting
  • Slash commands for block types
  • Drag-and-drop blocks

We need to add:
  • Wiki link handling: [[Page Name]] syntax
    - On type: Show autocomplete dropdown of existing pages
    - On enter: Insert link, if page doesn't exist → TBD behavior
  • Suggestion rendering overlay
  • Backlinks panel (bottom or sidebar)

Wiki link resolution (needs decision):
  Option A: Autocomplete only shows existing pages
  Option B: Allow creating new pages inline ([[New Page]])
  Option C: Allow typing any name, show "page doesn't exist" state
  
  Larry Navigator analog: They drop to chat mode for non-existent
  Obsidian analog: Creates page on navigation
  
  Recommendation: Option A for MVP, revisit based on user feedback
```

### 6.4 Chat Pane Behaviors

```
Components:
  ┌─────────────────────────────────┐
  │  ┌───────────────────────────┐  │
  │  │    Prompt Helper Buttons  │  │  ← Context-sensitive
  │  │  [Expand] [Sources] [Link]│  │
  │  └───────────────────────────┘  │
  │                                 │
  │  ┌───────────────────────────┐  │
  │  │                           │  │
  │  │     Message History       │  │  ← Scrollable
  │  │                           │  │
  │  │     (ephemeral per        │  │
  │  │      session or page?)    │  │
  │  │                           │  │
  │  └───────────────────────────┘  │
  │                                 │
  │  ┌───────────────────────────┐  │
  │  │  @ Context Picker         │  │  ← @page mentions
  │  │  ☑ Can search web         │  │  ← Capability toggles  
  │  │  ☑ Can create pages       │  │
  │  └───────────────────────────┘  │
  │                                 │
  │  ┌───────────────────────────┐  │
  │  │  [    Input area    ] [▶] │  │  ← Multi-line, submit
  │  └───────────────────────────┘  │
  └─────────────────────────────────┘

Prompt helpers change by mode:
  Chat-only: [Structure this] [What's missing?] [Create page]
  Page+Chat: [Expand section] [Find sources] [Suggest links] [Simplify]

Context picker:
  • Type @ to search and select pages to include in context
  • Checkboxes for capabilities (what AI is allowed to do)
  • Selected items shown as pills/chips

Streaming display:
  • Tokens appear as they arrive
  • Cursor/typing indicator
  • "Stop generating" button during stream
```

### 6.5 Suggestion Display

```
When AI returns suggestions:

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ## Existing Heading                                        │
│                                                             │
│  Existing paragraph of text that the user wrote.            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ + AI SUGGESTION                              [✓] [✗] │   │
│  │                                                      │   │
│  │ New paragraph that the AI wants to insert here.     │   │
│  │ This could be multiple sentences or even multiple   │   │
│  │ blocks.                                             │   │
│  │                                                      │   │
│  │ "Expanding on your point about X" (reasoning)       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  More existing content below.                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Suggestion states:
  • Pending: Visible with accept/reject buttons
  • Accepted: Applied to document, removed from suggestions
  • Rejected: Hidden, optionally logged

Questions:
  • Can user edit suggestion before accepting? (complicates UX)
  • Do suggestions expire? (after page edit, navigation, time?)
  • Multiple suggestions at once? (probably yes, from single AI response)
```

---

## 7. Research Questions

Before implementation, we need answers to:

### 7.1 y_ex Capabilities and API

```
Question: What can y_ex actually do?
Repository: https://github.com/satoren/y_ex

Need to understand:
  • API for creating/loading Yjs documents
  • How to apply updates from clients
  • How to encode state for sending to clients
  • Can we read document content (for search indexing, AI context)?
  • Can we apply changes server-side (for AI suggestions)?
  • Error handling and edge cases

Research task:
  • Clone repo, read source and any examples
  • Build minimal spike: create doc, apply update, read content
  • Document the working API we discover
  
Why this matters:
  With y_ex, the server can:
  • Validate incoming updates
  • Extract text for full-text search indexing
  • Apply AI suggestions server-side (not just forward to client)
  • Resolve conflicts intelligently
  
  Without understanding y_ex, we fall back to server-as-dumb-pipe.
```

### 7.2 BlockNote + Yjs Integration

```
Question: How mature is BlockNote's Yjs integration?
  • Does it handle all block types?
  • What's the conflict resolution behavior?
  • Can we intercept updates before broadcast?

Research task: 
  • Build minimal prototype: two browser tabs, shared Yjs doc
  • Test: concurrent edits, rapid typing, block reordering
  • Evaluate: any edge cases, performance characteristics
```

### 7.3 Yjs Persistence Strategy

```
Question: How should we persist Yjs state in PostgreSQL?
Options:
  A. Store full encoded doc on every change (simple, potentially large)
  B. Store update vectors, reconstruct on load (complex, good history)
  C. Periodic snapshots + recent updates (balanced)

Research task:
  • Profile Yjs doc size over realistic editing session
  • Test reconstruction time from updates vs snapshot
  • Determine acceptable latency for page load
  
Note: y_ex may influence this — if it provides efficient serialization,
      that affects our storage approach.
```

### 7.4 Phoenix Channel + Yjs + y_ex

```
Question: Best pattern for bridging browser Yjs ↔ Phoenix Channel ↔ y_ex?

Data flow:
  Browser Yjs → encodes update → Channel → y_ex applies → persists
  y_ex state → encodes → Channel → Browser Yjs applies

Research task:
  • Determine binary encoding format (Yjs native? Base64?)
  • Prototype round-trip: browser edit → server → back to another browser
  • Test: connection recovery, missed updates, ordering
```

### 7.4 Suggestion Overlay in BlockNote

```
Question: How to render suggestions without polluting the Yjs doc?
Options:
  A. Separate React layer positioned over blocks (CSS positioning)
  B. Custom BlockNote block types for suggestions (invasive)
  C. Yjs sub-document for suggestions (complex but clean)

Research task:
  • Review BlockNote extension API
  • Prototype simplest overlay approach
  • Test: scroll behavior, block reordering, resize
```

### 7.5 Anthropic API Streaming

```
Question: What's the exact streaming protocol and error handling?
Need to understand:
  • Token format and event types
  • Handling of tool use in streams
  • Timeout and retry behavior
  • Rate limiting implications

Research task:
  • Build minimal Elixir client with streaming
  • Test: long responses, network interruption, rate limits
  • Document failure modes and recovery strategies
```

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| y_ex undocumented/immature | Medium | High | Early spike to validate API; fallback to blob storage if needed |
| BlockNote Yjs integration issues | Medium | High | Early prototyping; have fallback to non-realtime save |
| Suggestion overlay positioning breaks | Medium | Medium | Keep initial implementation simple; full-width suggestions |
| AI streaming complexity | Low | Medium | Well-documented API; start with non-streaming if needed |
| Phoenix Channel scaling | Low | Low | Single-user MVP; revisit for multiplayer |
| Yjs doc size growth | Medium | Medium | Monitor and implement snapshots if needed |
| User confusion between modes | Medium | Medium | Clear visual distinction; smooth transitions |

---

## 9. Implementation Phases

### Phase 0: Skeleton (Complete)

**Goal:** Working project structure with auth, basic UI shell, and build pipeline

```
Backend:
  ✓ Phoenix project with --no-live --no-assets --binary-id
  ✓ phx.gen.auth (session cookies + magic links)
  ✓ CORS configured for Vite dev server
  ✓ API endpoints: /api/health, /api/me
  ✓ Test channel: ping:lobby with ping/pong
  ✓ Fly.io deployment configuration

Frontend:
  ✓ Vite + React + TypeScript
  ✓ TanStack Router with file-based routes
  ✓ Phoenix socket client
  ✓ Auth flow (useAuth hook, redirect to Phoenix login)
  ✓ 3-pane layout shell (Header, FileTree, ContentArea, ChatPane)
  ✓ Build outputs to backend/priv/static/spa/
  ✓ Vite proxy for /api, /socket, /users

Verification:
  ✓ Can register, log in, log out
  ✓ React app builds and served by Phoenix
  ✓ 3-pane layout renders with placeholders
  ✓ Channel ping/pong works from ChatPane
  ✓ Works in both dev mode (port 5173) and prod mode (port 4000)
```

### Phase 1: Research Spikes (In Progress)

**Goal:** Validate technical approach for real-time editing before building features

```
Spikes (see docs/research/):
  □ y_ex: Understand API for server-side Yjs document handling
  □ BlockNote + Yjs: Verify collaborative editing works
  □ Channel binary data: Verify Uint8Array encoding over Phoenix Channels

Why spikes first:
  • y_ex is undocumented — need to verify it does what we need
  • BlockNote Yjs integration maturity is unknown
  • Binary encoding pattern affects all real-time code
  • Better to discover blockers before building on assumptions
```

### Phase 2: Content Foundation

**Goal:** User can create and edit pages (no real-time sync yet)

```
Backend:
  • Database migrations (folders, pages)
  • Content context with CRUD operations
  • REST API or channel messages for content

Frontend:
  • BlockNote editor integration
  • File tree populated from backend
  • Page creation, selection, editing
  • Save on blur/interval

Verification:
  □ Can create folder and page
  □ Can see items in file tree
  □ Can edit page content in BlockNote
  □ Content persists after refresh
```

### Phase 3: Real-time Sync

**Goal:** Edits sync across browser tabs/devices via Yjs

```
Backend:
  • y_ex integration
  • Page channel with Yjs update handling
  • Tree channel with broadcast on changes
  • Yjs state persistence to PostgreSQL

Frontend:
  • Yjs provider connected to BlockNote
  • WebSocket transport for Yjs updates
  • Tree channel subscription
  • Connection status indicator

Verification:
  □ Open same page in two tabs
  □ Edit in one, see change in other (< 2s)
  □ Create page in one tab, appears in other's tree
  □ Refresh preserves all state
```

### Phase 4: Chat & AI

**Goal:** Can chat with AI, responses stream, AI can see page content

```
Backend:
  • Chat channel setup
  • Anthropic client with streaming
  • Basic Chat skill implementation
  • Context builder (current page + mentions)

Frontend:
  • Chat pane with message history
  • Streaming message display
  • @ mention picker for pages
  • Capability toggles

Verification:
  □ Can send message, see streaming response
  □ AI sees current page content
  □ Can @ mention another page
  □ Chat works in both modes (chat-only, page+chat)
```

### Phase 5: Suggestions

**Goal:** AI can propose edits, user can accept/reject

```
Backend:
  • Suggestion parsing from AI response
  • Suggestion storage and status management
  • Additional skills (expander, etc.)

Frontend:
  • Suggestion overlay rendering in editor
  • Accept/reject UI
  • Prompt helper buttons (context-sensitive)

Verification:
  □ Ask AI to expand a section
  □ See suggestion appear inline
  □ Accept → applied to doc
  □ Reject → disappears
```

---

## 10. Open Decisions Needed

Before starting implementation:

1. **Wiki link behavior when page doesn't exist**
   - Drop to chat mode? (Larry pattern)
   - Create empty page? (Obsidian pattern)  
   - Show error state?

2. **Chat history persistence**
   - Truly ephemeral (lost on refresh)?
   - Per-page (cleared on page switch)?
   - Session-based (cleared on logout)?

3. **Concurrent agent requests**
   - Queue subsequent requests?
   - Cancel in-flight request?
   - Allow parallel?

4. **Folder deletion behavior**
   - Cascade delete contents?
   - Move contents to root?
   - Prevent if non-empty?

5. **Suggestion editing**
   - Can user modify suggestion before accepting?
   - Or just accept/reject?

---

## 11. Success Criteria

MVP is complete when:

- [ ] User can sign up, log in, log out
- [ ] User can create, rename, delete folders and pages
- [ ] User can drag-and-drop to reorder/move items
- [ ] Editor supports basic formatting (headings, paragraphs, lists)
- [ ] [[Wiki links]] work between pages
- [ ] Edits sync across devices in < 2 seconds
- [ ] Chat responds with streaming text
- [ ] AI sees current page and @ mentioned pages
- [ ] AI can propose insertions as suggestions
- [ ] User can accept or reject suggestions
- [ ] Prompt helper buttons provide useful shortcuts

---

*Design document v1.1 — Updated to reflect skeleton completion and spike-first approach*
