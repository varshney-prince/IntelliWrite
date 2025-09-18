import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Demo from './components/Demo';
import Footer from './components/Footer';
import TextEditorModal from './components/TextEditorModal';

// Extend the Window interface to include the custom 'claude' object
declare global {
  interface Window {
    claude: {
      complete: (prompt: string) => Promise<string>;
    };
  }
}

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // Mock the external 'claude' API for the TextEditor component to function
  useEffect(() => {
    window.claude = {
      complete: (prompt: string): Promise<string> => {
        console.log("Mock 'claude.complete' called with prompt:", prompt);
        return new Promise(resolve => {
          setTimeout(() => {
            const mockSuggestions = [
              {
                "category": "style",
                "issue": "make sure that",
                "suggestion": "ensure",
                "explanation": "This is a more concise and professional alternative.",
                "position": 58
              },
              {
                "category": "grammar",
                "issue": "beneficial to humanity",
                "suggestion": "beneficial for humanity",
                "explanation": "'Beneficial for' is often preferred when discussing benefits to a group.",
                "position": 85
              },
              {
                "category": "clarity",
                "issue": "very many more characteristics",
                "suggestion": "many other characteristics",
                "explanation": "'Very many' is redundant. 'Many' is sufficient and more direct.",
                "position": 401
              },
               {
                "category": "spelling",
                "issue": "probelm-solve",
                "suggestion": "problem-solve",
                "explanation": "Corrected spelling of 'problem'.",
                "position": 380
              }
            ];
            resolve(JSON.stringify(mockSuggestions));
          }, 1500); // Simulate network delay
        });
      }
    };
  }, []);

  const openEditorModal = () => setIsEditorModalOpen(true);
  const closeEditorModal = () => setIsEditorModalOpen(false);


  return (
    <div className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors duration-300">
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} onGetStartedClick={openEditorModal} />
      <main>
        <Hero onTryDemoClick={openEditorModal} />
        <Features />
        <Demo onTryDemoClick={openEditorModal} />
      </main>
      <Footer />
      {isEditorModalOpen && <TextEditorModal isOpen={isEditorModalOpen} onClose={closeEditorModal} />}
    </div>
  );
};

export default App;