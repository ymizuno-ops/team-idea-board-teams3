import { useState } from "react";

type VoteButtonProps = {
  initialVotes: number;
  ideaTitle: string;
};

export function VoteButton({ initialVotes, ideaTitle }: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);

  return (
    <div className="vote-block">
      <div className="vote-count" aria-live="polite">
        <strong>{votes}</strong>
        <small>票</small>
      </div>
      <button
        type="button"
        className="vote-button"
        aria-label={`${ideaTitle}へ投票する`}
        onClick={() => setVotes((currentVotes) => currentVotes + 1)}
      >
        投票する
      </button>
    </div>
  );
}
