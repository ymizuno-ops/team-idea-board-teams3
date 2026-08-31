import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { IdeaBoard } from "@/components/IdeaBoard";
import { IdeaForm } from "@/components/IdeaForm";

describe("Ticket C: アイデア追加フォーム", () => {
  it("有効な入力を送信するとonAddへ入力内容を渡す", async () => {
    const user = userEvent.setup();
    const handleAdd = vi.fn();
    render(<IdeaForm onAdd={handleAdd} />);

    await user.type(screen.getByLabelText("タイトル"), "会議の議事録を残したい");
    await user.selectOptions(screen.getByLabelText("カテゴリ"), "顧客対応");
    await user.type(
      screen.getByLabelText("背景・困りごと"),
      "毎回フォーマットがばらばらです",
    );
    await user.click(screen.getByRole("button", { name: "追加する" }));

    expect(handleAdd).toHaveBeenCalledWith({
      title: "会議の議事録を残したい",
      category: "顧客対応",
      description: "毎回フォーマットがばらばらです",
    });
  });

  it("タイトルが3文字未満の場合は理由を表示して追加しない", async () => {
    const user = userEvent.setup();
    const handleAdd = vi.fn();
    render(<IdeaForm onAdd={handleAdd} />);

    await user.type(screen.getByLabelText("タイトル"), "議事");
    await user.type(screen.getByLabelText("背景・困りごと"), "説明文です");
    await user.click(screen.getByRole("button", { name: "追加する" }));

    expect(screen.getByRole("alert").textContent).toBe(
      "タイトルは3文字以上で入力してください",
    );
    expect(handleAdd).not.toHaveBeenCalled();
  });

  it("背景・困りごとが空の場合は理由を表示して追加しない", async () => {
    const user = userEvent.setup();
    const handleAdd = vi.fn();
    render(<IdeaForm onAdd={handleAdd} />);

    await user.type(screen.getByLabelText("タイトル"), "有効なタイトル");
    await user.click(screen.getByRole("button", { name: "追加する" }));

    expect(screen.getByRole("alert").textContent).toBe(
      "背景・困りごとを入力してください",
    );
    expect(handleAdd).not.toHaveBeenCalled();
  });

  it("タイトルの残り文字数を表示する", async () => {
    const user = userEvent.setup();
    render(<IdeaForm onAdd={vi.fn()} />);

    expect(screen.getByText("残り 40 文字")).toBeTruthy();

    await user.type(screen.getByLabelText("タイトル"), "こんにちは");

    expect(screen.getByText("残り 35 文字")).toBeTruthy();
  });

  it("タイトルは40文字を超えて入力できない", async () => {
    const user = userEvent.setup();
    render(<IdeaForm onAdd={vi.fn()} />);

    const titleInput = screen.getByLabelText("タイトル") as HTMLInputElement;
    await user.type(titleInput, "あ".repeat(45));

    expect(titleInput.value).toBe("あ".repeat(40));
    expect(screen.getByText("残り 0 文字")).toBeTruthy();
  });

  it("送信に成功すると入力欄が空に戻る", async () => {
    const user = userEvent.setup();
    render(<IdeaForm onAdd={vi.fn()} />);

    const titleInput = screen.getByLabelText("タイトル") as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(
      "背景・困りごと",
    ) as HTMLTextAreaElement;

    await user.type(titleInput, "会議の議事録を残したい");
    await user.type(descriptionInput, "毎回ばらばらです");
    await user.click(screen.getByRole("button", { name: "追加する" }));

    expect(titleInput.value).toBe("");
    expect(descriptionInput.value).toBe("");
  });
});

describe("Ticket C: ボードへの反映", () => {
  it("有効な入力を送信すると新しいカードが一覧の先頭に追加される", async () => {
    const user = userEvent.setup();
    render(<IdeaBoard />);

    await user.type(screen.getByLabelText("タイトル"), "新しい改善アイデア");
    await user.type(
      screen.getByLabelText("背景・困りごと"),
      "困っていることの説明です",
    );
    await user.click(screen.getByRole("button", { name: "追加する" }));

    const ideaTitles = screen.getAllByRole("heading", { level: 3 });
    expect(ideaTitles).toHaveLength(4);
    expect(ideaTitles[0].textContent).toBe("新しい改善アイデア");
  });
});
