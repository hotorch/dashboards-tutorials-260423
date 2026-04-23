import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { EmbargoFormPayload, EmbargoRequest } from "../lib/types";

interface State {
  rows: EmbargoRequest[];
  loading: boolean;
  error: string | null;
}

export function useEmbargoRequests() {
  const [state, setState] = useState<State>({
    rows: [],
    loading: true,
    error: null,
  });

  const fetchAll = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    const { data, error } = await supabase
      .from("embargo_requests")
      .select("*")
      .order("embargo_at", { ascending: true });
    if (error) {
      setState({ rows: [], loading: false, error: error.message });
      return;
    }
    setState({ rows: (data ?? []) as EmbargoRequest[], loading: false, error: null });
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const create = useCallback(
    async (payload: EmbargoFormPayload) => {
      const { data, error } = await supabase
        .from("embargo_requests")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      setState((s) => ({
        ...s,
        rows: [...s.rows, data as EmbargoRequest].sort((a, b) =>
          a.embargo_at.localeCompare(b.embargo_at),
        ),
      }));
      return data as EmbargoRequest;
    },
    [],
  );

  const update = useCallback(
    async (id: string, patch: Partial<EmbargoFormPayload>) => {
      const prev = state.rows;
      setState((s) => ({
        ...s,
        rows: s.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      }));
      const { data, error } = await supabase
        .from("embargo_requests")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) {
        setState((s) => ({ ...s, rows: prev, error: error.message }));
        throw error;
      }
      setState((s) => ({
        ...s,
        rows: s.rows
          .map((r) => (r.id === id ? (data as EmbargoRequest) : r))
          .sort((a, b) => a.embargo_at.localeCompare(b.embargo_at)),
      }));
      return data as EmbargoRequest;
    },
    [state.rows],
  );

  const remove = useCallback(
    async (id: string) => {
      const prev = state.rows;
      setState((s) => ({ ...s, rows: s.rows.filter((r) => r.id !== id) }));
      const { error } = await supabase
        .from("embargo_requests")
        .delete()
        .eq("id", id);
      if (error) {
        setState((s) => ({ ...s, rows: prev, error: error.message }));
        throw error;
      }
    },
    [state.rows],
  );

  return {
    ...state,
    refetch: fetchAll,
    create,
    update,
    remove,
  };
}
