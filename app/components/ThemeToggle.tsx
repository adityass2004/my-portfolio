import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Monitor, Sun, Moon } from 'lucide-react';

interface Option {
  value: 'system' | 'light' | 'dark';
  icon: React.ReactNode;
  label: string;
}

const options: Option[] = [
  { value: 'system', icon: <Monitor size={18} />, label: 'System' },
  { value: 'light', icon: <Sun size={18} />, label: 'Light' },
  { value: 'dark', icon: <Moon size={18} />, label: 'Dark' },
];

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 bg-paper-warm rounded-full px-1 py-1 border border-border-new">
      {options.map((opt) => (
        <button
          key={opt.value}
          aria-label={opt.label}
          onClick={() => setTheme(opt.value)}
          className={`w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200
            ${theme === opt.value 
              ? 'bg-ink text-paper' 
              : 'text-muted hover:text-ink'
            }`}
        >
          {React.cloneElement(opt.icon as React.ReactElement, { size: 14 })}
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
