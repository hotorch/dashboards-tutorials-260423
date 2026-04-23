import { ChevronDown } from "lucide-react";
import type { EmbargoStatus } from "../lib/types";
import { STATUS_BADGE, STATUS_DOT, STATUS_LABEL, STATUS_OPTIONS } from "../utils/status";

interface Props {
  value: EmbargoStatus;
  onChange: (next: EmbargoStatus) => void;
}

export function StatusSelect({ value, onChange }: Props) {
  return (
    <label
      className={`relative inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full text-xs font-medium ring-1 cursor-pointer transition-colors ${STATUS_BADGE[value]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[value]}`} />
      <span>{STATUS_LABEL[value]}</span>
      <ChevronDown className="w-3 h-3 opacity-60" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as EmbargoStatus)}
        className="absolute inset-0 opacity-0 cursor-pointer"
        aria-label="상태 변경"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
