'use client';

import Heading from '@/components/heading';
import Text from '@/components/text';

import './index.scss';

const capabilities = [
  {
    title: 'Pre-Built & Ready to Deploy',
    description: 'Start instantly with pre-packaged Docker images.',
  },
  {
    title: 'HIPAA-Grade Protection',
    description: 'Enforces encryption, access control, and audit trails.',
  },
  {
    title: 'Full Data Control',
    description: 'All PHI remains securely within your infrastructure.',
  },
  {
    title: 'Cross-Platform Support',
    description: 'Compatible with Linux, macOS, and Windows with Docker Desktop and Git Bash.',
  },
  {
    title: 'Scalable & Resilient',
    description: 'Designed to scale with enterprise workloads.',
  },
  {
    title: 'Continuous Monitoring',
    description: 'Automated checks for vulnerabilities and compliance gaps.',
  },
];

const KeyCapabilities = () => {
  return (
    <div className="CapabilitiesContainer">
      <div className="CapabilitiesContainer__badge">Key Capabilities</div>

      <Heading
        type="h3"
        color="primary-900"
        align="center"
        weight="light"
        className="CapabilitiesContainer__heading"
      >
        Key <span>Capabilities & Features</span>
      </Heading>

      <div className="CapabilitiesContainer__grid">
        {capabilities.map((item, index) => (
          <div className="CapabilitiesContainer__item" key={index}>
            <span className="CapabilitiesContainer__check">✓</span>

            <Text
              size="fs-18"
              color="neutral-700"
              align="left"
              className="CapabilitiesContainer__text"
            >
              <strong>{item.title}</strong> – {item.description}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyCapabilities;