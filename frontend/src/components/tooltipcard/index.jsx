'use client';
import { useState } from 'react';

import './index.scss';

////TODO: Have to refactor this component also the mother component
const Tooltipcard = ({ onClose }) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  if (!visible) return null;
  return (
    <div className="custom-tooltip">
     <div className="custom-tooltip__header">    
        <button
          className="custom-tooltip__close-button"
          onClick={handleClose}
          aria-label="Close tooltip"
        >
        ×
        </button>
    </div>     
      <div className="custom-tooltip__body">
        <div className="custom-tooltip__section">
          <h4>Severity assessment:</h4>
          <p>           
            severity_level: 4 <br />
            confidence_score: 0.93
        
          </p>
        </div>
        
        <div className="custom-tooltip__section">
          <h4>Reasoning:</h4>
          <p>
            The code uses MD5 (MessageDigest.getInstance(&quot;MD5&quot;)) to create a hash of data that may include ePHI such as passwords, SSNs, or tokens. 
            MD5 is cryptographically broken and vulnerable to collision and pre-image attacks, making it unsuitable for protecting sensitive health information. 
            Under HIPAA, any ePHI at rest must be rendered unreadable through approved encryption or hashing mechanisms. 
            The presence of MD5 directly violates the Security Rule’s technical safeguards for encryption/decryption and creates a clear path for data exposure through brute-force or rainbow-table attacks. 
            Because the weakness is in core data-handling logic and affects all records processed by this component, the impact is systemic and could lead to large-scale breaches, thus warranting a Critical severity rating.
          </p>
        </div>

       
        <div className="custom-tooltip__section">
          <h4>Risk factors:</h4>
          <ul>
            <li>ePHI data exposure due to weak hashing algorithm,</li>
            <li>Potential for unauthorized reconstruction of passwords or tokens,</li>
            <li>Regulatory fines and penalties for HIPAA non-compliance,</li>
            <li>Reputational damage and loss of patient trust,</li>
            <li>Increased likelihood of successful ransomware or data-theft incidents</li>
          </ul>
        </div>

       
        <div className="custom-tooltip__section">
          <h4>Violated_rules:</h4>
          <ul>
            <li>164.312(a)(2)(iv) – Encryption and decryption,</li>
            <li>164.312(b) – Integrity,</li>
            <li>164.312(e)(1) – Transmission security (if hashes are transmitted)</li>
          </ul>
        </div>

        <div className="custom-tooltip__section">
          <h4>Compliance impact:</h4>
          <p>
            High – This is a direct violation of the HIPAA Security Rule’s Technical Safeguards and would cause an audit failure.
          </p>
        </div>

   
        <div className="custom-tooltip__section">
          <h4>Regulatory context:</h4>
          <p>
            NIST SP 800-131A explicitly prohibits the use of MD5 for cryptographic purposes, and NIST SP 800-63B recommends using strong, salted password hashing functions such as Argon2, bcrypt, or PBKDF2. 
            These standards are referenced by HIPAA as the baseline for secure implementation.
          </p>
        </div>

        
        <div className="custom-tooltip__section">
          <h4>References:</h4>
          <ul>
            <li>
              <a 
                href="https://csrc.nist.gov/publications/detail/sp/800-131a/rev-2/final" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                https://csrc.nist.gov/publications/detail/sp/800-131a/rev-2/final
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Tooltipcard;
