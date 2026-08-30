export const featuresTabs = [
  {
    slug: 'access-control',
    title: 'ACCESS CONTROL',
    subtitle: [
      {
        slug: 'uuid-tracking',
        subTitleName: 'UNIQUE USER ID TRACKING',
      },
      {
        slug: 'phi-emergency-access',
        subTitleName: 'PHI EMERGENCY ACCESS',
      },
      {
        slug: 'session-management',
        subTitleName: 'SESSION MANAGEMENT',
      },
      {
        slug: 'encryption-decryption',
        subTitleName: 'ENCRYPTION AND DECRYPTION',
      },
    ],
  },
  {
    slug: 'audit-controls',
    title: 'AUDIT CONTROLS ',
  },
  {
    slug: 'data-integrity',
    title: 'DATA INTEGRITY ',
    subtitle: [
      {
        slug: 'prevent-unauthorized-phi-alteration-destruction',
        subTitleName: 'PREVENT UNAUTHORIZED PHI ALTERATION AND DESTRUCTION',
      },
    ],
  },
  {
    slug: 'authentication',
    title: 'AUTHENTICATION ',
  },
  {
    slug: 'transmission-security',
    title: 'TRANSMISSION SECURITY ',
    subtitle: [
      {
        slug: 'integrity-controls-over-transmission',
        subTitleName: 'INTEGRITY CONTROLS OVER TRANSMISSION',
      },
      {
        slug: 'phi-encryption',
        subTitleName: 'PHI ENCRYPTION',
      },
    ],
  },
];

export const menuOfSubMenu = {
  'uuid-tracking': 'access-control',
  'phi-emergency-access': 'access-control',
  'session-management': 'access-control',
  'encryption-decryption': 'access-control',
  'prevent-unauthorized-phi-alteration-destruction': 'data-integrity',
  'integrity-controls-over-transmission': 'transmission-security',
  'phi-encryption': 'transmission-security',
};