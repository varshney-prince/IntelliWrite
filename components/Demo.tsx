import React from 'react';
import TextEditor from './TextEditor';

const Demo: React.FC = () => {
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
        <TextEditor />
      </div>
    </section>
  );
};

export default Demo;