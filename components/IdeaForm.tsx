"use client";

import { useState, type FormEvent } from "react";
import { categories, type Category, type IdeaDraft } from "@/types/idea";

// ==========================================
// 定数定義（受け入れ条件の数値・文言を一箇所へ集約）
// ==========================================

// タイトルの下限・上限。Ticketの受け入れ条件「3文字以上40文字以内」を表す。
const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 40;

// 入力不備のときに利用者へ見せる理由。読み上げ順を揃えるため定数化する。
const ERROR_TITLE_TOO_SHORT = `タイトルは${TITLE_MIN_LENGTH}文字以上で入力してください`;
const ERROR_TITLE_TOO_LONG = `タイトルは${TITLE_MAX_LENGTH}文字以内で入力してください`;
const ERROR_DESCRIPTION_REQUIRED = "背景・困りごとを入力してください";

type IdeaFormProps = {
  onAdd: (idea: IdeaDraft) => void;
};

// 新しい改善アイデアを入力してボードへ追加するためのフォーム。
// 保存先を持たないため、入力値の検証と親への受け渡しだけを担当する。
export function IdeaForm({ onAdd }: IdeaFormProps) {
  // ==========================================
  // 状態（フォームの入力値と、直近の入力不備の理由）
  // ==========================================
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>(categories[0]);
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 残り何文字入力できるか。maxLength と同じ基準にするため生の文字数で数える。
  const remainingCount = TITLE_MAX_LENGTH - title.length;

  // ==========================================
  // 送信処理（検証に通ったときだけ onAdd を呼び、入力欄を空へ戻す）
  // ==========================================
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (trimmedTitle.length < TITLE_MIN_LENGTH) {
      setErrorMessage(ERROR_TITLE_TOO_SHORT);
      return;
    }

    if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      setErrorMessage(ERROR_TITLE_TOO_LONG);
      return;
    }

    if (trimmedDescription.length === 0) {
      setErrorMessage(ERROR_DESCRIPTION_REQUIRED);
      return;
    }

    onAdd({
      title: trimmedTitle,
      description: trimmedDescription,
      category,
    });

    setTitle("");
    setCategory(categories[0]);
    setDescription("");
    setErrorMessage(null);
  };

  // ==========================================
  // 画面
  // ==========================================
  return (
    <div className="idea-form">
      <h2 id="idea-form-heading">新しいアイデアを追加</h2>

      <form onSubmit={handleSubmit} aria-labelledby="idea-form-heading" noValidate>
        <div className="idea-form-field">
          <label htmlFor="idea-form-title">タイトル</label>
          <input
            id="idea-form-title"
            name="title"
            type="text"
            value={title}
            maxLength={TITLE_MAX_LENGTH}
            onChange={(event) => setTitle(event.target.value)}
            aria-describedby="idea-form-title-count"
          />
          <p id="idea-form-title-count" className="idea-form-count">
            {`残り ${remainingCount} 文字`}
          </p>
        </div>

        <div className="idea-form-field">
          <label htmlFor="idea-form-category">カテゴリ</label>
          <select
            id="idea-form-category"
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value as Category)}
          >
            {categories.map((categoryOption) => (
              <option key={categoryOption} value={categoryOption}>
                {categoryOption}
              </option>
            ))}
          </select>
        </div>

        <div className="idea-form-field">
          <label htmlFor="idea-form-description">背景・困りごと</label>
          <textarea
            id="idea-form-description"
            name="description"
            value={description}
            rows={4}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        {errorMessage ? (
          <p className="idea-form-error" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <button type="submit">追加する</button>
      </form>
    </div>
  );
}
