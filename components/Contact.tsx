import React, { useState } from 'react';
import { Loader2, Check } from './icons';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  // The provided Google Apps Script "Web App URL" for form submissions.
  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyU_syBvYUsBmx4w1uS9HJ4q7wBlsB1YVfpsAzz4cY3a6yMdbR9fSen-egFAbNfDO0muA/exec';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('idle');
    setError('');

    if (!formData.name || !formData.email || !formData.message) {
      setError('All fields are required.');
      setStatus('error');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Please enter a valid email address.');
        setStatus('error');
        return;
    }

    setStatus('submitting');
    
    const scriptData = new URLSearchParams();
    scriptData.append('name', formData.name);
    scriptData.append('email', formData.email);
    scriptData.append('message', formData.message);

    try {
      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: scriptData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.result === 'success') {
          setStatus('success');
          setFormData({ name: '', email: '', message: '' });
        } else {
          throw new Error(result.error || 'Submission failed');
        }
      } else {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err) {
      console.error('Submission Error:', err);
      setError('Something went wrong. Please try again later.');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Get in Touch
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="mt-12 max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Message
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                ></textarea>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                {status === 'submitting' && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </div>
            
            <div className="h-5 mt-4 text-center">
                {status === 'success' && (
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center">
                        <Check className="w-5 h-5 mr-1" />
                        Message sent successfully! Thank you.
                    </p>
                )}
                {status === 'error' && (
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
            </div>

          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;