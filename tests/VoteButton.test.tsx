import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { VoteButton } from "@/components/VoteButton";

describe("Ticket A: 投票ボタン", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("投票ボタンを押すと、表示される票数が1増える", async () => {
    const user = userEvent.setup();
    render(<VoteButton ideaId="idea-003" initialVotes={5} ideaTitle="集中時間をチームで共有したい" />);

    await user.click(screen.getByRole("button", { name: "集中時間をチームで共有したいへ投票する" }));

    expect(screen.getByText("6")).toBeTruthy();
  });

  it("投票後はボタンが取り消しボタンに変わり、押すと票数が1減って元に戻る", async () => {
    const user = userEvent.setup();
    render(<VoteButton ideaId="idea-003" initialVotes={5} ideaTitle="集中時間をチームで共有したい" />);

    await user.click(screen.getByRole("button", { name: "集中時間をチームで共有したいへ投票する" }));
    expect(screen.getByText("6")).toBeTruthy();

    const cancelButton = screen.getByRole("button", {
      name: "集中時間をチームで共有したいの投票を取り消す",
    });
    await user.click(cancelButton);

    expect(screen.getByText("5")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "集中時間をチームで共有したいへ投票する" }),
    ).toBeTruthy();
  });

  it("投票ボタンをキーボードで操作できる", async () => {
    const user = userEvent.setup();
    render(<VoteButton ideaId="idea-003" initialVotes={5} ideaTitle="集中時間をチームで共有したい" />);

    const button = screen.getByRole("button", { name: "集中時間をチームで共有したいへ投票する" });
    button.focus();
    await user.keyboard("{Enter}");

    expect(screen.getByText("6")).toBeTruthy();
  });

  it("ボタンから、どのアイデアへ投票するかを読み上げで判別できる", () => {
    render(<VoteButton ideaId="idea-001" initialVotes={3} ideaTitle="会議メモを同じ形式で残したい" />);

    expect(
      screen.getByRole("button", { name: "会議メモを同じ形式で残したいへ投票する" }),
    ).toBeTruthy();
  });

  it("投票済みの状態はブラウザを閉じても保持される", async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <VoteButton ideaId="idea-002" initialVotes={12} ideaTitle="問い合わせの引き継ぎ漏れを減らしたい" />,
    );

    await user.click(screen.getByRole("button", { name: "問い合わせの引き継ぎ漏れを減らしたいへ投票する" }));
    unmount();

    render(
      <VoteButton ideaId="idea-002" initialVotes={12} ideaTitle="問い合わせの引き継ぎ漏れを減らしたい" />,
    );

    expect(
      await screen.findByRole("button", { name: "問い合わせの引き継ぎ漏れを減らしたいの投票を取り消す" }),
    ).toBeTruthy();
    expect(screen.getByText("13")).toBeTruthy();
  });
});
