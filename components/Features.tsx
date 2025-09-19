
import React from 'react';
import { Bot, Zap, Languages } from './icons';

const FEATURES = [
  {
    title: 'AI-Powered Suggestions',
    description: 'Get real-time feedback on grammar, spelling, punctuation, style, and clarity to improve your writing instantly.',
    icon: 'ai',
  },
  {
    title: 'Rich Text Formatting',
    description: 'Easily format your text with a full suite of tools, including fonts, sizes, lists, and alignment options.',
    icon: 'formatting',
  },
  {
    title: 'Multi-Language Support',
    description: 'Our AI understands multiple languages, providing accurate suggestions no matter what language you write in.',
    icon: 'language',
  },
];

const featureIcons: { [key: string]: React.ElementType } = {
  ai: Bot,
  formatting: Zap,
  language: Languages,
};

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Everything You Need to Write Perfectly
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            From intelligent suggestions to powerful formatting tools, IntelliWrite has you covered.
          </p>
        </div>
        <div className="mt-20 grid md:grid-cols-3 gap-12">
          {FEATURES.map((feature) => {
            const Icon = featureIcons[feature.icon];
            return (
              <div key={feature.title} className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-500">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;