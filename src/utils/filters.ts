import type { DatePreset, EmbargoStatus, Filters } from "../lib/types";
import { ALL_STATUSES } from "../lib/types";

const VALID_PRESETS: DatePreset[] = ["today", "this_week", "all", "custom"];
const VALID_STATUSES = new Set<EmbargoStatus>(ALL_STATUSES);

export function defaultFilters(): Filters {
  return {
    datePreset: "all",
    customFrom: null,
    customTo: null,
    statuses: [...ALL_STATUSES],
    tag: null,
  };
}

export function filtersFromSearch(search: string): Filters {
  const params = new URLSearchParams(search);
  const presetParam = params.get("date") as DatePreset | null;
  const datePreset: DatePreset =
    presetParam && VALID_PRESETS.includes(presetParam) ? presetParam : "all";
  const statusParam = params.get("status");
  const statuses = statusParam
    ? statusParam
        .split(",")
        .map((s) => s.trim())
        .filter((s): s is EmbargoStatus => VALID_STATUSES.has(s as EmbargoStatus))
    : [...ALL_STATUSES];
  return {
    datePreset,
    customFrom: params.get("from"),
    customTo: params.get("to"),
    statuses: statuses.length > 0 ? statuses : [...ALL_STATUSES],
    tag: params.get("tag"),
  };
}

export function filtersToSearch(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.datePreset !== "all") params.set("date", filters.datePreset);
  if (filters.datePreset === "custom") {
    if (filters.customFrom) params.set("from", filters.customFrom);
    if (filters.customTo) params.set("to", filters.customTo);
  }
  if (filters.statuses.length !== ALL_STATUSES.length) {
    params.set("status", filters.statuses.join(","));
  }
  if (filters.tag) params.set("tag", filters.tag);
  const s = params.toString();
  return s ? `?${s}` : "";
}
