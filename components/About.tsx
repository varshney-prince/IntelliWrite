import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Our Mission
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Empowering clear and effective communication for everyone.
          </p>
        </div>
        <div className="mt-12 text-base text-slate-600 dark:text-slate-400 space-y-6 text-left md:text-justify">
            <p>
                At IntelliWrite, we believe that clear communication is the cornerstone of progress. In an age of information overload, the ability to express ideas with precision and clarity is more important than ever. Our journey began with a simple observation: while technology has connected us globally, it hasn't always equipped us to communicate better. We saw a gap between the brilliant ideas people have and their ability to articulate them effectively.
            </p>
            <p>
                That's why we created IntelliWrite. We're not just building a tool; we're crafting a companion for your writing process. By harnessing the power of advanced artificial intelligence, we provide real-time, context-aware suggestions that go beyond basic grammar checks. We aim to help you refine your tone, strengthen your arguments, and ensure your message resonates with your intended audience.
            </p>
            <p>
                Our team is a diverse group of linguists, engineers, and designers who are passionate about the intersection of language and technology. We are committed to building an ethical, helpful, and accessible tool that empowers students, professionals, and creatives alike to put their best words forward.
            </p>
        </div>
      </div>
    </section>
  );
};

export default About;
