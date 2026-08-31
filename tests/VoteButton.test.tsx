import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { VoteButton } from "@/components/VoteButton";

describe("Ticket A: 投票ボタン", () => {
  it("投票ボタンを押すと、表示される票数が1増える", async () => {
    const user = userEvent.setup();
    render(<VoteButton initialVotes={5} ideaTitle="集中時間をチームで共有したい" />);

    await user.click(screen.getByRole("button", { name: "集中時間をチームで共有したいへ投票する" }));

    expect(screen.getByText("6")).toBeTruthy();
  });

  it("続けて押した場合も、押した回数だけ増える", async () => {
    const user = userEvent.setup();
    render(<VoteButton initialVotes={5} ideaTitle="集中時間をチームで共有したい" />);

    const button = screen.getByRole("button", { name: "集中時間をチームで共有したいへ投票する" });
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(screen.getByText("8")).toBeTruthy();
  });

  it("投票ボタンをキーボードで操作できる", async () => {
    const user = userEvent.setup();
    render(<VoteButton initialVotes={5} ideaTitle="集中時間をチームで共有したい" />);

    const button = screen.getByRole("button", { name: "集中時間をチームで共有したいへ投票する" });
    button.focus();
    await user.keyboard("{Enter}");

    expect(screen.getByText("6")).toBeTruthy();
  });

  it("ボタンから、どのアイデアへ投票するかを読み上げで判別できる", () => {
    render(<VoteButton initialVotes={3} ideaTitle="会議メモを同じ形式で残したい" />);

    expect(
      screen.getByRole("button", { name: "会議メモを同じ形式で残したいへ投票する" }),
    ).toBeTruthy();
  });
});
