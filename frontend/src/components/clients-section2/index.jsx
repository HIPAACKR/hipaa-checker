'use client';

import Image from 'next/image';

import './index.scss';

const ClientsSectiontwo = () => {
  const trustedClients = [
    { name: 'TechNaf', logo: '/images/common/tech.png', alt: 'TechNaf logo' },
    { name: '4A', logo: '/images/common/security.png', alt: '4A logo' },
    { name: 'Security Company', logo: '/images/common/jet.png', alt: 'Security company logo' }
  ];

  const featuredIn = [
    { name: 'HIPAA Journal', logo: '/images/common/journal.png', alt: 'HIPAA Journal logo' },
    { name: 'ResearchGate', logo: '/images/common/gate.png', alt: 'ResearchGate logo' },
    { name: 'Florida Expert Net', logo: '/images/common/florida.png', alt: 'Florida Expert Net logo' }
  ];

  return (
    <section className="clientsSection">
      <div className="clientsSection__container clientsSection__twoColumn">
        {/* Left Column */}
        <div className="clientsSection__column">
          <h3 className="clientsSection__title">Trusted by Leading Organizations</h3>
          <div className="clientsSection__logos">
            {trustedClients.map((client, index) => (
              <div key={index} className="clientsSection__logoCard">
                <Image
                  src={client.logo}
                  alt={client.alt}
                  width={180}
                  height={80}
                  className="clientsSection__logoImage"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="clientsSection__column">
          <h3 className="clientsSection__title">Featured In</h3>
          <div className="clientsSection__logos">
            {featuredIn.map((client, index) => (
              <div key={index} className="clientsSection__logoCard">
                <Image
                  src={client.logo}
                  alt={client.alt}
                  width={180}
                  height={80}
                  className="clientsSection__logoImage"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSectiontwo;
