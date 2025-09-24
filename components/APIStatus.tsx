import React, { useState, useEffect } from 'react';
import { KeyRound, Check, BarChart3, AlertTriangle } from './icons';

interface UsageStats {
  requestsToday: number;
  requestsThisMonth: number;
  lastResetDate: string;
}

const FREE_TIER_LIMITS = {
  dailyRequests: 15,
  monthlyRequests: 1500
};

const APIStatus: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [usageStats, setUsageStats] = useState<UsageStats>({
    requestsToday: 0,
    requestsThisMonth: 0,
    lastResetDate: new Date().toDateString()
  });

  useEffect(() => {
    const storedKey = localStorage.getItem('userApiKey');
    if (storedKey) {
      setApiKey(storedKey);
    }

    // Load usage stats
    const storedStats = localStorage.getItem('apiUsageStats');
    if (storedStats) {
      const stats = JSON.parse(storedStats);
      const today = new Date().toDateString();
      
      // Reset daily counter if it's a new day
      if (stats.lastResetDate !== today) {
        const currentMonth = new Date().getMonth();
        const statsMonth = new Date(stats.lastResetDate).getMonth();
        
        // Reset monthly counter if it's a new month
        const resetMonthly = currentMonth !== statsMonth;
        
        const updatedStats = {
          requestsToday: 0,
          requestsThisMonth: resetMonthly ? 0 : stats.requestsThisMonth,
          lastResetDate: today
        };
        
        setUsageStats(updatedStats);
        localStorage.setItem('apiUsageStats', JSON.stringify(updatedStats));
      } else {
        setUsageStats(stats);
      }
    }
  }, []);

  const resetUsageStats = () => {
    const resetStats = {
      requestsToday: 0,
      requestsThisMonth: 0,
      lastResetDate: new Date().toDateString()
    };
    setUsageStats(resetStats);
    localStorage.setItem('apiUsageStats', JSON.stringify(resetStats));
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userApiKey', apiKey);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('userApiKey');
    setApiKey('');
  };

  const dailyUsagePercentage = (usageStats.requestsToday / FREE_TIER_LIMITS.dailyRequests) * 100;
  const monthlyUsagePercentage = (usageStats.requestsThisMonth / FREE_TIER_LIMITS.monthlyRequests) * 100;
  const isUsingOwnKey = !!localStorage.getItem('userApiKey');

  return (
    <section id="api-status" className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            API Usage Status
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Manage your API key to interact with the IntelliWrite demo.
          </p>
        </div>

        <div className="mt-16 max-w-2xl mx-auto grid grid-cols-1 gap-8">
          {!isUsingOwnKey && (
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-indigo-500" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free Tier Usage</h3>
              </div>
              
              <div className="space-y-6">
                {/* Daily Usage */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Daily Requests</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {usageStats.requestsToday} / {FREE_TIER_LIMITS.dailyRequests}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        dailyUsagePercentage >= 90 ? 'bg-red-500' : 
                        dailyUsagePercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(dailyUsagePercentage, 100)}%` }}
                    ></div>
                  </div>
                  {dailyUsagePercentage >= 90 && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs">Daily limit almost reached</span>
                    </div>
                  )}
                </div>

                {/* Monthly Usage */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Monthly Requests</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {usageStats.requestsThisMonth} / {FREE_TIER_LIMITS.monthlyRequests}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        monthlyUsagePercentage >= 90 ? 'bg-red-500' : 
                        monthlyUsagePercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(monthlyUsagePercentage, 100)}%` }}
                    ></div>
                  </div>
                  {monthlyUsagePercentage >= 90 && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs">Monthly limit almost reached</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={resetUsageStats}
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 underline"
                >
                  Reset usage statistics
                </button>
              </div>
            </div>
          )}

          <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free Tier Information</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              This live demo uses a shared API key provided for demonstration purposes. The free tier has the following limits:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                <strong>{FREE_TIER_LIMITS.dailyRequests} requests per day</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                <strong>{FREE_TIER_LIMITS.monthlyRequests} requests per month</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                Subject to rate limits and may be temporarily unavailable if usage is high
              </li>
            </ul>
            </p>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              For unlimited and reliable access, you can use your own Google AI Gemini API key. You can get a free key from {' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-500 dark:text-indigo-400 hover:underline font-medium">
                Google AI Studio
              </a>.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your API Key</h3>
            {isUsingOwnKey && (
              <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">✓ Using your own API key - no usage limits apply</p>
            )}
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Your key is saved securely in your browser's local storage and is never sent to our servers.
            </p>
            <form onSubmit={handleSaveKey} className="mt-6 space-y-4">
              <div>
                <label htmlFor="api-key" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Google AI Gemini API Key
                </label>
                <div className="mt-1 relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <KeyRound className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    type="password"
                    name="api-key"
                    id="api-key"
                    className="block w-full rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter your API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-grow">
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Key
                  </button>
                </div>
                {localStorage.getItem('userApiKey') && (
                   <div className="flex-grow">
                    <button
                        type="button"
                        onClick={handleRemoveKey}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Remove and Use Free Tier
                    </button>
                   </div>
                )}
              </div>
            </form>
            {saveStatus === 'saved' && (
              <p className="mt-4 text-sm text-green-600 dark:text-green-400 flex items-center justify-center">
                <Check className="w-5 h-5 mr-1" />
                API Key saved successfully!
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default APIStatus;
