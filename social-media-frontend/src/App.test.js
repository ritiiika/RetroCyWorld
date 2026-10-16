import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the RetroCyWorld login screen", () => {
  window.history.pushState({}, "", "/");
  render(<App />);
  expect(screen.getByText(/RETROCYWORLD_LOGIN\.EXE/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
});
