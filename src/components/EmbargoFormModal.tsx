import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type {
  EmbargoFormPayload,
  EmbargoRequest,
  EmbargoStatus,
} from "../lib/types";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { formatDateInputValue } from "../utils/date";
import { STATUS_OPTIONS } from "../utils/status";

interface Props {
  open: boolean;
  initial: EmbargoRequest | null;
  onClose: () => void;
  onSubmit: (payload: EmbargoFormPayload) => Promise<void>;
}

interface FormState {
  title: string;
  description: string;
  embargo_at: string;
  status: EmbargoStatus;
  pdf_sent: boolean;
  tag: string;
}

function defaultForm(): FormState {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  now.setHours(now.getHours() + 1);
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  return {
    title: "",
    description: "",
    embargo_at: local,
    status: "requested",
    pdf_sent: false,
    tag: "",
  };
}

export function EmbargoFormModal({ open, initial, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (initial) {
      setForm({
        title: initial.title,
        description: initial.description ?? "",
        embargo_at: formatDateInputValue(initial.embargo_at),
        status: initial.status,
        pdf_sent: initial.pdf_sent,
        tag: initial.tag ?? "",
      });
    } else {
      setForm(defaultForm());
    }
  }, [open, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.embargo_at) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim() || null,
        embargo_at: new Date(form.embargo_at).toISOString(),
        status: form.status,
        pdf_sent: form.pdf_sent,
        tag: form.tag.trim() || null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "엠바고 수정" : "신규 엠바고 요청"}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            취소
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="embargo-form"
            disabled={submitting || !form.title.trim() || !form.embargo_at}
            leadingIcon={
              submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined
            }
          >
            {initial ? "변경 저장" : "요청 등록"}
          </Button>
        </>
      }
    >
      <form id="embargo-form" onSubmit={handleSubmit} className="space-y-4">
        <Field label="제목" required>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="예: 삼성전자 1분기 실적 발표"
            className="w-full h-10 px-3 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/30 transition-shadow"
            required
            maxLength={200}
          />
        </Field>

        <Field label="설명">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="요청 배경, 처리 시 유의사항 등"
            rows={3}
            className="w-full px-3 py-2 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/30 resize-none transition-shadow"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="엠바고 일시" required>
            <input
              type="datetime-local"
              value={form.embargo_at}
              onChange={(e) =>
                setForm({ ...form, embargo_at: e.target.value })
              }
              className="w-full h-10 px-3 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/30"
              required
            />
          </Field>

          {initial && (
            <Field label="상태">
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as EmbargoStatus })
                }
                className="w-full h-10 px-3 rounded-lg ring-1 ring-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/30"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="태그">
            <input
              type="text"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
              placeholder="예: 실적, 신차, 반도체"
              className="w-full h-10 px-3 rounded-lg ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/30"
              maxLength={40}
            />
          </Field>

          <Field label="PDF 발송">
            <label className="h-10 flex items-center gap-2 px-3 rounded-lg ring-1 ring-slate-200 bg-white cursor-pointer">
              <input
                type="checkbox"
                checked={form.pdf_sent}
                onChange={(e) =>
                  setForm({ ...form, pdf_sent: e.target.checked })
                }
                className="w-4 h-4 accent-slate-900"
              />
              <span className="text-sm text-slate-700">발송 완료</span>
            </label>
          </Field>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 ring-1 ring-red-100 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
      </form>
    </Modal>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium text-slate-600">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </div>
      {children}
    </label>
  );
}
