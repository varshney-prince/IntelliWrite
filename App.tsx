import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Demo from './components/Demo';
import Pricing from './components/Pricing';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TextEditorModal from './components/TextEditorModal';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => 
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors duration-300">
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} onLaunchEditor={openModal} />
      <main>
        <Hero onTryDemoClick={openModal} />
        <Features />
        <Demo onTryDemoClick={openModal} />
        <Pricing />
        <About />
        <Contact />
      </main>
      <Footer />
      <TextEditorModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default App;