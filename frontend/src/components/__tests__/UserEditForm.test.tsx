import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { MockLink } from "@apollo/client/testing";
import { UserEditForm } from "../UserEditForm";
import { UPDATE_MY_PROFILE } from "../../graphql/operations";
import type { User } from "../../types/user.types";

vi.mock("lucide-react", () => ({
  Camera: () => <span data-testid="icon-camera" />,
  User: () => <span data-testid="icon-user" />,
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockUser: User = {
  id: 1,
  firstname: "Cindy",
  lastname: "Grisez",
  email: "cindy@test.com",
  address: "119 Boulevard Yves Farge",
  postalCode: "69007",
  city: "Lyon",
};

type Mock = {
  request: { query: typeof UPDATE_MY_PROFILE; variables: Record<string, unknown> };
  result: { data: Record<string, unknown> };
  delay?: number;
};

function createClient(mocks: Mock[] = []) {
  return new ApolloClient({
    link: new MockLink(mocks, true),
    cache: new InMemoryCache({ addTypePolicies: false } as never),
  });
}

function renderForm(
  mocks: Mock[] = [],
  onCancel = vi.fn(),
  onSuccess = vi.fn(),
) {
  const client = createClient(mocks);
  return {
    onCancel,
    onSuccess,
    ...render(
      <ApolloProvider client={client}>
        <UserEditForm user={mockUser} onCancel={onCancel} onSuccess={onSuccess} />
      </ApolloProvider>,
    ),
  };
}

describe("UserEditForm", () => {
  it("should render all fields with pre-filled values", () => {
    renderForm();

    expect(screen.getByDisplayValue("Cindy")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Grisez")).toBeInTheDocument();
    expect(screen.getByDisplayValue("cindy@test.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("119 Boulevard Yves Farge")).toBeInTheDocument();
    expect(screen.getByDisplayValue("69007")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Lyon")).toBeInTheDocument();
  });

  it("should update field value on user input", async () => {
    const user = userEvent.setup();
    renderForm();

    const firstnameInput = screen.getByDisplayValue("Cindy");
    await user.clear(firstnameInput);
    await user.type(firstnameInput, "Alice");

    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
  });

  it("should call onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    renderForm([], onCancel);

    await user.click(screen.getByText("Annuler"));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("should call mutation and onSuccess on form submit", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    const updatedUser = { ...mockUser, firstname: "Alice" };

    const mocks: Mock[] = [
      {
        request: {
          query: UPDATE_MY_PROFILE,
          variables: {
            data: {
              firstname: "Alice",
              lastname: "Grisez",
              email: "cindy@test.com",
              address: "119 Boulevard Yves Farge",
              postalCode: "69007",
              city: "Lyon",
            },
          },
        },
        result: {
          data: { updateMyProfile: updatedUser },
        },
      },
    ];

    renderForm(mocks, vi.fn(), onSuccess);

    const firstnameInput = screen.getByDisplayValue("Cindy");
    await user.clear(firstnameInput);
    await user.type(firstnameInput, "Alice");

    await user.click(screen.getByText("Enregistrer"));

    await vi.waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it("should show loading state during submission", async () => {
    const user = userEvent.setup();

    const mocks: Mock[] = [
      {
        request: {
          query: UPDATE_MY_PROFILE,
          variables: {
            data: {
              firstname: "Cindy",
              lastname: "Grisez",
              email: "cindy@test.com",
              address: "119 Boulevard Yves Farge",
              postalCode: "69007",
              city: "Lyon",
            },
          },
        },
        result: {
          data: { updateMyProfile: mockUser },
        },
        delay: 200,
      },
    ];

    renderForm(mocks);

    await user.click(screen.getByText("Enregistrer"));

    expect(await screen.findByText("Enregistrement...")).toBeInTheDocument();
  });
});
