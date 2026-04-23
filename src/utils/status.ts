import type { EmbargoStatus } from "../lib/types";

export const STATUS_LABEL: Record<EmbargoStatus, string> = {
  requested: "요청됨",
  in_progress: "진행중",
  completed: "완료",
};

export const STATUS_DOT: Record<EmbargoStatus, string> = {
  requested: "bg-slate-400",
  in_progress: "bg-blue-500",
  completed: "bg-emerald-500",
};

export const STATUS_BADGE: Record<EmbargoStatus, string> = {
  requested: "bg-slate-100 text-slate-700 ring-slate-200",
  in_progress: "bg-blue-50 text-blue-700 ring-blue-100",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
};

export const STATUS_OPTIONS: { value: EmbargoStatus; label: string }[] = [
  { value: "requested", label: "요청됨" },
  { value: "in_progress", label: "진행중" },
  { value: "completed", label: "완료" },
];
