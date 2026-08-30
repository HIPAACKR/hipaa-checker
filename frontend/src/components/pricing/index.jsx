'use client';

import { useState } from 'react';

import './index.scss';


const Pricing = () => {
  const handleGetStartedClick = () => {
    window.location.href = '/sign-in';
  };
  const [billingCycle, setBillingCycle] = useState('monthly');
 

  const allFeatures = [
    'get hipaa score',
    'get vulnerability breakdown',
    'get summarized reports',
    'get specific reports',
    'support multiple device',
    'support dashboard service',
    'view source code',
    'fix vulnerabilities',
    'support customer service',
    'support hipaa experts',
  ];

  const plans = [
    {
      title: 'FREE',
      price: '$0.0',
      users: '1',
      limit: '10',
      features: allFeatures,
    },
    {
      title: 'INDIVIDUAL',
      price: '$20.0',
      users: '2',
      limit: '40',
      features: [
        'get hipaa score',
        'get vulnerability breakdown',
        'get summarized reports',
        'get specific reports',
      ],
    },
    {
      title: 'BASIC',
      price: '$180.0',
      users: '5',
      limit: '100',
      features: [
        'get hipaa score',
        'get vulnerability breakdown',
        'get summarized reports',
        'get specific reports',
        'support dashboard service',
        'view source code',
      ],
    },
    {
      title: 'STANDARD',
      price: '$400.0',
      users: '12',
      limit: '200',
      features: [
        'get hipaa score',
        'get vulnerability breakdown',
        'get summarized reports',
        'get specific reports',
        'support multiple device',
        'support dashboard service',
      ],
    },
     {
      title: 'PREMIUM',
      price: '$1000.0',
      users: '5',
      limit: '100',
      features: allFeatures,
    },
  ];

  return (
    <section className="pricing-section">
      <h2 className="title">Pricing & Subscription</h2>
      <p className="subtitle">
        Contact our sales team if you need any assistance to pick appropriate subscription plan for your company
      </p>

      <div className="toggle-buttons mb-11">
      <button
        className={billingCycle === 'monthly' ? 'active' : ''}
        onClick={() => {
          setBillingCycle('monthly');
          
        }}
      >
        MONTHLY
      </button>

      <button
        className={billingCycle === 'annually' ? 'active' : ''}
        onClick={() => {
          setBillingCycle('annually');
          
        }}
      >
        ANNUALLY
      </button>
      </div>


      <div className="pricing-grid">
        {plans.map((plan) => (
          <div key={plan.title} className="pricing-card">
            <h3>{plan.title}</h3>
            <p className="price">
              {billingCycle === 'monthly'
                ? plan.price
                : plan.title === 'FREE' 
                ? plan.price
                : `$${(parseFloat(plan.price.replace('$', '')) * 10).toFixed(1)}`}
              <span>{billingCycle === 'monthly' ? '/month' : '/year'}</span>
            </p>

            <ul>
              <li>
                <span className="check">✔</span> max users : {plan.users}
              </li>
              
              <li>
                <span className="check">✔</span> limit per day : {plan.limit}
              </li>
              {allFeatures.map((feature) => (
                <li key={feature} className="feature">
                  {plan.features.includes(feature) ? (
                    <span className="check">✔</span>
                  ) : (
                    <span className="cross">❌</span>
                  )}{' '}
                  {feature}
                </li>
              ))}
            </ul>
            <button onClick={handleGetStartedClick} className="choose-plan">CHOOSE PLAN</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
