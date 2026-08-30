export const vulnerabilityDropdownData = [
    {
        name: 'All',
        id: 'All',
        color: 'blue',
    },
    {
        name: 'Low',
        id: 'Low',
        color: 'green',
    },
    {
        name: 'Medium',
        id: 'Medium',
        color: 'yellow',
    },
    {
        name: 'High',
        id: 'High',
        color: 'red',
    },
    {
        name: 'Critical',
        id: 'critical',
        color: 'critical-red',
    },

];
export const CategoryDropdownData = [
    {
        name: 'Insufficient Authorization',
        id: 'Insufficient Authorization',
        color: 'white',
    },
    {
        name: 'Inadequate Data Security',
        id: 'Inadequate Data Security',
        color: 'white',
    },
    {
        name: 'Insecure Network Communication',
        id: 'Insecure Network Communication',
        color: 'white',
    },
    {
        name: 'Inconsistent Audit Trail',
        id: 'Inconsistent Audit Trail',
        color: 'white',
    },
];

export const vulnerabilityStatus = {
    High: 'High',
    Medium: 'Medium',
    Low: 'Low',
    Satisfactory: 'Satisfactory',
    Critical: 'Critical',
    All: 'All'
};

export const riskStatus = {
    CriticalRisk: 'Critical Risk',
    HighRisk: 'High Risk',
    MediumRisk: 'Medium Risk',
    LowRisk: 'Low Risk',
    NoRisk: 'No Risk',
};

export const hipaaScoreStatus = {
    CriticalStatus: 'Critical',
    LowStatus: 'Low',
    AverageStatus: 'Average',
    StandardStatus: 'Standard',
    HighStatus: 'High',
};

export const severityCount = {
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
};

export const platformType = {
    LARAVEL: 'laravel',
    ANDROID: 'apk',
    DJANGO: 'django',
    IOS: 'ios',
    EXPRESS: 'express',
    SPRING: 'spring',
    DOTNET: 'dotnet',
};

export const platformsDropdownData = [
    {
        id: 1,
        icon: 'android',
        title: 'Android',
        value: 'apk',
        width: 32,
        height: 32,
    },
    {
        id: 2,
        icon: 'ios',
        title: 'iOS',
        value: 'ios',
        width: 30,
        height: 30,
    },
    {
        id: 3,
        icon: 'laravel',
        title: 'PHP Laravel',
        value: 'laravel',
        width: 52,
        height: 32,
    },
    {
        id: 4,
        icon: 'python',
        title: 'Python Django',
        value: 'django',
        width: 32,
        height: 32,
    },
    {
        id: 5,
        icon: 'express',
        title: 'Express.JS',
        value: 'express',
        width: 32,
        height: 32,
    },
    {
        id: 6,
        icon: 'rails',
        title: 'Ruby on Rails',
        value: 'ror',
        width: 88,
        height: 29,
    },
    {
        id: 7,
        icon: 'spring',
        title: 'Spring Boot',
        value: 'spring',
        width: 32,
        height: 32,
    },
    {
        id: 8,
        icon: 'dotnet',
        title: '.NET',
        value: 'dotnet',
        width: 32,
        height: 32,
    },
];
export const colors = {
    cornellRed: '#ac0c22', // Same value as in _constant.scss
    red: '#f2415a',
    orange: '#ff9900',
    irisBlue: '#effeff',
    green: '#27be69',
};

export const featureArray = [
    {
        id: 1,
        title: 'Check and Validate Access Control Protocols',
        description:
            'Scan and fix vulnerabilities on Access Control technical safeguards for protecting electronic PHI and sensitive resources.',
        image: 'featureImage',
        slug: 'access-control',
    },
    {
        id: 2,
        title: 'Patient’s Unique Identity Tracking',
        description:
            'HIPAAChecker checks whether an application creates a unique primary key in the database for storing PHI.',
        image: 'featureImage',
        slug: 'uuid-tracking',
    },
    {
        id: 3,
        title: 'Evaluate Emergency Access Procedure',
        description:
            'HIPAAChecker evaluates authorization protocols and temporary access control for emergency access procedure.',
        image: 'featureImage',
        slug: 'phi-emergency-access',
    },
    {
        id: 4,
        title: 'Validate Session Management',
        description:
            'HIPAAChecker identify the exisiting methods for managing sessions in your codebase and check whether it is appropriate or not.',
        image: 'featureImage',
        slug: 'session-management',
    },
    {
        id: 5,
        title: 'Encryption and Decryption Procedure',
        description:
            'Checks the whether an application implement the National Institute of Standards and Technology (NIST) approved algorithm to protect PHI.',
        image: 'featureImage',
        slug: 'encryption-decryption',
    },
    {
        id: 6,
        title: 'Audit Controls',
        description:
            'Validate appropriate implementation of audit controls to record and examine activity that contains or uses PHI.',
        image: 'featureImage',
        slug: 'audit-controls',
    },
    {
        id: 7,
        title: 'PHI Data Integrity',
        description: 'Ensure the technical integrity of your system with HIPAAChecker',
        image: 'featureImage',
        slug: 'data-integrity',
    },
    {
        id: 8,
        title: 'PHI Access Authentication Validation',
        description: 'Scan authentication methods that can be employed in your software/application',
        image: 'featureImage',
        slug: 'authentication',
    },
    {
        id: 9,
        title: 'Network Transmission Security',
        description: 'Guard Against Unauthorized PHI Transmission Over Network Communication',
        image: 'featureImage',
        slug: 'transmission-security',
    },
    {
        id: 10,
        title: 'Integrity Controls Over Transmission',
        description:
            'HIPAAChecker measures access control, integrity controls, secure communication protocols, and PHI encryption methods.',
        image: 'featureImage',
        slug: 'integrity-controls-over-transmission',
    },
    {
        id: 11,
        title: 'Appropriate PHI Encryption',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        image: 'featureImage',
        slug: 'phi-encryption',
    },
];


export const severityMap = new Map();

severityMap.set(0, 'No');
severityMap.set(1, 'Low');
severityMap.set(2, 'Medium');
severityMap.set(3, 'High');
severityMap.set(4, 'Critical');


export const severityMapReverse = new Map();

severityMapReverse.set('no', 0);
severityMapReverse.set('low', 1);
severityMapReverse.set('medium', 2);
severityMapReverse.set('high', 3);
severityMapReverse.set('critical', 4);


export const severityColorMap = new Map();

severityColorMap.set(0, 'green')
severityColorMap.set(1, 'iris-blue')
severityColorMap.set(2, 'orange')
severityColorMap.set(3, 'red')
severityColorMap.set(4, 'cornell-red')
