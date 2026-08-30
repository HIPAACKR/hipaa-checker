'use client';
import Image from 'next/image';

import './index.scss';

const SystemRequirements = () => {
  const requirements = [
    {
      component: 'Docker Engine',
      requirement: 'Version 20.10 or higher',
      check: 'YES',
    },
    {
      component: 'Docker Compose',
      requirement: 'Version 2.0 or higher',
      check: 'YES',
    },
    {
      component: 'Operating System',
      requirement: 'Linux, macOS, or Windows (with WSL2)',
      check: 'YES',
    },
    {
      component: 'RAM',
      requirement: 'Minimum 4 GB (8 GB recommended)',
      check: 'YES',
    },
    {
      component: 'Storage',
      requirement: 'Minimum 10 GB free space',
      check: 'YES',
    },
    {
      component: 'Network Ports',
      requirement: '3000, 5002, 5432, 6379 must be available',
      check: 'YES',
    },
  ];

  return (
    <section className="requirementsSection">
      <div className="requirementsSection__container">
        <h2 className="requirementsSection__title">
          System <span>Requirements & Prerequisites</span>
        </h2>
        <div className="requirementsTable">
          <div className="requirementsTable__header">
            <div>Component</div>
            <div>Requirement</div>
            <div>Requirement Check</div>
          </div>

          {requirements.map((item, index) => (
            <div className="requirementsTable__row" key={index}>
              <div>{item.component}</div>
              <div>{item.requirement}</div>
              <div className="requirementsTable__check">
                <Image
                  src="/images/icons/rightsign.svg"
                  alt="check"
                  className="rightSignIcon"
                  width={28}
                  height={28}
                />
                {item.check}
              </div>
            </div>
          ))}
          <div className="requirementsTable__mobile">
            <div className="requirementsTable__column">
              <h4>Component</h4>
              {requirements.map((r, i) => (
                <p key={i}>{r.component}</p>
              ))}
            </div>

            <div className="requirementsTable__column">
              <h4>Requirement</h4>
              {requirements.map((r, i) => (
                <p key={i}>{r.requirement}</p>
              ))}
            </div>

            <div className="requirementsTable__column">
              <h4>Requirement Check</h4>
              {requirements.map((r, i) => (
                <p key={i} className='requirementsTable__check'>
                  {r.check === 'YES' && (
                    <Image
                      src="/images/icons/rightsign.svg"
                      alt="check"
                      className="rightSignIcon"
                      width={28}
                      height={28}
                    />
                  )}
                  {r.check}
                </p>
              ))}
            </div>
          </div>        
        </div>
      </div>
    </section>
  );
};

export default SystemRequirements;
