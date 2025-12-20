import Config

# Configures Swoosh API Client
config :swoosh, api_client: Swoosh.ApiClient.Req

# Disable Swoosh Local Memory Storage
config :swoosh, local: false

# Do not print debug messages in production
config :logger, level: :info

# Use real Agno driver in production
config :mindrian, :chat_driver, Mindrian.Chat.Drivers.AgnoDriver

# Runtime production configuration, including reading
# of environment variables, is done on config/runtime.exs.
