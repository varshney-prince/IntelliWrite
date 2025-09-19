import React from 'react';
import { Sparkles } from './icons';

interface DemoProps {
    onTryDemoClick: () => void;
}

const Demo: React.FC<DemoProps> = ({ onTryDemoClick }) => {
  return (
    <section id="demo" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Try IntelliWrite Live
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Experience the power of AI-assisted writing right in your browser. No sign-up required.
          </p>
        </div>
        <div className="max-w-4xl mx-auto text-center">
            <div className="relative p-8 border border-dashed rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700">
                <div className="absolute inset-0 bg-grid-slate-200/[0.05] dark:bg-grid-slate-700/[0.1] [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Ready to see it in action?</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Click the button below to launch the full-featured editor in a focused, distraction-free environment.</p>
                <button
                    onClick={onTryDemoClick}
                    className="mt-6 px-8 py-3 font-semibold text-lg text-white bg-gradient-to-r from-indigo-600 to-purple-700 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
                >
                    <Sparkles className="w-6 h-6" />
                    Launch the Editor
                </button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;