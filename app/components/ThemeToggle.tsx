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
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-dark-800 rounded-full px-1 py-1 shadow-inner border border-gray-200 dark:border-dark-700">
      {options.map((opt) => (
        <button
          key={opt.value}
          aria-label={opt.label}
          onClick={() => setTheme(opt.value)}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50
            ${theme === opt.value 
              ? 'bg-white dark:bg-dark-700 text-primary-500 shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-dark-700/50'
            }`}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
