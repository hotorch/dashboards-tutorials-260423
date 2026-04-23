import type { EmbargoStatus } from "../lib/types";

export const STATUS_LABEL: Record<EmbargoStatus, string> = {
  requested: "요청됨",
  in_progress: "진행중",
  completed: "완료",
};

export const STATUS_DOT: Record<EmbargoStatus, string> = {
  requested: "bg-zinc-400",
  in_progress: "bg-indigo-400",
  completed: "bg-emerald-400",
};

export const STATUS_BADGE: Record<EmbargoStatus, string> = {
  requested: "bg-zinc-500/10 text-zinc-300 ring-zinc-500/25",
  in_progress: "bg-indigo-500/15 text-indigo-300 ring-indigo-500/35",
  completed: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/25",
};

export const STATUS_OPTIONS: { value: EmbargoStatus; label: string }[] = [
  { value: "requested", label: "요청됨" },
  { value: "in_progress", label: "진행중" },
  { value: "completed", label: "완료" },
];
