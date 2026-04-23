import { Inbox, Pencil, Trash2 } from "lucide-react";
import type { EmbargoRequest } from "../lib/types";
import { formatEmbargoAt, isWithinNext24h } from "../utils/date";
import { StatusSelect } from "./StatusSelect";

interface Props {
  rows: EmbargoRequest[];
  loading: boolean;
  onEdit: (row: EmbargoRequest) => void;
  onDelete: (row: EmbargoRequest) => void;
  onStatusChange: (row: EmbargoRequest, next: EmbargoRequest["status"]) => void;
  onPdfToggle: (row: EmbargoRequest, value: boolean) => void;
}

export function EmbargoTable(props: Props) {
  const { rows, loading } = props;

  if (loading) return <Skeleton />;
  if (rows.length === 0) return <Empty />;

  return (
    <section className="bg-surface rounded-2xl ring-1 ring-border-subtle overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] font-medium uppercase tracking-wider text-fg-subtle bg-surface-hover/60">
              <th className="px-5 py-3">제목</th>
              <th className="px-5 py-3 whitespace-nowrap">엠바고 일시</th>
              <th className="px-5 py-3">상태</th>
              <th className="px-5 py-3 text-center">PDF</th>
              <th className="px-5 py-3">태그</th>
              <th className="px-5 py-3 text-right">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {rows.map((r) => (
              <DesktopRow key={r.id} row={r} {...props} />
            ))}
          </tbody>
        </table>
      </div>
      <ul className="md:hidden divide-y divide-border-subtle">
        {rows.map((r) => (
          <MobileCard key={r.id} row={r} {...props} />
        ))}
      </ul>
    </section>
  );
}

function DesktopRow({
  row,
  onEdit,
  onDelete,
  onStatusChange,
  onPdfToggle,
}: { row: EmbargoRequest } & Omit<Props, "rows" | "loading">) {
  const upcoming = isWithinNext24h(row.embargo_at);
  return (
    <tr
      className={`group hover:bg-surface-hover transition-colors ${
        upcoming ? "border-l-4 border-l-amber-400" : "border-l-4 border-l-transparent"
      }`}
    >
      <td className="px-5 py-3.5">
        <div className="font-medium text-fg leading-snug">{row.title}</div>
        {row.description && (
          <div className="mt-0.5 text-[12px] text-fg-muted line-clamp-1">
            {row.description}
          </div>
        )}
      </td>
      <td className="px-5 py-3.5 whitespace-nowrap text-fg-muted tabular-nums">
        {formatEmbargoAt(row.embargo_at)}
      </td>
      <td className="px-5 py-3.5">
        <StatusSelect
          value={row.status}
          onChange={(next) => onStatusChange(row, next)}
        />
      </td>
      <td className="px-5 py-3.5 text-center">
        <PdfCheckbox
          checked={row.pdf_sent}
          onChange={(v) => onPdfToggle(row, v)}
        />
      </td>
      <td className="px-5 py-3.5">
        {row.tag ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-surface-hover text-fg-muted ring-1 ring-border-subtle">
            {row.tag}
          </span>
        ) : (
          <span className="text-fg-subtle text-xs">—</span>
        )}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(row)}
            className="p-1.5 rounded-md text-fg-muted hover:bg-elevated hover:text-fg"
            aria-label="수정"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(row)}
            className="p-1.5 rounded-md text-fg-muted hover:bg-rose-500/10 hover:text-rose-300"
            aria-label="삭제"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function MobileCard({
  row,
  onEdit,
  onDelete,
  onStatusChange,
  onPdfToggle,
}: { row: EmbargoRequest } & Omit<Props, "rows" | "loading">) {
  const upcoming = isWithinNext24h(row.embargo_at);
  return (
    <li
      className={`p-4 ${
        upcoming ? "border-l-4 border-l-amber-400" : "border-l-4 border-l-transparent"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-medium text-fg leading-snug">{row.title}</div>
          <div className="mt-0.5 text-[12px] text-fg-muted tabular-nums">
            {formatEmbargoAt(row.embargo_at)}
          </div>
          {row.description && (
            <div className="mt-2 text-[12.5px] text-fg-muted line-clamp-2">
              {row.description}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(row)}
            className="p-1.5 rounded-md text-fg-muted hover:bg-surface-hover hover:text-fg"
            aria-label="수정"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(row)}
            className="p-1.5 rounded-md text-fg-muted hover:bg-rose-500/10 hover:text-rose-300"
            aria-label="삭제"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <StatusSelect
          value={row.status}
          onChange={(next) => onStatusChange(row, next)}
        />
        <PdfCheckbox
          checked={row.pdf_sent}
          onChange={(v) => onPdfToggle(row, v)}
          showLabel
        />
        {row.tag && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-surface-hover text-fg-muted ring-1 ring-border-subtle">
            {row.tag}
          </span>
        )}
      </div>
    </li>
  );
}

function PdfCheckbox({
  checked,
  onChange,
  showLabel = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  showLabel?: boolean;
}) {
  return (
    <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-xs">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="appearance-none w-4 h-4 rounded border border-border-strong bg-surface-hover checked:bg-indigo-500 checked:border-indigo-500 transition-colors relative
                   checked:before:content-[''] checked:before:absolute checked:before:left-1/2 checked:before:top-1/2 checked:before:-translate-x-1/2 checked:before:-translate-y-1/2 checked:before:w-2 checked:before:h-2 checked:before:bg-white checked:before:[clip-path:polygon(14%_44%,0_65%,50%_100%,100%_16%,80%_0,43%_62%)]
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
        aria-label={showLabel ? undefined : "PDF 발송 여부"}
      />
      {showLabel && (
        <span className={checked ? "text-fg" : "text-fg-subtle"}>
          PDF {checked ? "발송됨" : "미발송"}
        </span>
      )}
    </label>
  );
}

function Skeleton() {
  return (
    <section className="bg-surface rounded-2xl ring-1 ring-border-subtle p-6 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-12 rounded-lg bg-surface-hover animate-pulse"
          aria-hidden
        />
      ))}
    </section>
  );
}

function Empty() {
  return (
    <section className="bg-surface rounded-2xl ring-1 ring-border-subtle p-12 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center text-fg-muted">
        <Inbox className="w-5 h-5" />
      </div>
      <div className="mt-3 text-sm font-medium text-fg">
        조건에 맞는 엠바고가 없어요
      </div>
      <div className="mt-1 text-xs text-fg-muted">
        필터를 조정하거나 신규 요청을 만들어 보세요.
      </div>
    </section>
  );
}

