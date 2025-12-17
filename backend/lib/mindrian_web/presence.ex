defmodule MindrianWeb.Presence do
  use Phoenix.Presence,
    otp_app: :mindrian,
    pubsub_server: Mindrian.PubSub
end
