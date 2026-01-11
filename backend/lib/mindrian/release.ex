defmodule Mindrian.Release do
  @moduledoc """
  Used for executing DB release tasks when run in production without Mix
  installed.
  """
  @app :mindrian

  import Ecto.Query
  alias Mindrian.Accounts
  alias Mindrian.Accounts.User
  alias Mindrian.Collaboration.YjsPersistence
  alias Mindrian.Documents.Document
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
