import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IdeaBoard } from "@/components/IdeaBoard";

describe("スターターアプリ", () => {
  it("初期アイデア3件と現在の票数だけを表示する", () => {
    render(<IdeaBoard />);

    expect(screen.getByText("会議メモを同じ形式で残したい")).toBeTruthy();
    expect(screen.getByText("問い合わせの引き継ぎ漏れを減らしたい")).toBeTruthy();
    expect(screen.getByText("集中時間をチームで共有したい")).toBeTruthy();
    expect(screen.getByRole("button", { name: "会議メモを同じ形式で残したいへ投票する" })).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "問い合わせの引き継ぎ漏れを減らしたいへ投票する" }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "集中時間をチームで共有したいへ投票する" })).toBeTruthy();
    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByText(/Ticket [A-D]/)).toBeNull();
  });
});
