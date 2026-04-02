import { useApp } from '@/context/AppContext';
import { Moon, Sun, LayoutDashboard } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/types/finance';

export default function Header() {
  const { role, setRole, darkMode, toggleDarkMode } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h1 className="font-heading font-bold text-lg">FinTrack</h1>
        </div>
        <div className="flex items-center gap-3">
          <Select value={role} onValueChange={v => setRole(v as UserRole)}>
            <SelectTrigger className="w-28 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
