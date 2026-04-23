import { Plus, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";

interface Props {
  onCreate: () => void;
}

export function Header({ onCreate }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight text-slate-900">
              엠바고 관리
            </div>
            <div className="text-[11px] text-slate-500">
              Embargo Workflow Console
            </div>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={onCreate}
          leadingIcon={<Plus className="w-4 h-4" />}
          aria-label="신규 엠바고 요청 만들기"
        >
          신규 요청
        </Button>
      </div>
    </header>
  );
}
