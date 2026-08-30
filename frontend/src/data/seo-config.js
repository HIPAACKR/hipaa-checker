export const createMetadata = (title, description, path = '', keywords = [], noindex = false) => {
  const baseUrl = 'https://hipaachecker.com';
  const fullUrl = `${baseUrl}${path}`;
  
  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords: ['HIPAA compliance', 'security solutions', 'access control', 'healthcare security', 'data protection', ...keywords],
    authors: [{ name: 'HIPAAChecker' }],
    creator: 'HIPAAChecker',
    publisher: 'HIPAAChecker',
    robots: {
      index: !noindex,
      follow: true,
      googleBot: {
        index: !noindex,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: fullUrl,
      siteName: 'HIPAAChecker',
      title,
      description,
      images: [
        {
          url: '/images/common/herosection-image.jpg',
          width: 1200,
          height: 630,
          alt: 'HIPAAChecker - HIPAA Compliance Services',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/common/herosection-image.jpg'],
      creator: '@hipaachecker',
      site: '@hipaachecker',
    },
    alternates: {
      canonical: fullUrl,
    },
    category: 'Healthcare Security',
  
    other: {
        'google-site-verification': 'Sd1cx4rzEP6Gy2BtGajaov8wGMyRTDbl_Wavz5NvG3s',
    
    },
  };
};

export const landingPageMetadata = createMetadata(
  'Top Security & HIPAA Compliance Services | Access Control Solutions',
  'Protect your business with expert security solutions, HIPAA compliance, and access control systems. Trust our professionals to secure your data and privacy.',
  '',
  ['vulnerability scanning', 'technical safeguards']
);

export const featuresPageMetadata = createMetadata(
  'Access Control Features for HIPAA Compliance | HIPAA Checker',
  'Discover the key access control features for HIPAA compliance with HIPAA Checker. Ensure your organization\'s data privacy and security with our expert solutions.',
  '/features',
  ['access control features', 'data privacy', 'technical safeguards']
);

export const productsPageMetadata = createMetadata(
  'HIPAA Compliance Products | HIPAA Checker Solutions',
  'Explore HIPAA compliance products from HIPAA Checker to secure your business. Access tools and solutions for data privacy, security, and regulatory adherence.',
  '/products',
  ['compliance products', 'security tools', 'regulatory adherence']
);

export const pricingPageMetadata = createMetadata(
  'HIPAA Compliance Pricing | Affordable Solutions | HIPAA Checker',
  'Check out HIPAA Checker\'s pricing plans for affordable and reliable HIPAA compliance solutions. Choose the best plan for your business\'s data security needs.',
  '/pricing',
  ['pricing plans', 'affordable solutions', 'subscription plans']
);
// export const documentationPageMetadata = createMetadata(
//   'HIPAA Compliance Pricing | Affordable Solutions | HIPAA Checker',
//   'Check out HIPAA Checker\'s pricing plans for affordable and reliable HIPAA compliance solutions. Choose the best plan for your business\'s data security needs.',
//   '/documentation',
//   ['pricing plans', 'affordable solutions', 'subscription plans']
// );

export const downloadsPageMetadata = createMetadata(
  'HIPAA Compliance Downloads | Tools & Resources | HIPAA Checker',
  'Access essential HIPAA compliance tools and resources for your business. Download software and documentation to ensure data security and regulatory adherence with HIPAA Checker.',
  '/downloads',
  ['downloads', 'tools', 'resources', 'documentation']
);

export const developerGuideMetadata = createMetadata(
  'HIPAA Compliance Developer Guidelines | HIPAA Checker',
  'Explore the HIPAA compliance developer guidelines at HIPAA Checker. Learn how to integrate secure solutions and meet regulatory standards in your applications.',
  '/developer-guideline',
  ['developer guidelines', 'integration', 'regulatory standards', 'API']
);

export const userGuideMetadata = createMetadata(
  'HIPAA Compliance User Guidelines | HIPAA Checker',
  'Learn how to use HIPAA Checker with our comprehensive user guidelines. Ensure your business stays compliant with HIPAA regulations and secures sensitive data.',
  '/user-guideline',
  ['user guidelines', 'user manual', 'compliance training']
);

export const contactUsPageMetadata = createMetadata(
  'Contact Us | HIPAAChecker',
  'Get in touch with the HIPAAChecker team. We\'re here to help with any questions you have about our HIPAA compliance solutions.',
  '/contact-us',
  ['contact', 'support', 'help', 'questions']
);

export const privacyPolicyPageMetadata = createMetadata(
  'Privacy Policy | HIPAAChecker',
  'Read the HIPAAChecker privacy policy to understand how we collect, use, and protect your data. We are committed to ensuring the privacy and security of your information.',
  '/privacy-policy',
  ['privacy policy', 'data protection', 'terms of service']
);

export const termsConditionsPageMetadata = createMetadata(
  'Terms & Conditions | HIPAAChecker',
  'Read the terms and conditions for using the HIPAAChecker website and services. Your use of our services is subject to these terms.',
  '/terms-conditions',
  ['terms and conditions', 'legal', 'service agreement']
);

export const authPageMetadata = createMetadata(
  'Authentication | HIPAAChecker',
  'HIPAAChecker authentication page.',
  '/auth',
  [],
  true
);

export const landingPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'HIPAAChecker',
  description: 'Leading HIPAA compliance technology that certifies healthcare applications and software/tools in compliance with the Health Insurance Portability and Accountability Act of 1996 (HIPAA)',
  url: 'https://hipaachecker.com',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Web-based',
  offers: {
    '@type': 'Offer',
    category: 'HIPAA Compliance Services',
    itemOffered: {
      '@type': 'Service',
      name: 'HIPAA Technical Safeguards Compliance',
      description: 'Complete solutions to security measures and vulnerability scanning, fixing, and certifying healthcare applications according to HIPAA technical safeguards'
    }
  },
  author: {
    '@type': 'Organization',
    name: 'HIPAAChecker',
    url: 'https://hipaachecker.com'
  },
  featureList: [
    'Access Control',
    'Audit Controls', 
    'Integrity Controls',
    'Person or Entity Authentication',
    'Transmission Security'
  ]
};