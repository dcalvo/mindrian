# Exclude integration tests by default (run with --include integration)
ExUnit.start(exclude: [:integration])
Ecto.Adapters.SQL.Sandbox.mode(Mindrian.Repo, :manual)
