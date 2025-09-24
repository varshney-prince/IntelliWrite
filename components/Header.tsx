import React, { useState } from 'react';
import { Sparkles, Menu, X } from './icons';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Demo', href: '#demo' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
    { name: 'API Status', href: '#api-status' },
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
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;