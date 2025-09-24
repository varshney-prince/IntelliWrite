import React from 'react';
import { Sparkles, Twitter, Github, Linkedin } from './icons';

const Footer: React.FC = () => {
  const footerLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Demo', href: '#demo' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
    { name: 'API Status', href: '#api-status' },
  ];

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
  ];

  return (
    <footer className="bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-indigo-500" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">IntelliWrite</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                {link.name}
              </a>
            ))}
          </nav>
          <div className="flex gap-6">
            {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                    <a key={social.name} href={social.href} className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors">
                        <span className="sr-only">{social.name}</span>
                        <Icon className="w-6 h-6" />
                    </a>
                )
            })}
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} IntelliWrite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;