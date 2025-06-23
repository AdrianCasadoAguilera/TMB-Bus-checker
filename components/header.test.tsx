import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Header from "./header";

describe("Header", () => {
  test("renders title correctly", () => {
    render(<Header />);
    expect(screen.getByText("BCN Bus times")).toBeInTheDocument();
  });
});
