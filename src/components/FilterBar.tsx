import { Calendar, Filter, Tag, X } from "lucide-react";
import type { DatePreset, EmbargoStatus, Filters } from "../lib/types";
import { ALL_STATUSES } from "../lib/types";
import { DATE_PRESET_LABEL } from "../utils/date";
import { STATUS_DOT, STATUS_LABEL } from "../utils/status";

interface Props {
  filters: Filters;
  onChange: (next: Filters) => void;
  availableTags: string[];
}

const DATE_PRESETS: DatePreset[] = ["today", "this_week", "all", "custom"];

export function FilterBar({ filters, onChange, availableTags }: Props) {
  const toggleStatus = (s: EmbargoStatus) => {
    const has = filters.statuses.includes(s);
    let next: EmbargoStatus[];
    if (has) {
      next = filters.statuses.filter((x) => x !== s);
      if (next.length === 0) next = [...ALL_STATUSES];
    } else {
      next = [...filters.statuses, s];
    }
    onChange({ ...filters, statuses: next });
  };

  const setPreset = (p: DatePreset) => {
    onChange({
      ...filters,
      datePreset: p,
      ...(p !== "custom" ? { customFrom: null, customTo: null } : {}),
    });
  };

  return (
    <section className="bg-surface rounded-2xl ring-1 ring-border-subtle p-4">
      <div className="flex flex-wrap items-start gap-x-6 gap-y-4">
        <FilterGroup label="기간" icon={<Calendar className="w-3.5 h-3.5" />}>
          <div className="flex flex-wrap gap-1.5">
            {DATE_PRESETS.map((p) => {
              const active = filters.datePreset === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPreset(p)}
                  className={`h-8 px-3 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/35"
                      : "bg-surface-hover text-fg-muted hover:bg-elevated hover:text-fg"
                  }`}
                  aria-pressed={active}
                >
                  {DATE_PRESET_LABEL[p]}
                </button>
              );
            })}
          </div>
          {filters.datePreset === "custom" && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <input
                type="date"
                value={filters.customFrom ?? ""}
                onChange={(e) =>
                  onChange({ ...filters, customFrom: e.target.value || null })
                }
                className="h-8 px-2 rounded-lg ring-1 ring-border-subtle bg-surface-hover text-fg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                aria-label="시작일"
              />
              <span className="text-fg-subtle">→</span>
              <input
                type="date"
                value={filters.customTo ?? ""}
                onChange={(e) =>
                  onChange({ ...filters, customTo: e.target.value || null })
                }
                className="h-8 px-2 rounded-lg ring-1 ring-border-subtle bg-surface-hover text-fg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                aria-label="종료일"
              />
            </div>
          )}
        </FilterGroup>

        <FilterGroup label="상태" icon={<Filter className="w-3.5 h-3.5" />}>
          <div className="flex flex-wrap gap-1.5">
            {ALL_STATUSES.map((s) => {
              const active = filters.statuses.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleStatus(s)}
                  className={`h-8 px-3 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
                    active
                      ? "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/35"
                      : "bg-surface-hover text-fg-muted hover:bg-elevated hover:text-fg"
                  }`}
                  aria-pressed={active}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[s]}`} />
                  {STATUS_LABEL[s]}
                </button>
              );
            })}
          </div>
        </FilterGroup>

        {availableTags.length > 0 && (
          <FilterGroup label="태그" icon={<Tag className="w-3.5 h-3.5" />}>
            <div className="flex flex-wrap items-center gap-1.5">
              <select
                value={filters.tag ?? ""}
                onChange={(e) =>
                  onChange({ ...filters, tag: e.target.value || null })
                }
                className="h-8 pl-3 pr-8 rounded-lg ring-1 ring-border-subtle bg-surface-hover text-sm text-fg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="">전체</option>
                {availableTags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {filters.tag && (
                <button
                  type="button"
                  onClick={() => onChange({ ...filters, tag: null })}
                  className="h-8 px-2 inline-flex items-center text-fg-muted hover:text-fg"
                  aria-label="태그 필터 초기화"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </FilterGroup>
        )}
      </div>
    </section>
  );
}

function FilterGroup({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 mb-2 text-[11px] font-medium uppercase tracking-wider text-fg-subtle">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}
