
import React from 'react';
import { Check } from './icons';

const Pricing: React.FC = () => {
  const tiers = [
    {
      name: 'Starter',
      price: '$0',
      frequency: '/ month',
      description: 'For individuals and hobbyists starting out.',
      features: [
        'Basic AI suggestions',
        '50 analyses per month',
        'Standard text formatting',
        'Community support',
      ],
      cta: 'Get Started for Free',
      main: false,
    },
    {
      name: 'Pro',
      price: '$10',
      frequency: '/ month',
      description: 'For professionals and teams who need more power.',
      features: [
        'Advanced AI suggestions',
        'Unlimited analyses',
        'Plagiarism checker',
        'Priority email support',
        'Team collaboration features',
      ],
      cta: 'Start 7-Day Trial',
      main: true,
    },
    {
      name: 'Enterprise',
      price: 'Contact Us',
      frequency: '',
      description: 'For large organizations with custom needs.',
      features: [
        'Everything in Pro',
        'On-premise deployment',
        'Custom AI models',
        'Dedicated account manager',
        '24/7 premium support',
      ],
      cta: 'Request a Demo',
      main: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Choose the plan that's right for you
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Simple, transparent pricing for individuals and teams of all sizes.
          </p>
        </div>
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col p-8 rounded-2xl border ${
                tier.main
                  ? 'border-indigo-500 ring-2 ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800'
              } bg-slate-50 dark:bg-slate-900/50`}
            >
              {tier.main && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center px-4 py-1 text-sm font-semibold text-white bg-indigo-500 rounded-full">
                        Most Popular
                    </span>
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tier.name}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{tier.description}</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{tier.price}</span>
                <span className="text-base font-medium text-slate-500 dark:text-slate-400">{tier.frequency}</span>
              </div>
              <ul className="mt-6 space-y-4 flex-grow">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
                  </li>
                ))}
              </ul>
              <a href="#" className={`block w-full text-center mt-8 px-6 py-3 text-sm font-semibold rounded-lg transition-colors ${
                  tier.main 
                  ? 'text-white bg-indigo-500 hover:bg-indigo-600'
                  : 'text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20'
              }`}>
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
