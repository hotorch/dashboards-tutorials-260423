import type { EmbargoStatus } from "../lib/types";

export const STATUS_LABEL: Record<EmbargoStatus, string> = {
  requested: "요청됨",
  in_progress: "진행중",
  completed: "완료",
};

export const STATUS_DOT: Record<EmbargoStatus, string> = {
  requested: "bg-red-500",
  in_progress: "bg-amber-500",
  completed: "bg-emerald-500",
};

export const STATUS_BADGE: Record<EmbargoStatus, string> = {
  requested: "bg-red-50 text-red-700 ring-red-100",
  in_progress: "bg-amber-50 text-amber-700 ring-amber-100",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
};

export const STATUS_OPTIONS: { value: EmbargoStatus; label: string }[] = [
  { value: "requested", label: "요청됨" },
  { value: "in_progress", label: "진행중" },
  { value: "completed", label: "완료" },
];
