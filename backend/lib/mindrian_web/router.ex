defmodule MindrianWeb.Router do
  use MindrianWeb, :router

  import MindrianWeb.UserAuth

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {MindrianWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_current_scope_for_user
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
    plug :fetch_current_scope_for_user
  end

  pipeline :localhost_only do
    plug MindrianWeb.Plugs.RequireLocalhost
  end

  # SPA pipeline - no layout wrapping
  pipeline :spa do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_current_scope_for_user
  end

  # API routes (unauthenticated)
  scope "/api", MindrianWeb.API do
    pipe_through :api

    get "/health", HealthController, :index
    get "/me", UserController, :me
  end

  # API routes (authenticated)
  scope "/api", MindrianWeb.API do
    pipe_through [:api, :require_authenticated_user]

    resources "/documents", DocumentController, except: [:new, :edit]
    put "/documents/:id/move", DocumentController, :move
    resources "/workspaces", WorkspaceController, except: [:new, :edit]
  end

  # Agent tool API routes - localhost only, called by Agno microservice
  scope "/api/agent/tools", MindrianWeb.API do
    pipe_through [:api, :localhost_only]

    post "/list_documents", AgentToolsController, :list_documents
    post "/search_documents", AgentToolsController, :search_documents
    post "/create_document", AgentToolsController, :create_document
    post "/read_document", AgentToolsController, :read_document
    post "/edit_document", AgentToolsController, :edit_document
    post "/delete_document", AgentToolsController, :delete_document
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:mindrian, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: MindrianWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end

    # Dev-only API login for CLI tools (no CSRF required)
    scope "/dev/api", MindrianWeb.API do
      pipe_through :api

      post "/login", DevLoginController, :create
    end
  end

  ## Authentication routes

  scope "/", MindrianWeb do
    pipe_through [:browser, :redirect_if_user_is_authenticated]

    get "/users/register", UserRegistrationController, :new
    post "/users/register", UserRegistrationController, :create
  end

  scope "/", MindrianWeb do
    pipe_through [:browser, :require_authenticated_user]

    get "/users/settings", UserSettingsController, :edit
    put "/users/settings", UserSettingsController, :update
    get "/users/settings/confirm-email/:token", UserSettingsController, :confirm_email
  end

  scope "/", MindrianWeb do
    pipe_through [:browser]

    get "/users/log-in", UserSessionController, :new
    get "/users/log-in/:token", UserSessionController, :confirm
    post "/users/log-in", UserSessionController, :create
    delete "/users/log-out", UserSessionController, :delete
    get "/users/log-out", UserSessionController, :logout
  end

  # SPA catch-all route - must be last
  scope "/", MindrianWeb do
    pipe_through :spa

    get "/*path", SPAController, :index
  end
end
