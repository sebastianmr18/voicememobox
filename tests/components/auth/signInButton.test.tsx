import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SignInButton } from "@/components/auth/signInButton";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

const mockSignIn = require("next-auth/react").signIn;

jest.mock("lucide-react", () => ({
  Loader2: () => <svg data-testid="icon-loader" />,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: any;
  }) => <button {...props}>{children}</button>,
}));

describe("<SignInButton />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. Test del estado de renderizado por defecto
  it('renders the default state with "Continuar con Google" button and is enabled', () => {
    render(<SignInButton />);
    const button = screen.getByRole("button", {
      name: /Continuar con Google/i,
    });

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(screen.queryByTestId("icon-loader")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Error al iniciar sesión/i),
    ).not.toBeInTheDocument();
  });

  // 2. Test del estado de carga (loading)
  it("shows loading state when the button is clicked", () => {
    render(<SignInButton />);
    const button = screen.getByRole("button", {
      name: /Continuar con Google/i,
    });

    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(screen.getByText("Iniciando sesión...")).toBeInTheDocument();
    expect(screen.getByTestId("icon-loader")).toBeInTheDocument();
  });

  // 3. Test de interacción y éxito en la llamada a la API
  it("calls the next-auth signIn function with correct parameters on click", async () => {
    mockSignIn.mockResolvedValueOnce({});
    render(<SignInButton />);

    const button = screen.getByRole("button", {
      name: /Continuar con Google/i,
    });
    fireEvent.click(button);

    expect(mockSignIn).toHaveBeenCalledTimes(1);
    expect(mockSignIn).toHaveBeenCalledWith("google", { callbackUrl: "/" });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
      expect(screen.getByText("Continuar con Google")).toBeInTheDocument();
      expect(screen.queryByText("Iniciando sesión...")).not.toBeInTheDocument();
    });
  });

  // 4. Test del estado de error (edge case)
  it("shows an error message if the sign-in process fails", async () => {
    mockSignIn.mockRejectedValueOnce(new Error("Test Error"));
    render(<SignInButton />);

    const button = screen.getByRole("button", {
      name: /Continuar con Google/i,
    });
    fireEvent.click(button);

    expect(screen.getByText("Iniciando sesión...")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("Error al iniciar sesión con Google"),
      ).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  });
});
