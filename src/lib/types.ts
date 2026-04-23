export type EmbargoStatus = "requested" | "in_progress" | "completed";

export interface EmbargoRequest {
  id: string;
  title: string;
  description: string | null;
  embargo_at: string;
  status: EmbargoStatus;
  pdf_sent: boolean;
  tag: string | null;
  created_at: string;
  updated_at: string;
}

export type DatePreset = "today" | "this_week" | "all" | "custom";

export interface Filters {
  datePreset: DatePreset;
  customFrom: string | null;
  customTo: string | null;
  statuses: EmbargoStatus[];
  tag: string | null;
}

export const ALL_STATUSES: EmbargoStatus[] = [
  "requested",
  "in_progress",
  "completed",
];

export type EmbargoFormPayload = {
  title: string;
  description: string | null;
  embargo_at: string;
  status: EmbargoStatus;
  pdf_sent: boolean;
  tag: string | null;
};
