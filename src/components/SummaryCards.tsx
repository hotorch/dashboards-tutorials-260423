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
      tone: "bg-slate-900 text-white",
      valueClass: "text-white",
    },
    {
      label: "요청됨",
      value: stats.requested,
      hint: "오늘 기준",
      icon: <Circle className="w-4 h-4" />,
      tone: "bg-white ring-1 ring-slate-200/70",
      valueClass: "text-slate-900",
    },
    {
      label: "진행중",
      value: stats.inProgress,
      hint: "오늘 기준",
      icon: <Loader2 className="w-4 h-4" />,
      tone: "bg-white ring-1 ring-slate-200/70",
      valueClass: "text-blue-700",
    },
    {
      label: "완료",
      value: stats.completed,
      hint: "오늘 기준",
      icon: <CheckCircle2 className="w-4 h-4" />,
      tone: "bg-white ring-1 ring-slate-200/70",
      valueClass: "text-emerald-700",
    },
    {
      label: "24시간 임박",
      value: stats.upcoming,
      hint: "지금 ~ +24h",
      icon: <TrendingUp className="w-4 h-4" />,
      tone: "bg-white ring-1 ring-slate-200/70",
      valueClass: "text-amber-700",
    },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`${c.tone} rounded-2xl p-4 shadow-sm transition-shadow hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-medium uppercase tracking-wider ${
                c.tone.includes("text-white")
                  ? "text-white/70"
                  : "text-slate-500"
              }`}
            >
              {c.label}
            </span>
            <span
              className={
                c.tone.includes("text-white") ? "text-white/70" : "text-slate-400"
              }
            >
              {c.icon}
            </span>
          </div>
          <div className={`mt-3 text-3xl font-semibold tracking-tight ${c.valueClass}`}>
            {c.value}
          </div>
          <div
            className={`mt-1 text-[11px] ${
              c.tone.includes("text-white") ? "text-white/60" : "text-slate-400"
            }`}
          >
            {c.hint}
          </div>
        </div>
      ))}
    </section>
  );
}
