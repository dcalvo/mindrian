defmodule Mindrian.Repo.Migrations.AddContentSearchToDocuments do
  use Ecto.Migration

  def up do
    alter table(:documents) do
      add :content_text, :text
      add :content_tsvector, :tsvector
    end

    create index(:documents, [:content_tsvector], using: :gin)

    # Auto-update tsvector when content_text or title changes
    execute """
    CREATE FUNCTION documents_tsvector_trigger() RETURNS trigger AS $$
    BEGIN
      NEW.content_tsvector := to_tsvector('english',
        COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content_text, ''));
      RETURN NEW;
    END $$ LANGUAGE plpgsql;
    """

    execute """
    CREATE TRIGGER documents_tsvector_update BEFORE INSERT OR UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION documents_tsvector_trigger();
    """
  end

  def down do
    execute "DROP TRIGGER IF EXISTS documents_tsvector_update ON documents"
    execute "DROP FUNCTION IF EXISTS documents_tsvector_trigger()"

    alter table(:documents) do
      remove :content_tsvector
      remove :content_text
    end
  end
end
