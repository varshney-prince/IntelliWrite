import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Demo from './components/Demo';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import APIStatus from './components/APIStatus';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => 
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderContent = () => {
    switch(route) {
      case '#api-status':
        return <APIStatus />;
      default:
        return (
          <>
            <Hero />
            <Features />
            <Demo />
            <About />
            <Contact />
          </>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors duration-300">
      <Header />
      <main>
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;