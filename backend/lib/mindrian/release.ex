defmodule Mindrian.Release do
  @moduledoc """
  Used for executing DB release tasks when run in production without Mix
  installed.
  """
  @app :mindrian

  import Ecto.Query
  alias Mindrian.Accounts
  alias Mindrian.Accounts.{Scope, User}
  alias Mindrian.Collaboration.YjsPersistence
  alias Mindrian.Documents
  alias Mindrian.Documents.Document
  alias Mindrian.Release.DemoContent
  alias Mindrian.Repo

  @test_accounts [
    {"test1@mindrian.local", "testpassword1"},
    {"test2@mindrian.local", "testpassword2"},
    {"test3@mindrian.local", "testpassword3"}
  ]

  # TODO: To remove test accounts feature:
  # 1. Delete test users in prod via remote console:
  #      for email <- ["test1@mindrian.local", "test2@mindrian.local", "test3@mindrian.local"] do
  #        Mindrian.Accounts.get_user_by_email(email) |> Mindrian.Repo.delete()
  #      end
  # 2. Remove test login buttons from lib/mindrian_web/controllers/user_session_html/new.html.heex
  # 3. Remove this module's test account code and seeds.exs call

  @doc """
  Seeds test users. Use this in production via remote console.
  """
  def seed_test_users do
    load_app()

    {:ok, _, _} =
      Ecto.Migrator.with_repo(Repo, fn _repo ->
        seed_test_users!()
      end)

    :ok
  end

  @doc """
  Seeds test users. Use this when repo is already started (e.g., seeds.exs).
  """
  def seed_test_users! do
    for {email, password} <- @test_accounts do
      case Accounts.get_user_by_email(email) do
        nil -> create_test_user(email, password)
        user -> update_test_user(user, password)
      end
    end
  end

  defp create_test_user(email, password) do
    now = DateTime.utc_now(:second)

    %User{}
    |> User.email_changeset(%{email: email}, validate_unique: true)
    |> User.password_changeset(%{password: password})
    |> Ecto.Changeset.put_change(:confirmed_at, now)
    |> Repo.insert!()
  end

  defp update_test_user(user, password) do
    user
    |> User.password_changeset(%{password: password})
    |> Repo.update!()
  end

  # =============================================================================
  # DEMO WORKSPACE PROVISIONING
  # =============================================================================

  @doc """
  Seeds a demo workspace for test3@mindrian.local.

  Run in production via:
    bin/mindrian eval "Mindrian.Release.seed_demo_workspace()"

  Or in remote console:
    Mindrian.Release.seed_demo_workspace!()
  """
  def seed_demo_workspace do
    load_app()

    {:ok, _, result} =
      Ecto.Migrator.with_repo(Repo, fn _repo ->
        seed_demo_workspace!()
      end)

    result
  end

  @doc """
  Seeds demo workspace when repo is already started.
  Returns {:ok, workspace} or {:error, reason}.
  """
  def seed_demo_workspace! do
    user = Accounts.get_user_by_email("test3@mindrian.local")

    if is_nil(user) do
      IO.puts("Error: test3@mindrian.local not found. Run seed_test_users!() first.")
      {:error, :user_not_found}
    else
      scope = Scope.for_user(user)

      case Documents.create_workspace(scope, %{
             title: "Demo Workspace",
             icon: "sparkles",
             bg_color: "#4F46E5",
             icon_color: "#FFFFFF"
           }) do
        {:ok, workspace} ->
          IO.puts("Created demo workspace: #{workspace.id}")
          IO.puts("  Title: #{workspace.title}")
          IO.puts("  Owner: #{user.email}")
          {:ok, workspace}

        {:error, changeset} ->
          IO.puts("Error creating workspace: #{inspect(changeset.errors)}")
          {:error, changeset}
      end
    end
  end

  @doc """
  Adds a document to the demo workspace.

  Example:
    {:ok, workspace} = Mindrian.Release.seed_demo_workspace!()
    Mindrian.Release.add_demo_document!(workspace.id, "My Document", "Document content here")
  """
  def add_demo_document!(workspace_id, title, content_text \\ nil) do
    user = Accounts.get_user_by_email("test3@mindrian.local")
    scope = Scope.for_user(user)

    attrs = %{
      title: title,
      workspace_id: workspace_id
    }

    attrs = if content_text, do: Map.put(attrs, :content_text, content_text), else: attrs

    case Documents.create_document(scope, attrs) do
      {:ok, document} ->
        IO.puts("Created document: #{document.id} - #{title}")
        {:ok, document}

      {:error, changeset} ->
        IO.puts("Error creating document: #{inspect(changeset.errors)}")
        {:error, changeset}
    end
  end

  @doc """
  Adds a folder to the demo workspace.

  Example:
    {:ok, workspace} = Mindrian.Release.seed_demo_workspace!()
    Mindrian.Release.add_demo_folder!(workspace.id, "Research")
  """
  def add_demo_folder!(workspace_id, title, parent_folder_id \\ nil) do
    user = Accounts.get_user_by_email("test3@mindrian.local")
    scope = Scope.for_user(user)

    case Documents.create_folder(scope, %{
           title: title,
           workspace_id: workspace_id,
           parent_folder_id: parent_folder_id
         }) do
      {:ok, folder} ->
        IO.puts("Created folder: #{folder.id} - #{title}")
        {:ok, folder}

      {:error, changeset} ->
        IO.puts("Error creating folder: #{inspect(changeset.errors)}")
        {:error, changeset}
    end
  end

  @doc """
  Seeds a fully populated demo workspace with realistic inventor's notebook content
  for all test accounts. Deletes any existing workspaces first, making this idempotent.

  Run in production via:
    bin/mindrian eval "Mindrian.Release.seed_full_demo!()"

  Or in remote console:
    Mindrian.Release.seed_full_demo!()
  """
  def seed_full_demo! do
    results =
      for {email, _password} <- @test_accounts do
        seed_demo_for_user(email)
      end

    IO.puts("\n=== All demo workspaces created! ===")
    results
  end

  defp seed_demo_for_user(email) do
    user = Accounts.get_user_by_email(email)

    if is_nil(user) do
      IO.puts("Error: #{email} not found. Run seed_test_users!() first.")
      {:error, :user_not_found}
    else
      scope = Scope.for_user(user)

      # Delete existing workspaces for this user (makes this idempotent)
      existing = Documents.list_workspaces(scope)

      if length(existing) > 0 do
        IO.puts("\n[#{email}] Cleaning up #{length(existing)} existing workspace(s)...")

        for ws <- existing do
          IO.puts("  Deleting: #{ws.title}")
          Documents.delete_workspace(ws)
        end
      end

      # Create workspace
      {:ok, workspace} =
        Documents.create_workspace(scope, %{
          title: "Inventor's Black Book",
          icon: "lightbulb",
          bg_color: "#1E1E1E",
          icon_color: "#FCD34D"
        })

      IO.puts("\n[#{email}] Created workspace: #{workspace.title}")

      # Create folders
      {:ok, ideas_folder} = create_demo_folder(scope, workspace.id, "💡 Ideas")
      {:ok, research_folder} = create_demo_folder(scope, workspace.id, "🔬 Research")
      {:ok, musings_folder} = create_demo_folder(scope, workspace.id, "✏️ Musings")
      {:ok, meetings_folder} = create_demo_folder(scope, workspace.id, "📅 Meeting Notes")

      # Main idea documents
      create_demo_doc(
        scope,
        workspace.id,
        ideas_folder.id,
        "Collaborative Brainstorming Editor",
        collaborative_editor_content()
      )

      create_demo_doc(
        scope,
        workspace.id,
        ideas_folder.id,
        "Ambient Computing Garden",
        ambient_garden_content()
      )

      create_demo_doc(
        scope,
        workspace.id,
        ideas_folder.id,
        "Knowledge Decay Tracker",
        knowledge_decay_content()
      )

      create_demo_doc(
        scope,
        workspace.id,
        ideas_folder.id,
        "Serendipity Engine",
        serendipity_engine_content()
      )

      # Research documents
      create_demo_doc(
        scope,
        workspace.id,
        research_folder.id,
        "Vector Embeddings for Semantic Search",
        vector_embeddings_content()
      )

      create_demo_doc(
        scope,
        workspace.id,
        research_folder.id,
        "Graph Databases vs Document Stores",
        graph_vs_document_content()
      )

      create_demo_doc(
        scope,
        workspace.id,
        research_folder.id,
        "Attention Mechanisms in Transformers",
        attention_mechanisms_content()
      )

      create_demo_doc(
        scope,
        workspace.id,
        research_folder.id,
        "Zettelkasten Method Deep Dive",
        zettelkasten_content()
      )

      # Musings (shorter, more personal)
      create_demo_doc(
        scope,
        workspace.id,
        musings_folder.id,
        "Why do good ideas die?",
        musings_ideas_die_content()
      )

      create_demo_doc(
        scope,
        workspace.id,
        musings_folder.id,
        "The adjacent possible",
        adjacent_possible_content()
      )

      create_demo_doc(
        scope,
        workspace.id,
        musings_folder.id,
        "Tools shape thought",
        tools_shape_thought_content()
      )

      create_demo_doc(
        scope,
        workspace.id,
        musings_folder.id,
        "Late night rambling on emergence",
        emergence_rambling_content()
      )

      create_demo_doc(
        scope,
        workspace.id,
        musings_folder.id,
        "What Vannevar Bush got right",
        vannevar_bush_content()
      )

      # Meeting notes
      create_demo_doc(
        scope,
        workspace.id,
        meetings_folder.id,
        "Prof. Reyes - Innovation Lab",
        meeting_reyes_content()
      )

      create_demo_doc(
        scope,
        workspace.id,
        meetings_folder.id,
        "Coffee with David (VC)",
        meeting_david_content()
      )

      create_demo_doc(
        scope,
        workspace.id,
        meetings_folder.id,
        "Student feedback session",
        meeting_students_content()
      )

      # Loose documents (no folder)
      create_demo_doc(
        scope,
        workspace.id,
        nil,
        "Quick capture - parking lot",
        quick_capture_content()
      )

      create_demo_doc(scope, workspace.id, nil, "Reading list", reading_list_content())

      IO.puts("[#{email}] Done! Workspace ID: #{workspace.id}")
      {:ok, workspace}
    end
  end

  defp create_demo_folder(scope, workspace_id, title) do
    {:ok, folder} = Documents.create_folder(scope, %{title: title, workspace_id: workspace_id})
    IO.puts("📁 #{title}")
    {:ok, folder}
  end

  defp create_demo_doc(scope, workspace_id, folder_id, title, content) do
    {:ok, doc} =
      Documents.create_document(scope, %{
        title: title,
        workspace_id: workspace_id,
        folder_id: folder_id,
        content_text: content
      })

    # Also seed the YJS content for the collaborative editor
    DemoContent.seed_yjs_content(doc.id, content)

    IO.puts("   📄 #{title}")
    {:ok, doc}
  end

  # =============================================================================
  # DEMO CONTENT
  # =============================================================================

  defp collaborative_editor_content do
    """
    # Collaborative Brainstorming Editor

    A platform to capture, inventory, and mine student ideas for innovative insights at scale.

    ## The Problem

    * Students meet weekly to brainstorm innovative ideas

    * Good ideas exist but stay **isolated in individual heads** instead of combining into something bigger

    * Currently no formalized process — ideas are spoken aloud and hope someone picks them up ("oral tradition")

    * At scale (hundreds of students), it's **cognitively impossible** for anyone to hold all ideas in their head and spot connections

    ## Key Insight

    > The innovation bottleneck isn't ideation, it's synthesis. The raw material exists, but nobody can see the whole board.

    You can't search for what you don't know you're looking for. A database doesn't help if the query requires knowledge you don't have yet.

    ## Example: Missed Connection

    * **Team A (Drones):** Needed a charging solution for drones

    * **Team B (Powerlines):** Needed to reduce maintenance personnel injuries

    * **Missed insight:** Drones could inspect powerlines safely AND use them as a free recharging source for 100% uptime

    Neither team would naturally look at the other's problem space — but the breakthrough was hiding in the overlap.

    ## Two Core Problems to Solve

    1. **Capture:** Getting ideas out of heads into a searchable, persistent format

    2. **Connection:** Surfacing non-obvious relationships between captured ideas (this is the critical unlock)

    ## The AI's Role

    AI isn't just nice-to-have — it's the **core value proposition**. It needs to proactively surface connections humans wouldn't think to look for.

    Example: "Hey, this thing you just wrote about drone charging? Three weeks ago someone posted about powerline maintenance. You should talk."

    ## Open Questions

    * [ ] Who decides if a connection is valuable? (Students, facilitator, AI confidence score?)
    * [ ] What happens after a connection is surfaced? (Notify, introduce, track collaboration?)
    * [ ] Is the platform's job done when it surfaces connections, or must it drive collaboration to outcomes?

    ## Platform Boundary

    **The platform is a discovery engine, not a project management tool.** It surfaces connections; humans decide and act. Clean separation of responsibilities.

    ## The Real Pain Point

    **Instructors are bleeding.** University instructors and business innovation teachers are experts who don't have enough time to attend to every student. They need to offload their expertise to AI systems to scale to thousands of students (MOOCs, etc).

    ### Reframe

    The instructor IS the connection-finder today. They hear the drone team and remember the powerline team. But that cognitive load doesn't scale past ~30-50 students.

    > The platform isn't really about helping students brainstorm better — it's about bottling instructor expertise and distributing it at scale. The AI becomes a proxy for the experienced mentor.

    ## Primary Customer

    **The instructor is the real user.** They're teaching innovation/entrepreneurship to cohorts that have grown beyond what one human can cognitively manage. Their superpower — pattern-matching across student ideas — doesn't scale. They need a tool that does that pattern-matching for them.

    ## Validation

    * **Market:** Initially 30 instructors at Westfield, with potential to expand across all universities

    * **Confirmed interest:** Validated with department chairs, adjuncts, etc.

    * **Current workaround:** Overworking themselves and their TAs

    ## PWS Assessment

    ### Real?

    **Yes.** Instructors are overworking, TAs are stretched, large cohorts get degraded mentorship. Validated with chairs and adjuncts.

    ### Winnable?

    Technically doable with current AI. Question: What's the smallest version to test? Could a pilot with one instructor + one cohort prove the connection-surfacing changes behavior?

    ### Worth It?

    30 instructors at Westfield as beachhead. If this works, market = every business/innovation program globally.

    ## Next Step

    **Build a bare-minimum website prototype** (even static mockups with one working feature) and schedule feedback sessions with 3-5 of the interested Westfield instructors within 30 days.

    ## Final Synthesis

    Started with "collaborative brainstorming editor" — pretty vague. What we uncovered is a very specific, validated problem:

    > Innovation instructors cannot scale their expertise in pattern-matching student ideas to large or online cohorts, resulting in missed breakthrough connections and instructor/TA burnout.

    The solution is a platform that captures student ideas and proactively surfaces semantic connections — essentially **bottling the instructor's "hey, go talk to that team" instinct** and distributing it at scale.

    ### Problem Classification

    * **Type:** Ill-defined (now clarified)

    * **Horizon:** 1-5 years
    """
  end

  defp ambient_garden_content do
    """
    # Ambient Computing Garden

    What if your workspace knew what you were thinking about before you did?

    ## The Spark

    I keep finding myself in the same loop: I'm working on project A, hit a wall, switch to project B, and three days later realize B had the answer to A's problem all along. My own notes are a treasure chest I keep forgetting to open.

    ## Core Concept

    An ambient layer that sits across all your work — documents, code, conversations, bookmarks — and gently surfaces relevant context without being asked.

    Not a search engine. Not a chatbot. Something more like... peripheral vision for knowledge.

    ## Key Properties

    1. **Passive observation** — watches what you're working on without interruption
    2. **Proactive surfacing** — brings relevant past work into peripheral awareness
    3. **Low friction** — shows up at the edges, not the center of attention
    4. **Trust-building** — earns attention through consistently useful suggestions

    ## Design Principles

    ### The "Garden" Metaphor

    - Gardens grow organically, not through explicit commands
    - You tend a garden, you don't program it
    - Things bloom when conditions are right
    - Weeds need to be pruned (noise reduction is critical)

    ### Ambient ≠ Background

    Ambient means "surrounding" — present in the environment. It's not about hiding in the background, it's about being part of the context without demanding focus.

    Think: background music vs. silence vs. loud TV. We want the music.

    ## Technical Approaches

    - Continuous embedding of active work context
    - Similarity search against personal corpus
    - Attention-based relevance scoring
    - UI: sidebar glow, subtle card animations, "curiosity" notifications

    ## Open Questions

    * How do you calibrate "relevance" without explicit feedback loops?
    * What's the failure mode? Annoying? Creepy? Invisible (too passive)?
    * Privacy implications of ambient monitoring?

    ## Connection to Other Ideas

    This relates strongly to the [[Collaborative Brainstorming Editor]] concept — both are about surfacing connections. But this is personal/individual, that is social/group.

    Could they be layers of the same system?

    ## Status

    🟡 Conceptual — needs prototyping to validate whether ambient UI patterns actually work
    """
  end

  defp knowledge_decay_content do
    """
    # Knowledge Decay Tracker

    Everything you learn is slowly evaporating. What if you could see it happening?

    ## The Problem

    I've read hundreds of books. I remember maybe 5% of them. The other 95% might as well have never happened, except they shaped me in ways I can't articulate.

    But some of that lost knowledge would be *useful* right now if I could just remember I knew it.

    ## Spaced Repetition Isn't the Answer

    SRS (Anki, etc.) works for discrete facts. But most valuable knowledge isn't facts — it's frameworks, intuitions, connections. You can't put "how to think about distributed systems" on a flashcard.

    ## Alternative Approach: Decay Visualization

    What if instead of trying to prevent forgetting, we just made it visible?

    - **Last touched:** When did you last engage with this concept?
    - **Engagement depth:** Skimmed vs. read vs. wrote about vs. applied
    - **Connection density:** How linked is this to other active knowledge?
    - **Decay estimate:** Based on forgetting curves + engagement, how much is probably left?

    ## UI Concepts

    Imagine your knowledge base where each node's brightness indicates estimated retention:
    - Bright = fresh, strongly held
    - Dim = fading, still recoverable
    - Dark = probably gone, but marker remains

    Clicking a dark node shows what you *used to know* — your past self's notes, with a prompt to re-engage if valuable.

    ## The "Rekindle" Feature

    When you're working on something, the system could gently suggest: "You wrote about this 18 months ago. Your retention is estimated at 20%. Want to revisit?"

    Not flashcards. Just... awareness.

    ## Research Connections

    - Ebbinghaus forgetting curve (1885!)
    - Testing effect (retrieval strengthens memory)
    - Generation effect (creating strengthens more than consuming)
    - Spacing effect (distributed practice beats massed practice)

    ## Why This Matters for Innovation

    Creative breakthroughs often come from recombining knowledge across domains. But if the knowledge has decayed, the recombination can't happen.

    > You can only connect dots you still have.

    ## Status

    🔴 Speculative — the decay estimation model would need real research to validate
    """
  end

  defp serendipity_engine_content do
    """
    # Serendipity Engine

    Can we engineer luck?

    ## Observation

    The most valuable insights I've had came from unexpected collisions:
    - A random conversation at a conference
    - A book I picked up by accident
    - A misheard comment that made me think differently

    These weren't plannable. But maybe the conditions for them are.

    ## Serendipity Components

    Louis Pasteur: "Chance favors the prepared mind."

    Breaking this down:
    1. **Chance** — exposure to novel, diverse inputs
    2. **Prepared** — context/priming that makes connections possible
    3. **Mind** — cognitive state receptive to non-obvious links

    A serendipity engine would optimize for all three.

    ## Design Ideas

    ### Diverse Input Injection
    - Periodically surface random notes from your archive
    - Pull in tangentially related external content
    - Connect with people working on semantically adjacent problems

    ### Preparation Layer
    - Before meetings/events, prime with relevant past thoughts
    - Surface "open questions" you've written before

    ### Receptive State
    - Harder to engineer — maybe just: don't interrupt during flow states
    - Serendipity injection during natural breaks

    ## The Anti-Pattern: Filter Bubbles

    Modern tools optimize for relevance, which kills serendipity. The recommendation algorithm shows you more of what you already like.

    Serendipity requires a "relevance floor" — things that are *somewhat* related but not obviously so. The sweet spot is: unexpected but recognizable.

    ## Metrics?

    How would you even measure if this works?

    - User-reported "aha" moments?
    - Tracked connections that lead to action?
    - Comparison: planned insights vs. serendipitous ones?

    This is hard. Serendipity is, by definition, not predictable.

    ## Connection to Brainstorming Editor

    The [[Collaborative Brainstorming Editor]] is basically a serendipity engine for groups. Cross-pollinating ideas between teams who wouldn't naturally interact.

    ## Status

    🟡 Conceptual — philosophically interesting, unclear if buildable
    """
  end

  defp vector_embeddings_content do
    """
    # Vector Embeddings for Semantic Search

    Research notes on how modern search actually works.

    ![Word embeddings visualization](https://miro.medium.com/v2/resize:fit:1400/1*n_maCXDAbS6B0zPWSQeP5Q.png)

    ## What Are Embeddings?

    An embedding is a vector (list of numbers) that represents the "meaning" of a piece of text. Similar meanings → similar vectors → close in vector space.

    Example:
    - "dog" → [0.2, 0.8, 0.1, ...]
    - "puppy" → [0.21, 0.79, 0.12, ...] (very close!)
    - "automobile" → [0.9, 0.1, 0.7, ...] (far away)

    ## Why This Matters

    ![Embeddings explained](https://i.ytimg.com/vi/NEreO2zlXDk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCSgXgotClHRhbNfwxiMf3LK2pnDQ)

    Traditional search: exact keyword matching
    Semantic search: meaning matching

    User searches "drone charging solutions"
    Traditional finds: documents containing those words
    Semantic finds: documents about "UAV power management", "battery logistics for flying robots", etc.

    ## Key Models (as of 2025)

    | Model | Dimensions | Notes |
    |-------|------------|-------|
    | OpenAI text-embedding-3-small | 1536 | Good balance of cost/quality |
    | OpenAI text-embedding-3-large | 3072 | Highest quality, expensive |
    | Cohere embed-v3 | 1024 | Strong multilingual |
    | Voyage-2 | 1024 | Good for code |
    | BGE-large | 1024 | Open source option |

    ## Vector Databases

    You need somewhere to store and search vectors:

    - **Pinecone** — managed, easy, expensive at scale
    - **Weaviate** — open source, good hybrid search
    - **Qdrant** — open source, rust-based, fast
    - **pgvector** — PostgreSQL extension, good for simpler cases
    - **Chroma** — lightweight, good for prototyping

    For our use case, pgvector might be enough to start. Keeps everything in one DB.

    ## Chunking Strategies

    You can't embed entire documents (context limits). Need to chunk.

    Options:
    1. Fixed size (500 tokens) — simple, loses context
    2. Paragraph-based — preserves structure
    3. Semantic chunking — split on topic changes
    4. Sliding window — overlapping chunks for continuity

    For brainstorming docs, paragraph-based makes most sense.

    ## Hybrid Search

    Best results often come from combining:
    - Vector similarity (semantic)
    - BM25/keyword (lexical)
    - Metadata filters (dates, authors, tags)

    Reciprocal Rank Fusion (RRF) is a common way to merge rankings.

    ## Relevance Tuning

    Cosine similarity isn't everything. May need:
    - Recency boosting (newer = more relevant)
    - Source weighting (some docs more authoritative)
    - User personalization (what has this user engaged with?)

    ## Implementation Notes

    For the [[Collaborative Brainstorming Editor]]:
    1. Embed all captured ideas at paragraph level
    2. On new input, find top-k similar across all users
    3. Filter by confidence threshold
    4. Present as "potential connections"

    Start with pgvector, migrate to dedicated vector DB if scale demands.

    ## Resources

    - Pinecone's learning center (great tutorials)
    - "Embeddings: What they are and why they matter" — Vicki Boykis
    - OpenAI cookbook on embeddings
    """
  end

  defp graph_vs_document_content do
    """
    # Graph Databases vs Document Stores

    Which is better for a knowledge/idea management system?

    ![Database schema example](https://mhaadi.wordpress.com/wp-content/uploads/2010/10/ssnetwork.gif)

    ## The Question

    Ideas are inherently relational. Idea A connects to Idea B which contradicts Idea C. Feels like a graph!

    But most of our content is... documents. Text with structure. Feels like a document store!

    Which model should win?

    ## Document Store Pros

    - Natural fit for text content
    - Excellent full-text search
    - Simple mental model (files and folders)
    - Mature tooling (Elasticsearch, MongoDB, PostgreSQL JSONB)
    - Easy to get started

    ## Document Store Cons

    - Relationships are second-class citizens
    - "Find all ideas connected to X" requires joins or denormalization
    - Hard to traverse connection chains
    - Schema flexibility can become schema chaos

    ## Graph Database Pros

    - Relationships are first-class
    - Traversal queries are natural (friends of friends, related concepts)
    - Pattern matching (Cypher) is powerful
    - Good for recommendation/discovery
    - Schema enforces structure on connections

    ## Graph Database Cons

    - Steeper learning curve
    - Full-text search usually requires separate system
    - Can be overkill for simple use cases
    - Fewer managed options, more ops overhead
    - Performance can degrade on super-connected nodes

    ## Hybrid Approaches

    ### Option 1: Documents + Link Table
    Store content in documents, maintain explicit links in a join table.
    Simple, but manual.

    ### Option 2: Document DB with Embedded Links
    Store relationships inline in documents. Works for small graphs.
    Gets messy with bidirectional links.

    ### Option 3: Graph for Relationships, Documents for Content
    Neo4j (or similar) as the relationship layer, PostgreSQL for content.
    Two systems to maintain, but each does what it's good at.

    ### Option 4: Multi-Model Database
    Some databases do both now (ArangoDB, SurrealDB, FaunaDB).
    Promising but less mature.

    ## My Current Thinking

    For [[Collaborative Brainstorming Editor]]:

    Start with PostgreSQL + pgvector:
    - Documents table for ideas
    - Vector search for semantic similarity
    - Explicit connections table for user-confirmed links
    - Let the vector similarity BE the implicit graph

    The insight: we don't need to store relationships explicitly if we can compute them on demand via embeddings. The semantic similarity IS the graph.

    Only store explicit links when:
    1. Users confirm a connection
    2. System confidence is very high
    3. Traversal performance matters

    ## Revisit When

    - Number of explicit connections > 100k
    - Need complex traversal queries (3+ hops)
    - Graph algorithms (centrality, clustering) become important

    ## Resources

    - "Graph Databases" by Ian Robinson (O'Reilly)
    - Neo4j documentation on use cases
    - ArangoDB multi-model comparison
    """
  end

  defp attention_mechanisms_content do
    """
    # Attention Mechanisms in Transformers

    Trying to actually understand what "attention" means in AI.

    ![Transformer architecture](https://deepgram.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F10fppwnn%2Fproduction%2F567a80413cbfc7ef5ebd45ccae1e4ee2c0bb3464-1633x1999.png%3Fauto%3Dformat&w=3840&q=75)

    ## The Core Idea

    Attention lets a model focus on different parts of the input when producing each part of the output.

    Classic example: translating "The cat sat on the mat"
    When producing "chat" (French for cat), the model should "attend to" the word "cat" most strongly.

    ## Self-Attention (The Key Innovation)

    In transformers, attention isn't just input→output. Every position attends to every other position in the same sequence.

    "The cat sat on the mat because it was tired"

    What does "it" refer to? The model needs to attend back to "cat" to understand.

    ## The Math (Simplified)

    For each token, we create three vectors:
    - **Query (Q)**: "What am I looking for?"
    - **Key (K)**: "What do I contain?"
    - **Value (V)**: "What do I contribute?"

    Attention weight = softmax(Q · K^T / √d)
    Output = Attention weight × V

    The dot product Q·K measures "how much should I attend to this?"
    Higher dot product = more attention = more influence on output.

    ## Multi-Head Attention

    One attention "head" captures one type of relationship. Multiple heads (usually 8-12) capture different relationship types simultaneously:
    - One head might track syntax
    - Another tracks coreference (pronouns → nouns)
    - Another tracks semantic similarity

    The outputs are concatenated and projected.

    ## Why This Matters for Our Project

    When we embed a user's new idea and search for connections, we're essentially asking: "What should this idea attend to?"

    The embedding model has learned attention patterns. We're using those patterns to find what's relevant across a corpus.

    ## Positional Encoding

    Attention is permutation-invariant (word order doesn't matter to pure attention). Positional encoding adds position information back in.

    For our semantic search, we probably DON'T want position to matter much — we care about meaning, not word order.

    ## The Quadratic Problem

    Self-attention is O(n²) in sequence length. Every token attends to every other token.

    For long documents, this is expensive. Various solutions:
    - Sparse attention (Longformer, BigBird)
    - Linear attention approximations
    - Chunking with cross-chunk attention

    ## Visualization Tools

    - BertViz — visualize attention patterns
    - Attention flows — aggregate attention across layers
    - Probing classifiers — what do attention heads learn?

    ## Connection to Semantic Search

    The attention mechanism learns what's relevant. Embeddings capture the result of all those attention computations into a fixed vector.

    Semantic similarity = "If these texts were in the same context, how much would they attend to each other?"

    ## Next: Read

    - "Attention Is All You Need" (original transformer paper)
    - Jay Alammar's blog (excellent visualizations)
    - Anthropic's work on attention head interpretability
    """
  end

  defp zettelkasten_content do
    """
    # Zettelkasten Method Deep Dive

    The 400-year-old personal knowledge management system that's suddenly trendy.

    ## What Is It?

    Zettelkasten (German: "slip box") is a note-taking method developed by sociologist Niklas Luhmann. He published 70 books and 400+ articles, crediting his productivity to his ~90,000 note card system.

    ## Core Principles

    ### 1. Atomic Notes
    Each note contains ONE idea. Not a topic, not a summary — one specific thought that can stand alone.

    **Bad:** "Thoughts on innovation"

    **Good:** "Innovation bottleneck is synthesis, not ideation"

    ### 2. Links Over Hierarchy
    Notes connect via explicit links, not folders. A note can belong to multiple contexts simultaneously.

    Traditional: Ideas / Innovation / Synthesis.md

    Zettelkasten: Note links to [[Innovation]], [[Synthesis]], [[Bottlenecks]], [[Teaching]]

    ### 3. Emergent Structure
    You don't plan the structure upfront. It emerges from the links you create as you write.

    Start with chaos. Patterns reveal themselves.

    ### 4. Your Own Words
    Never copy-paste. Always rewrite in your words. The act of translation creates understanding.

    ## The Workflow

    1. **Fleeting notes** — quick captures, ideas on the go
    2. **Literature notes** — what you learned from a source
    3. **Permanent notes** — refined, atomic, linked to your existing knowledge

    Most notes never make it to permanent. That's okay — the filtering is part of the value.

    ## Digital Implementations

    - **Obsidian** — local markdown files, great linking
    - **Roam Research** — web-based, outliner style
    - **Logseq** — open source Roam alternative
    - **Notion** — can be adapted, not native
    - **Org-roam** — for Emacs users

    ## What Luhmann Got Right

    > "I don't think everything on my own. It happens mainly within the slip-box."

    The system becomes a thinking partner. You have a conversation with your past self. Ideas develop through iteration, not planning.

    ## Criticisms

    - **Overhead:** All that linking takes time
    - **Perfectionism trap:** Endless refining instead of producing
    - **Cold start:** Empty system provides no value
    - **Discoverability:** With enough notes, how do you find anything?

    ## Connection to Our Project

    [[Collaborative Brainstorming Editor]] is essentially a group Zettelkasten with AI-assisted linking.

    - Atomic ideas (student submissions)
    - Links (AI-surfaced connections)
    - Emergent structure (patterns across cohorts)
    - Own words (students write their own thoughts)

    The AI solves the discoverability problem — you don't have to remember your links, the system finds them.

    ## What I'm Taking From This

    1. Force atomic capture (one idea per entry)
    2. Make linking effortless (or automatic)
    3. Show connection density (more links = more developed idea)
    4. Support serendipitous rediscovery

    ## Resources

    - "How to Take Smart Notes" — Sönke Ahrens
    - Luhmann's original papers (translated)
    - r/Zettelkasten subreddit
    """
  end

  defp musings_ideas_die_content do
    """
    # Why do good ideas die?

    3am thought: If ideas are so valuable, why do so many of them just... evaporate?

    ## The Graveyard

    I've had probably thousands of "good" ideas. Where are they?

    - Some I forgot before I could write down
    - Some I wrote down but never found again
    - Some I found but the context was gone
    - Some I remembered but the moment passed
    - Some I shared but nobody picked them up

    Maybe 1% became anything.

    ## Death by Friction

    Every step between idea and action is a potential graveyard:

    Idea → Capture → Storage → Retrieval → Relevance → Action

    Friction at any step kills it.

    ## The Loneliness Problem

    Ideas alone are fragile. Ideas connected to other ideas have support structures. They reinforce each other. They remind each other to exist.

    A well-linked idea is harder to kill than an orphan.

    ## So What?

    Building tools that reduce friction at every step:
    - Capture: instant, effortless
    - Storage: automatic, organized
    - Retrieval: semantic, not keyword
    - Relevance: context-aware surfacing
    - Connection: proactive linking

    The goal isn't to save every idea. It's to give good ideas a fighting chance.
    """
  end

  defp adjacent_possible_content do
    """
    # The Adjacent Possible

    Stealing this concept from Stuart Kauffman / Steven Johnson.

    ## The Concept

    At any moment, only certain next steps are possible. You can't jump to any arbitrary future — you can only step to what's adjacent to where you are now.

    The "adjacent possible" is the space of all possible next steps given current reality.

    ## Examples

    - You can't invent YouTube before the internet exists
    - You can't have an iPhone before touchscreens, batteries, and cellular networks
    - You can't cure a disease before you understand its mechanism

    Each innovation expands the adjacent possible, enabling new innovations.

    ## Why This Matters for Ideas

    My current ideas define my adjacent possible. I can only think thoughts that connect to what I already know.

    But! If I'm exposed to YOUR ideas, my adjacent possible expands. I can now think thoughts that connect your knowledge to mine.

    ## The Platform Implication

    The [[Collaborative Brainstorming Editor]] is an adjacent-possible-expansion machine.

    Every time it connects two students' ideas, it's expanding both of their adjacent possibles. The connection surface area of the group grows superlinearly.

    n students, each with k ideas = n×k ideas
    But n×k ideas fully connected = (n×k)² possible connections

    Most of those connections are noise. The AI's job is to find the ones that actually expand the adjacent possible in valuable directions.

    ## Open Question

    How do you know which connections expand the adjacent possible vs. which are just noise? Is there a heuristic?

    Maybe: Connections that create surprise but still make sense? The "huh, I never thought of that... but now it's obvious" feeling?
    """
  end

  defp tools_shape_thought_content do
    """
    # Tools Shape Thought

    A meditation on McLuhan, Engelbart, and tool-making.

    ## The Observation

    How I think depends on what tools I use to think with.

    - Pen and paper: linear, slow, permanent
    - Word processor: editable, revisable, medium
    - Outliner: hierarchical, nested, structured
    - Whiteboard: spatial, visual, temporary
    - Conversation: dynamic, responsive, immediate

    I have different thoughts with different tools. Not just different expressions of the same thoughts — actually different thoughts.

    ## McLuhan's Insight

    "We shape our tools, and thereafter our tools shape us."

    The medium isn't neutral. It amplifies certain patterns of thought and suppresses others.

    ## Engelbart's Dream

    Doug Engelbart didn't just want to build tools. He wanted to "augment human intellect." The computer wasn't a calculator — it was a thinking prosthetic.

    He was building tools to have better thoughts, not just to do things faster.

    ## The Risk

    Tools also constrain. Every tool has a grain — it's easy to go with the grain, hard to go against it.

    PowerPoint makes you think in bullets. Twitter makes you think in takes. Spreadsheets make you think in grids.

    What thoughts are we not having because our tools don't support them?

    ## For Our Project

    If I'm building a thinking tool, I'm not just building features. I'm shaping how users will think.

    Questions to ask:
    - What patterns of thought does this enable?
    - What patterns does it suppress?
    - Does the grain of the tool align with how creativity actually works?

    ## The Non-Linear Nature of Ideas

    Ideas don't arrive in order. They arrive in fragments, loops, contradictions. A good thinking tool should accommodate this mess, not force premature structure.

    The structure should emerge, not be imposed.

    See also: [[Zettelkasten Method Deep Dive]]
    """
  end

  defp emergence_rambling_content do
    """
    # Late night rambling on emergence

    Can't sleep. Thinking about emergence.

    ## The Pattern

    Simple rules → complex behavior

    - Ants following pheromones → efficient colony logistics
    - Neurons firing → consciousness
    - People trading → economies
    - Words connecting → meaning

    ## What Makes It Weird

    The complex behavior isn't IN the simple rules. You can't look at an ant and see colony behavior. You can't look at a neuron and see consciousness.

    It only exists at the level of the whole system.

    ## For Ideas

    Maybe good ideas are emergent?

    Individual thoughts are like ants. Simple, not that interesting alone. But when they interact, following some simple rules (association, contradiction, analogy)... sometimes something emerges that wasn't in any of the parts.

    ## The Engineering Problem

    Can you engineer emergence? Or only create conditions where it might happen?

    Ant colonies work because the ants don't know what they're building. They just follow rules. The colony emerges without anyone designing it.

    If we try to "design" creative insight, does that prevent the emergence?

    ## The Platform Question

    Should the [[Collaborative Brainstorming Editor]] try to guide users toward insight? Or just create the conditions and get out of the way?

    Maybe the AI's job isn't to find insights — it's to increase the rate of interactions between ideas, and let insights emerge.

    ## Tentative Conclusion

    Create the conditions. Reduce friction. Increase interaction density. Step back.

    Emergence can't be forced, but it can be fertilized.

    ---

    okay I should sleep now
    """
  end

  defp vannevar_bush_content do
    """
    # What Vannevar Bush Got Right

    Re-reading "As We May Think" (1945). This guy saw the future.

    ![As We May Think - original publication](https://kuenzigbooks.cdn.bibliopolis.com/pictures/18696_7.jpg?auto=webp&v=1302034030)

    ## The Memex

    Bush imagined a desk-sized device that stored all your books, records, and communications on microfilm. You could annotate them, link them, and follow trails of association.

    > "The human mind operates by association. With one item in its grasp, it snaps instantly to the next that is suggested by the association of thoughts."

    He understood that organization-by-hierarchy doesn't match how we think. We think in links.

    ## What He Got Right

    1. **Information overload** — even in 1945, he saw we were drowning
    2. **The linking insight** — associative trails > hierarchical filing
    3. **Personal, not institutional** — your memex, your trails
    4. **Augmentation** — technology extending human capability, not replacing it

    ## What He Got Wrong

    1. **Microfilm** — lol, technology specifics always date badly
    2. **Individual focus** — didn't really imagine networked, social knowledge
    3. **Manual linking** — didn't anticipate that links could be computed

    ## The Gap We're Filling

    Bush imagined you'd create trails manually. Tedious, time-consuming, doesn't scale.

    But now we have semantic embeddings. The links can be discovered automatically. The trails can suggest themselves.

    We can build the memex Bush imagined, but with the hard part (linking) handled by AI.

    ## The Risk Bush Didn't See

    What if the AI-generated links are wrong? Bush's trails were yours — you made them, you trusted them.

    AI links are suggestions from an alien intelligence. They might be brilliant. They might be noise. They need human judgment.

    The human stays in the loop. AI proposes, human disposes.

    ## 80 Years Later

    We're still trying to build the memex. Every note-taking app is an attempt. Wikipedia is a collective memex. The semantic web was supposed to be this.

    Maybe this time we get it right.
    """
  end

  defp meeting_reyes_content do
    """
    # Prof. Reyes - Innovation Lab

    Meeting: Dec 3, 2025
    Location: Engineering Building, 4th floor

    ## Context

    Reyes runs the innovation lab at the engineering school. 200+ students per semester across multiple project teams.

    ## Key Quotes

    > "I remember every student's project from the first five years. Now I can't keep them straight week to week."

    > "The TAs are supposed to cross-pollinate ideas but they don't have time. They're just putting out fires."

    > "Every semester I KNOW there are connections being missed. Teams working on the same underlying problem from different angles, and they never talk."

    ## Pain Points (In Her Words)

    1. **Cognitive overload** — too many teams, too many ideas, can't hold it all
    2. **TA bandwidth** — TAs focused on logistics, not mentorship
    3. **Cross-team blindness** — teams only see their own problem space
    4. **Lost institutional knowledge** — each cohort starts from scratch

    ## What She's Tried

    - Shared Notion workspace → "nobody reads it"
    - Weekly cross-team demos → "takes too long, shallow"
    - TA office hours → "students don't come unless they're stuck"
    - Slack channels → "drowning in noise"

    ## What Would Success Look Like?

    > "If you could just tell me 'these three teams should talk', that would be worth everything. I used to do that intuitively. I can't anymore."

    She doesn't want a platform. She wants her superpower back, at scale.

    ## Next Steps

    - [ ] Send one-pager on [[Collaborative Brainstorming Editor]] concept
    - [ ] Schedule follow-up with her TA team
    - [ ] Ask about running a pilot next semester

    ## My Takeaway

    This is real. The pain is visceral. She's not looking for a tool, she's looking for relief.

    The positioning should be: "We give you back the pattern-matching intuition you used to have, but now works at 200 students."
    """
  end

  defp meeting_david_content do
    """
    # Coffee with David (VC)

    Meeting: Dec 10, 2025
    Location: Riverfront Coffee, downtown

    ## Context

    David is at a small fund focused on ed-tech. Met him at a Westfield event. He asked good questions, wanted to follow up.

    ## His Initial Reaction

    > "Interesting. The 'connection surfacing' angle is different. Most ed-tech pitches are about content delivery or assessment."

    > "Who's the buyer? The instructor doesn't have budget. The university has budget but moves slowly."

    ## Market Questions He Asked

    - How many instructors teach innovation/entrepreneurship?
    - What's the price point they'd pay?
    - Is this a vitamin or a painkiller?
    - Why wouldn't Google/Microsoft just add this to their tools?

    ## My Answers (Rough)

    - Thousands of instructors, growing (entrepreneurship is hot)
    - Started from $0 — maybe $20-50/seat/semester?
    - Painkiller for instructors drowning in large cohorts
    - Big tech optimizes for mass market, not niche pedagogical needs

    ## His Advice

    > "Don't build a platform. Build a feature. Get it embedded in something that's already in the classroom."

    > "Your first sale isn't the software. It's the pilot. Make it stupid easy for an instructor to try it with one cohort."

    > "If it works, you'll have data. Data is your moat."

    ## Interesting Comment

    > "The connection-surfacing problem isn't unique to education. Every organization with distributed knowledge workers has this. R&D labs, consulting firms, even VCs like us."

    Hmm. Is education the wedge, not the market?

    ## Action Items

    - [ ] Think about embed strategy vs. standalone
    - [ ] Design a zero-friction pilot package
    - [ ] Research adjacent markets (corporate innovation, R&D)

    ## My Vibe

    He's not ready to invest but he's intellectually engaged. Good sign. Stay in touch, update him after pilot.
    """
  end

  defp meeting_students_content do
    """
    # Student Feedback Session

    Meeting: Dec 15, 2025
    Location: Zoom (6 students from Reyes's lab)

    ## Setup

    Showed mockups of the [[Collaborative Brainstorming Editor]]. Asked for gut reactions.

    ## What Resonated

    - "I always wonder what other teams are working on but it feels weird to ask"
    - "We definitely reinvent wheels. Last year a team did exactly what we tried to do but we didn't know until the final showcase"
    - "I would actually use this if it wasn't another thing to check"

    ## Concerns Raised

    1. **Privacy / Competition**
       "What if another team steals our idea?" (mentioned 3x)
       → Need to think about selective sharing, privacy controls

    2. **Yet another tool**
       "I already have Slack, Notion, email, Canvas..."
       → Integration is key, or low-frequency high-value touchpoints

    3. **Quality of connections**
       "If it suggests garbage, I'll stop trusting it"
       → Cold start problem, need good initial calibration

    4. **Who sees what**
       "Can instructors see everything? That's weird"
       → Transparency about data visibility

    ## Unexpected Insight

    One student: "I'd want to see connections to PAST projects, not just current ones. Like, what did teams three years ago learn about this problem?"

    Hadn't thought about temporal connections. Historical corpus as context. This is big.

    ## Requested Features

    - Anonymous mode for early-stage ideas
    - "Ignore this connection" button
    - View: what's trending across teams right now?
    - Notification control (don't spam me)

    ## My Takeaway

    Students are interested but skeptical. The trust-building is crucial. Need to start with high-quality, low-frequency suggestions rather than a firehose.

    Also: the competitive dynamics are tricky. Innovation programs sometimes pit teams against each other. How do we encourage sharing in that context?
    """
  end

  defp quick_capture_content do
    """
    # Quick capture - parking lot

    Ideas to process later. No structure, just dumping ground.

    ---

    What if connection suggestions had a "confidence" score? High confidence = notification, low confidence = passive discovery.

    ---

    "Idea velocity" metric — how fast is a concept spreading through the cohort? Could indicate something interesting happening.

    ---

    Integration with Discord? Many student teams use Discord for chat.

    ---

    Could we analyze which connections actually led to conversations? Track outcomes, not just suggestions.

    ---

    Physical whiteboard → photo → auto-extract ideas? Capture from real-world brainstorms.

    ---

    "Office hours" mode where instructors can see all pending connection suggestions at once?

    ---

    Alumni network integration — connect current students to past students who worked on similar problems?

    ---

    Idea: "Connection sparks" — instead of showing full matches, show just a hint. Create curiosity, let users discover.

    ---

    Need a name for this thing. "Mindrian" is the company but what's the product?
    - Synthesizer?
    - Ideaweave?
    - Sparkgraph?
    - Connectionix?

    all terrible

    ---

    Read: "Where Good Ideas Come From" by Steven Johnson. Someone mentioned it.

    ---

    What's the minimum viable pilot? One cohort, one semester, one instructor. Just prove that surfaced connections lead to conversations.
    """
  end

  defp reading_list_content do
    """
    # Reading List

    Books and papers to read. Organized by theme.

    ## Creativity & Innovation

    - [x] "Where Good Ideas Come From" — Steven Johnson
    - [ ] "The Innovator's Dilemma" — Clayton Christensen
    - [ ] "Creativity, Inc." — Ed Catmull
    - [ ] "Range" — David Epstein
    - [x] "A Technique for Producing Ideas" — James Webb Young

    ## Knowledge Management

    - [x] "How to Take Smart Notes" — Sönke Ahrens
    - [ ] "The Organized Mind" — Daniel Levitin
    - [ ] "Building a Second Brain" — Tiago Forte
    - [x] "As We May Think" — Vannevar Bush (essay)

    ## AI / Machine Learning

    - [x] "Attention Is All You Need" — Vaswani et al.
    - [ ] "The Bitter Lesson" — Rich Sutton (essay)
    - [ ] "Scaling Laws for Neural Language Models" — Kaplan et al.
    - [ ] "Constitutional AI" — Anthropic

    ## Complexity & Emergence

    - [ ] "Complexity: A Guided Tour" — Melanie Mitchell
    - [ ] "The Origins of Order" — Stuart Kauffman
    - [ ] "Emergence" — Steven Johnson
    - [ ] "Gödel, Escher, Bach" — Douglas Hofstadter (re-read)

    ## Education & Learning

    - [ ] "Make It Stick" — Peter Brown
    - [ ] "A Mind for Numbers" — Barbara Oakley
    - [ ] "Teaching to Transgress" — bell hooks

    ## Product / Startup

    - [x] "The Mom Test" — Rob Fitzpatrick
    - [ ] "Inspired" — Marty Cagan
    - [ ] "The Lean Startup" — Eric Ries
    - [ ] "Zero to One" — Peter Thiel

    ---

    ## Papers (Priority)

    - [ ] "Retrieval-Augmented Generation" — Meta AI
    - [ ] "HyDE: Hypothetical Document Embeddings" — Gao et al.
    - [ ] "Lost in the Middle" — Liu et al. (context length issues)

    ---

    Last updated: Dec 2025
    """
  end

  @doc """
  Backfill content_text for existing documents.

  Run in production via:
    bin/mindrian eval "Mindrian.Release.backfill_document_content()"
  """
  def backfill_document_content do
    load_app()

    {:ok, _, _} =
      Ecto.Migrator.with_repo(Repo, fn _repo ->
        backfill_document_content!()
      end)

    :ok
  end

  @doc """
  Backfill content_text when repo is already started.
  """
  def backfill_document_content! do
    documents =
      from(d in Document, where: is_nil(d.content_text))
      |> Repo.all()

    total = length(documents)
    IO.puts("Backfilling #{total} documents...")

    documents
    |> Enum.with_index(1)
    |> Enum.each(fn {document, index} ->
      ydoc = YjsPersistence.get_y_doc(document.id)
      content_text = YjsPersistence.extract_full_text(ydoc)

      document
      |> Document.content_changeset(%{content_text: content_text})
      |> Repo.update!()

      IO.puts("  [#{index}/#{total}] #{document.id}")
    end)

    IO.puts("Done!")
  end

  def migrate do
    load_app()

    for repo <- repos() do
      {:ok, _, _} = Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :up, all: true))
    end
  end

  def rollback(repo, version) do
    load_app()
    {:ok, _, _} = Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :down, to: version))
  end

  defp repos do
    Application.fetch_env!(@app, :ecto_repos)
  end

  defp load_app do
    # Many platforms require SSL when connecting to the database
    Application.ensure_all_started(:ssl)
    Application.ensure_loaded(@app)
  end
end
