'use client';

import { useState } from 'react';

import './index.scss';

const Choosestack = () => {
  const [activeTab, setActiveTab] = useState('Python Django');

  const frameworks = {
    'Python Django': {
      language: 'python',
      results: '✅ 15 issues found and fixed ⚠️ 3 manual reviews needed           📄 Compliance report generated',
      image: '/images/common/pythonlogo.png',
      codeImage: '/images/common/pythoncode.png',
    },
    'PHP Laravel': {
      language: 'bash',
      results: '✅ 12 vulnerabilities patched ⚠️ 2 manual checks recommended   📄 Audit report ready',
      image: '/images/common/laravellogo.png',
      codeImage: '/images/common/laravelcode.png',
    },
    'Ruby on Rails': {
      language: 'bash',
      results: '✅ 10 issues resolved ⚠️ 1 area needs further review 📄 Security summary created',
      image: '/images/common/railslogo.png',
      codeImage: '/images/common/railscode.png',
    },
    'Express.js': {
      language: 'bash',
      results: '✅ 18 security gaps fixed ⚠️ 4 potential risks flagged  📄 Analysis report available',
      image: '/images/common/js.png',
      codeImage: '/images/common/jscode.png',
    },
    '.NET': {
      language: 'bash',
      results: '✅ 20 issues auto-fixed ⚠️ 5 require developer review   📄 Compliance checklist complete',
      image: '/images/common/netlogo.png',
      codeImage: '/images/common/netcode.png',
    },
    'Android': {
      language: 'bash',
      results: '✅ 8 security flaws corrected ⚠️ 2 permissions need validation   📄 Mobile report generated',
      image: '/images/common/androidlogo.png',
      codeImage: '/images/common/androidcode.png',
    },
    'IOS': {
      language: 'bash',
      results: '✅ 6 issues resolved ⚠️ 3 manual tests advised    📄 iOS compliance report compiled',
      image: '/images/common/ioslogo.png',
      codeImage: '/images/common/ioscode.png',
    },
  };

  return (
    <div className="choose-stack-container">
      <h2 className="heading">Choose Your Stack</h2>
      <p className="subheading">Interactive Framework Selector</p>

      <div className="tabs">
        {Object.keys(frameworks).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="content-box">
        <div className="tab-content">
          <div className="code-image-block">
            {frameworks[activeTab].codeImage && (
              // TODO: replace with Next.js Image component for optimization JUST A QUICK FIX
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={frameworks[activeTab].codeImage}
                alt={`${activeTab} code`}
                className="code-image"
              />
            )}
            {frameworks[activeTab].results && (
              <div className="results">{frameworks[activeTab].results}</div>
            )}
          </div>

          <div className="image-block">
            {/* TODO: replace with Next.js Image component for optimization JUST A QUICK FIX */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={frameworks[activeTab].image}
              alt={`${activeTab} logo`}
              className="framework-logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choosestack;
