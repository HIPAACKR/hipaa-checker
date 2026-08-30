'use client';

import './index.scss';

const Enterprise = () => {
    const handleGetStartedClick = () => {
    window.location.href = '/sign-in';
  };
  const features = [
    ['max users : 20', 'limit per day : 400', 'get hipaa score'],
    ['get vulnerability breakdown', 'get summerized reports', 'get specific reports'],
    ['support multiple device', 'support dashboard service', 'view source code'],
    ['fix vulnerabilities', 'support customer service', 'support hipaa experts']
  ];

  return (
    <div className="enterprise-card">
      <div className="enterprise-header">
        <h2>Enterprise</h2>       
      </div>
      <p className="price">$500.0 <span>/month</span></p>
      <div className="enterprise-body">
        {features.map((column, index) => (
          <ul key={index}>
            {column.map((item, idx) => (
              <li key={idx}>
                <span className="check">✔</span> {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
      <div className="enterprise-footer">
        <button onClick={handleGetStartedClick}>CHOOSE PLAN</button>
      </div>
    </div>
  );
};

export default Enterprise;
