defmodule MindrianWeb.ChannelCase do
  @moduledoc """
  Test case for channel tests.

  Sets up database sandbox. Tests should explicitly set up socket connection.

  ## Usage

      use MindrianWeb.ChannelCase

      setup do
        user = user_fixture()
        token = Phoenix.Token.sign(@endpoint, "user socket", user.id)
        {:ok, socket} = connect(MindrianWeb.UserSocket, %{"token" => token})
        %{socket: socket, user: user}
      end

      test "joining chat channel", %{socket: socket} do
        {:ok, _, socket} = subscribe_and_join(socket, ChatChannel, "chat:session-123")
        ...
      end
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      import Phoenix.ChannelTest
      import Mindrian.AccountsFixtures
      @endpoint MindrianWeb.Endpoint
    end
  end

  setup tags do
    Mindrian.DataCase.setup_sandbox(tags)
    :ok
  end
end
