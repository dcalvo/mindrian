defmodule Mindrian.Repo do
  use Ecto.Repo,
    otp_app: :mindrian,
    adapter: Ecto.Adapters.Postgres
end
