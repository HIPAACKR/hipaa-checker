'use client';

import Image from 'next/image';

import Button from '@/components/button';
import EnterpriseVideoSection from '@/components/EnterpriseVideoSection';
import Heading from '@/components/heading';
import KeyCapabilities from '@/components/KeyCapabilities';
import Text from '@/components/text';

import './index.scss';

const enterpriseFeatures = [
  {
    icon: 'i1',
    title: 'Data Control & Ownership',
    description:
      'Maintain direct control over how protected health information (PHI) is stored, accessed, and managed within your own infrastructure.',
  },
  {
    icon: 'i2',
    title: 'Trusted Security Controls',
    description:
      'Configurable firewalls, intrusion detection mechanisms, and physical security controls aligned with HIPAA requirements.',
  },
  {
    icon: 'i3',
    title: 'Compliance Readiness',
    description:
      'Support oversight of policies, procedures, and technical safeguards in accordance with HIPAA Security and Privacy Rules.',
  },
  {
    icon: 'i4',
    title: 'Reduced External Risk',
    description:
      'Limit dependence on third-party cloud providers to reduce the risk of unauthorized access or data exposure.',
  },
  {
    icon: 'i5',
    title: 'Offline Availability',
    description:
      'Ensure access to critical applications and data during network outages to support operational continuity.',
  },
  {
    icon: 'i6',
    title: 'Controlled Management',
    description:
      'Implement role-based access, audit logging, and authentication controls to support secure handling of PHI.',
  },
  {
    icon: 'i1',
    title: 'Verified Deployment Integrity',
    description:
      'Every deployment is protected by checksum verification of all Docker images before loading.',
  },
  {
    icon: 'i2',
    title: 'Built-In Backup and Recovery',
    description:
      'PostgreSQL and Redis persistence ensure secure, durable data storage with automated backup and recovery support.',
  },
  {
    icon: 'i3',
    title: 'Multi-Platform Coverage',
    description:
      'HIPAAChecker Enterprise scans across your entire application portfolio from a single on-premise deployment.',
  },
];

const overviewSections = [
  {
    title: 'Enterprise HIPAA Compliance, Reimagined',
    description:
      'Our platform centralizes compliance management across infrastructure, workforce access, policies, vendors, and operational safeguards—helping organizations stay audit-ready at scale.',
    image: '/images/common/solution-dashboard.svg',
    points: [
      'Continuous HIPAA safeguard monitoring',
      'Automated evidence collection & reporting',
      'AI-powered remediation recommendations',
      'Centralized PHI security governance',
      'Real-time compliance visibility',
    ],
  },
  {
    title: 'Protect PHI with Continuous Security Oversight',
    description:
      'Healthcare compliance is an ongoing operational responsibility. HIPAAChecker continuously validates HIPAA controls across applications, users, devices, and third-party systems.',
    image: '/images/common/solution-score.svg',
    reverse: true,
    points: [
      'Real-time access control validation',
      'Continuous audit log monitoring',
      'Policy & documentation management',
      'Vendor & BAA oversight',
      'Security gap detection & remediation',
    ],
  },
  {
    title: 'Built for Enterprise Healthcare Operations',
    description:
      'HIPAAChecker is designed to support complex healthcare ecosystems with scalable compliance automation, multi-organization governance, and centralized operational oversight.',
    image: '/images/common/solution-code-highlight.svg',
    points: [
      'Multi-entity compliance management',
      'Enterprise-grade access governance',
      'Cross-department compliance visibility',
      'Centralized remediation workflows',
      'Audit-ready evidence repository',
    ],
  },
];

const whyChooseItems = [
  {
    title: 'Continuous Compliance Visibility',
    description:
      'Gain real-time insight into HIPAA safeguards, operational risks, remediation progress, and overall compliance posture.',
  },
  {
    title: 'Automation-Driven Efficiency',
    description:
      'Reduce repetitive manual tasks through automated evidence collection, control monitoring, and policy management workflows.',
  },
  {
    title: 'Enterprise-Scale Governance',
    description:
      'Manage complex healthcare environments, distributed teams, and multiple entities through centralized compliance operations.',
  },
  {
    title: 'AI-Powered Remediation',
    description:
      'Accelerate issue resolution with intelligent remediation guidance and risk-based prioritization workflows.',
  },
];

