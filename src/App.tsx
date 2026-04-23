import { useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { EmbargoFormModal } from "./components/EmbargoFormModal";
import { EmbargoTable } from "./components/EmbargoTable";
import { FilterBar } from "./components/FilterBar";
import { Header } from "./components/Header";
import { SummaryCards } from "./components/SummaryCards";
import { useEmbargoRequests } from "./hooks/useEmbargoRequests";
import type { EmbargoRequest, Filters } from "./lib/types";
import { resolveRange } from "./utils/date";
import { defaultFilters, filtersFromSearch, filtersToSearch } from "./utils/filters";

export default function App() {
  const { rows, loading, error, create, update, remove, refetch } =
    useEmbargoRequests();

  const [filters, setFilters] = useState<Filters>(() =>
    typeof window === "undefined"
      ? defaultFilters()
      : filtersFromSearch(window.location.search),
  );

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<EmbargoRequest | null>(null);
  const [pendingDelete, setPendingDelete] = useState<EmbargoRequest | null>(null);

  useEffect(() => {
    const search = filtersToSearch(filters);
    const url = `${window.location.pathname}${search}${window.location.hash}`;
    if (url !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.replaceState(null, "", url);
    }
  }, [filters]);

  useEffect(() => {
    const onPop = () => setFilters(filtersFromSearch(window.location.search));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) if (r.tag) set.add(r.tag);
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ko"));
  }, [rows]);

  const filtered = useMemo(() => {
    const range = resolveRange(filters);
    return rows.filter((r) => {
      const t = new Date(r.embargo_at).getTime();
      if (range.from && t < range.from.getTime()) return false;
      if (range.to && t > range.to.getTime()) return false;
      if (!filters.statuses.includes(r.status)) return false;
      if (filters.tag && r.tag !== filters.tag) return false;
      return true;
    });
  }, [rows, filters]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (row: EmbargoRequest) => {
    setEditing(row);
    setFormOpen(true);
  };

  return (
    <div className="min-h-full">
      <Header onCreate={openCreate} />

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-fg">
            대시보드
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            오늘 처리해야 할 엠바고를 한눈에 확인하고 상태를 관리합니다.
          </p>
        </div>

        <SummaryCards rows={rows} />

        <FilterBar
          filters={filters}
          onChange={setFilters}
          availableTags={availableTags}
        />

        {error && (
          <div className="bg-rose-500/10 ring-1 ring-rose-500/25 text-rose-300 text-sm rounded-xl px-4 py-3 flex items-center justify-between">
            <span>오류: {error}</span>
            <button
              onClick={() => void refetch()}
              className="text-rose-200 underline-offset-2 hover:underline text-sm"
            >
              다시 시도
            </button>
          </div>
        )}

        <EmbargoTable
          rows={filtered}
          loading={loading}
          onEdit={openEdit}
          onDelete={(r) => setPendingDelete(r)}
          onStatusChange={(r, next) =>
            void update(r.id, { status: next }).catch(() => undefined)
          }
          onPdfToggle={(r, v) =>
            void update(r.id, { pdf_sent: v }).catch(() => undefined)
          }
        />

        <div className="text-xs text-fg-subtle text-center pt-4">
          총 {filtered.length} 건 / 전체 {rows.length} 건
        </div>
      </main>

      <EmbargoFormModal
        open={formOpen}
        initial={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={async (payload) => {
          if (editing) {
            await update(editing.id, payload);
          } else {
            await create(payload);
          }
        }}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="요청 삭제"
        message={`"${pendingDelete?.title ?? ""}" 요청을 삭제할까요? 이 작업은 되돌릴 수 없습니다.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          await remove(pendingDelete.id).catch(() => undefined);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
