'use client';

import Image from 'next/image';

import './index.scss';


const ComplianceEngine = () => {
  return (
    <div className="compliance-engine">
      <div className="compliance-engine__container">
        <div className="compliance-engine__grid">
          <div className="compliance-engine__content">
            <div>
              <h1 className="compliance-engine__heading">
                <span className="light">The &quot;Day One&quot;</span>
                <span className="bold"> HIPAA Compliance Engine</span>
              </h1>
            </div>

            <div className="compliance-engine__steps">
              <div className="step">
                <div className="line line--blue"></div>
                <div>
                  <h3>Connect</h3>
                  <p>
                    Integrate HIPAA Checker into your codebase or CI/CD pipeline in minutes, without complex installations or setup overhead.
                  </p>
                </div>
              </div>

              <div className="step step--indented-1">
                <div className="line line--purple"></div>
                <div>
                  <h3>Scan & Detect</h3>
                  <p>
                    Continuously scan code changes and infrastructure updates for potential HIPAA violations as they occur.
                  </p>
                </div>
              </div>

              <div className="step step--indented-2">
                <div className="line line--green"></div>
                <div>
                  <h3>Guided Remediation</h3>
                  <p>
                    Receive clear, actionable guidance for identified issues, including suggested fixes and remediation workflows.
                  </p>
                </div>
              </div>

              <div className="step step--indented-3">
                <div className="line line--light-blue"></div>
                <div>
                  <h3>Document & Report</h3>
                  <p>
                    Automatically collect and organize audit evidence, enabling straightforward reporting when audits or reviews are required.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="compliance-engine__image">
            <Image
              src="/images/common/mobilepic_2.png"
              alt="Hipaa Dashboard"
              width={700}
              height={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceEngine;