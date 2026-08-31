import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CategoryFilter } from "@/components/CategoryFilter";
import { IdeaBoard } from "@/components/IdeaBoard";
import { categories } from "@/types/idea";

describe("Ticket B: カテゴリ絞り込み", () => {
  it("カテゴリを選ぶとonChangeへ選択値を渡す", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CategoryFilter categories={categories} activeCategory="すべて" onChange={onChange} />,
    );

    await user.click(screen.getByRole("button", { name: "顧客対応" }));

    expect(onChange).toHaveBeenCalledWith("顧客対応");
  });

  it("選択中のカテゴリをaria-pressedで判別できる", () => {
    render(
      <CategoryFilter
        categories={categories}
        activeCategory="業務効率化"
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByRole("button", { name: "業務効率化" }).getAttribute("aria-pressed"),
    ).toBe("true");
    expect(screen.getByRole("button", { name: "すべて" }).getAttribute("aria-pressed")).toBe(
      "false",
    );
    expect(
      screen.getByRole("button", { name: "顧客対応" }).getAttribute("aria-pressed"),
    ).toBe("false");
  });
});

describe("Ticket B: カテゴリ絞り込み（IdeaBoardとの統合）", () => {
  it("カテゴリを選ぶと、そのカテゴリのアイデアだけが表示される", async () => {
    const user = userEvent.setup();
    render(<IdeaBoard />);

    await user.click(screen.getByRole("button", { name: "顧客対応" }));

    expect(screen.getByText("問い合わせの引き継ぎ漏れを減らしたい")).toBeTruthy();
    expect(screen.queryByText("会議メモを同じ形式で残したい")).toBeNull();
    expect(screen.queryByText("集中時間をチームで共有したい")).toBeNull();
  });

  it("「すべて」を選ぶと、すべてのアイデアへ戻る", async () => {
    const user = userEvent.setup();
    render(<IdeaBoard />);

    await user.click(screen.getByRole("button", { name: "顧客対応" }));
    await user.click(screen.getByRole("button", { name: "すべて" }));

    expect(screen.getByText("会議メモを同じ形式で残したい")).toBeTruthy();
    expect(screen.getByText("問い合わせの引き継ぎ漏れを減らしたい")).toBeTruthy();
    expect(screen.getByText("集中時間をチームで共有したい")).toBeTruthy();
  });
});
