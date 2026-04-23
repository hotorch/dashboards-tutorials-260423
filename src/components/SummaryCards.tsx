import { CalendarClock, CheckCircle2, Circle, Loader2, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import type { EmbargoRequest } from "../lib/types";
import { isToday, isWithinNext24h } from "../utils/date";

interface Props {
  rows: EmbargoRequest[];
}

export function SummaryCards({ rows }: Props) {
  const stats = useMemo(() => {
    const today = rows.filter((r) => isToday(r.embargo_at));
    return {
      todayTotal: today.length,
      requested: today.filter((r) => r.status === "requested").length,
      inProgress: today.filter((r) => r.status === "in_progress").length,
      completed: today.filter((r) => r.status === "completed").length,
      upcoming: rows.filter((r) => isWithinNext24h(r.embargo_at)).length,
    };
  }, [rows]);

  const cards = [
    {
      label: "오늘 엠바고",
      value: stats.todayTotal,
      hint: "00:00 – 23:59",
      icon: <CalendarClock className="w-4 h-4" />,
      accent: true,
    },
    {
      label: "요청됨",
      value: stats.requested,
      hint: "오늘 기준",
      icon: <Circle className="w-4 h-4" />,
      valueClass: "text-fg",
    },
    {
      label: "진행중",
      value: stats.inProgress,
      hint: "오늘 기준",
      icon: <Loader2 className="w-4 h-4" />,
      valueClass: "text-indigo-300",
    },
    {
      label: "완료",
      value: stats.completed,
      hint: "오늘 기준",
      icon: <CheckCircle2 className="w-4 h-4" />,
      valueClass: "text-emerald-300",
    },
    {
      label: "24시간 임박",
      value: stats.upcoming,
      hint: "지금 ~ +24h",
      icon: <TrendingUp className="w-4 h-4" />,
      valueClass: "text-amber-300",
    },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c) => {
        const accent = c.accent === true;
        const tone = accent
          ? "bg-gradient-to-br from-indigo-500/20 to-indigo-500/[0.04] ring-1 ring-indigo-500/40 shadow-[0_0_24px_rgba(99,102,241,0.15)]"
          : "bg-surface ring-1 ring-border-subtle";
        const labelClass = accent ? "text-indigo-200/80" : "text-fg-muted";
        const iconClass = accent ? "text-indigo-300" : "text-fg-subtle";
        const valueClass = accent ? "text-fg" : c.valueClass ?? "text-fg";
        const hintClass = accent ? "text-indigo-200/60" : "text-fg-subtle";
        return (
          <div
            key={c.label}
            className={`${tone} rounded-2xl p-4 transition-colors hover:ring-border-strong`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[11px] font-medium uppercase tracking-wider ${labelClass}`}
              >
                {c.label}
              </span>
              <span className={iconClass}>{c.icon}</span>
            </div>
            <div
              className={`mt-3 text-3xl font-semibold tracking-tight ${valueClass}`}
            >
              {c.value}
            </div>
            <div className={`mt-1 text-[11px] ${hintClass}`}>{c.hint}</div>
          </div>
        );
      })}
    </section>
  );
}