const EnterpriseSolution = () => {
  return (
    <div className="productDetails enterprisePage">
      <section className="enterpriseHero">
        <div className="enterpriseHero__container">
          <div className="enterpriseHero__badge">Enterprise for Self-Hosted</div>

          <Heading type="h1" color="white" align="center">
            Enterprise Self-Hosted Solution For
            <span> HIPAA</span>
          </Heading>

          <Text size="fs-18" color="white" align="center">
            Our One-Stop, Self-Hosted HIPAA Compliance Platform for Enterprise Use.
          </Text>

          <div className="enterpriseHero__actions">
            <Button
              size="large"
              type="primary"
              radius="pill"
              icon="arrowRight"
              animateIcon={true}
              iconPosition="after"
              onClick={() => {
                window.location.href = '/sign-in';
              }}
            >
              Get Started
            </Button>

            <Button
              size="large"
              type="secondary"
              radius="pill"
              icon="arrowRight"
              animateIcon={true}
              iconPosition="after"
              onClick={() => {
                window.location.href = '/contact-us';
              }}
            >
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      <section className="enterpriseOverview">
        <div className="enterpriseOverview__container">
          <div className="enterpriseSectionHeader">
            <span>Overview</span>

            <Heading type="h2" color="primary-900" align="center" weight="light">
              Enterprise Self-Hosted Solution For HIPAA
              <br />
              Compliance
            </Heading>

            <Text size="fs-18" color="primary-900" align="center">
              Deploy and manage enterprise-grade self-hosted compliance infrastructure with centralized control,
              continuous monitoring, secure data ownership, and audit-ready operational visibility.
            </Text>
          </div>

          <div className="enterpriseOverview__list">
            {overviewSections.map((section, index) => (
              <div
                className={`enterpriseOverview__item ${
                  section.reverse ? 'enterpriseOverview__item--reverse' : ''
                }`}
                key={index}
              >
                <div className="enterpriseOverview__content">
                  <Heading type="h3" color="primary-900" align="left">
                    {section.title}
                  </Heading>

                  <Text size="fs-18" color="primary-900" align="left">
                    {section.description}
                  </Text>

                  <ul>
                    {section.points.map((point, pointIndex) => (
                      <li key={pointIndex}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="enterpriseOverview__image">
                  <Image
                    src={section.image}
                    alt={section.title}
                    width={520}
                    height={360}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="enterpriseCta">
        <div className="enterpriseCta__container">
          <span>Book a Demo</span>

          <Heading type="h2" color="white" align="center" weight="light">
            Are You Ready To Automate Enterprise Self-Hosted
            <br />
            Solution For HIPAA?
          </Heading>

          <Text size="fs-18" color="white" align="center">
            Discover how HIPAAChecker automates Enterprise Self-Hosted solution for HIPAA with continuous monitoring,
            AI-powered remediation, and audit-ready evidence collection.
          </Text>

          <Button
            size="large"
            type="primary"
            radius="pill"
            icon="arrowRight"
            animateIcon={true}
            iconPosition="after"
            onClick={() => {
              window.location.href = '/contact-us';
            }}
          >
            Book a Demo
          </Button>
        </div>
      </section>

      <section className="productDetails__container-background">
        <div className="EnterpriseContainer">
          <div className="enterpriseSectionHeader enterpriseSectionHeader--features">
            <span>Key Features</span>

            <Heading type="h2" color="primary-900" align="center" weight="light">
              Enterprise-Grade <strong>Capabilities</strong>
            </Heading>
          </div>

          <div className="EnterpriseItems">
            {enterpriseFeatures.map((item, index) => (
              <div key={index} className="EnterpriseItems__card">
                <div className="EnterpriseItems__card__header">
                  <Image
                    className="EnterpriseItems__card__icon"
                    src={`/images/icons/${item.icon}.svg`}
                    alt={item.title}
                    width={44}
                    height={44}
                  />

                  <Heading type="h3" color="primary-900" align="left">
                    {item.title}
                  </Heading>
                </div>

                <div className="EnterpriseItems__card__textWrapper">
                  <Text size="fs-18" color="neutral-700" align="left">
                    {item.description}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="KeyCapabilities">
        <KeyCapabilities />
      </section>

      <section className="EnterpriseVideoSectionWrapper">
        <EnterpriseVideoSection />
      </section>

      <section className="whyChooseEnterprise">
        <div className="whyChooseEnterprise__container">
          <div className="enterpriseSectionHeader">
            <span>Why Choose Us</span>

            <Heading type="h2" color="primary-900" align="center" weight="light">
              Why Choose Ubicomply for <strong>Enterprise Solutions</strong>
            </Heading>
          </div>

          <div className="whyChooseEnterprise__grid">
            <div className="whyChooseEnterprise__content">
              {whyChooseItems.map((item, index) => (
                <div className="whyChooseEnterprise__item" key={index}>
                  <Heading type="h3" color="primary-600" align="left">
                    {item.title}
                  </Heading>

                  <Text size="fs-18" color="primary-900" align="left">
                    {item.description}
                  </Text>
                </div>
              ))}
            </div>

            <div className="whyChooseEnterprise__image">
              <Image
                src="/images/common/Laptop.png"
                alt="Enterprise compliance dashboard"
                width={560}
                height={420}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EnterpriseSolution;