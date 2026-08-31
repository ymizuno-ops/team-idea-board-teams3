import { useEffect, useState } from "react";

type VoteButtonProps = {
  ideaId: string;
  initialVotes: number;
  ideaTitle: string;
};

const votedStorageKey = (ideaId: string) => `kaizen-board:voted:${ideaId}`;

export function VoteButton({ ideaId, initialVotes, ideaTitle }: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const voted = window.localStorage.getItem(votedStorageKey(ideaId)) !== null;
    setHasVoted(voted);
    if (voted) {
      setVotes(initialVotes + 1);
    }
  }, [ideaId, initialVotes]);

  const castVote = () => {
    setVotes((currentVotes) => currentVotes + 1);
    setHasVoted(true);
    window.localStorage.setItem(votedStorageKey(ideaId), "1");
  };

  const cancelVote = () => {
    setVotes((currentVotes) => currentVotes - 1);
    setHasVoted(false);
    window.localStorage.removeItem(votedStorageKey(ideaId));
  };

  return (
    <button
      type="button"
      className={hasVoted ? "vote-count vote-count-voted" : "vote-count"}
      aria-pressed={hasVoted}
      aria-label={hasVoted ? `${ideaTitle}の投票を取り消す` : `${ideaTitle}へ投票する`}
      onClick={hasVoted ? cancelVote : castVote}
    >
      <strong>{votes}</strong>
      <small>{hasVoted ? "取消" : "票"}</small>
    </button>
  );
}
