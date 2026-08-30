'use client';

import Image from 'next/image';

import './index.scss';

const ClientsSection = () => {
  const clients = [
    {
      name: 'TechNaf',
      logo: '/images/common/tech.png',
      alt: 'TechNaf logo'
    },
    {
      name: '4A',
      logo: '/images/common/security.png',
      alt: '4A logo'
    },
    {
      name: 'Security Company',
      logo: '/images/common/jet.png',
      alt: 'Security company logo'
    }
  ];

  return (
    <section className="clientsSection" style={{clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)'}}>
      <div className="clientsSection__container">
        <div className="clientsSection__header">
          <h2 className="clientsSection__subtitle">OUR CLIENTS</h2>
          <h3 className="clientsSection__title">Trusted by Leading Organizations</h3>
        </div>
        
        <div className="clientsSection__logos">
          {clients.map((client, index) => (
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
    </section>
  );
};

export default ClientsSection;