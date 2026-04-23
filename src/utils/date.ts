import {
  endOfDay,
  endOfWeek,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfWeek,
} from "date-fns";
import type { DatePreset, Filters } from "../lib/types";

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export function resolveRange(filters: Filters): DateRange {
  const now = new Date();
  switch (filters.datePreset) {
    case "today":
      return { from: startOfDay(now), to: endOfDay(now) };
    case "this_week":
      return {
        from: startOfWeek(now, { weekStartsOn: 1 }),
        to: endOfWeek(now, { weekStartsOn: 1 }),
      };
    case "all":
      return { from: null, to: null };
    case "custom":
      return {
        from: filters.customFrom ? startOfDay(parseISO(filters.customFrom)) : null,
        to: filters.customTo ? endOfDay(parseISO(filters.customTo)) : null,
      };
  }
}

export function formatEmbargoAt(iso: string): string {
  return format(parseISO(iso), "yyyy.MM.dd (EEE) HH:mm");
}

export function formatDateInputValue(iso: string): string {
  return format(parseISO(iso), "yyyy-MM-dd'T'HH:mm");
}

export function isToday(iso: string): boolean {
  const d = parseISO(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function isWithinNext24h(iso: string): boolean {
  const d = parseISO(iso);
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return isWithinInterval(d, { start: now, end: in24h });
}

export const DATE_PRESET_LABEL: Record<DatePreset, string> = {
  today: "오늘",
  this_week: "이번 주",
  all: "전체",
  custom: "기간 지정",
};
