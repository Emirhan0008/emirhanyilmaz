import { Sun, Terminal } from '"'"'lucide-react'"'"';

export type AppTheme = '"'"'normal'"'"' | '"'"'terminal'"'"';

interface ThemeToggleProps {
  theme: AppTheme;
  onToggle: () => void;
  className?: string;
}

export function ThemeToggle({ theme, onToggle, className = '"'"''"'"' }: ThemeToggleProps) {
  const terminal = theme === '"'"'terminal'"'"';
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={terminal ? '"'"'Modern arayuze gec'"'"' : '"'"'Terminal moduna gec'"'"'}
      title={terminal ? '"'"'Modern arayuz'"'"' : '"'"'Terminal modu'"'"'}
      className={`inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20 ${className}`}
    >
      {terminal ? <Sun size={18} /> : <Terminal size={18} />}
    </button>
  );
}