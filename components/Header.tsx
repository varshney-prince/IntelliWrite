import React, { useState } from 'react';
import { Sparkles, Sun, Moon, Menu, X } from './icons';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  onLaunchEditor: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, setIsDarkMode, onLaunchEditor }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Demo', href: '#demo' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/80 dark:bg-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="#" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-indigo-500" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">IntelliWrite</span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm font-medium hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                {link.name}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
                onClick={onLaunchEditor}
                className="sm:inline-flex items-center hidden justify-center px-4 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Launch Editor
              </button>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-slate-500 dark:text-slate-400"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900">
          <nav className="flex flex-col items-center gap-4 py-4 border-t border-slate-200 dark:border-slate-800">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-lg font-medium hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                {link.name}
              </a>
            ))}
            <button
                onClick={() => { onLaunchEditor(); setIsMenuOpen(false); }}
                className="sm:hidden hidden inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-white bg-indigo-500 rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors w-4/5 mt-2"
              >
                Launch Editor
              </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;