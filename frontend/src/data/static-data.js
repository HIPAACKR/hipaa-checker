export const landingPage = {
  hero: {
    title: '',
    description:
      'HIPAA compliance is embedded into your development workflow from day one, allowing your team to focus on building features rather than managing compliance documentation.',
  },
  compliancePainPoints: {
    title: '',
    items: [
      {
        title: 'Constant Context Switching',
        icon: 'thinking.png',
        description:
          'Developers are forced to move between building features and interpreting complex HIPAA requirements, interrupting focus and reducing overall productivity.',
      },
      {
        title: 'Release Delays',
        icon: 'fire.png',
        description:
          'Late-stage compliance reviews delay deployments, introduce last-minute changes, and increase the risk of quality issues.',
      },
      {
        title: 'High-Stakes Errors',
        icon: 'cost.png',
        description:
          'Compliance gaps can lead to significant financial penalties and long-term reputational impact for both individuals and organizations.',
      },
    ],
  },
  safeguards: {
    title: '',
    description_1: 'The Security Rule defines technical safeguards in § 164.304 as',
    description_2:
      '“the technology and the policy and procedures for its use that protect electronic protected health information and control access to it”',
    items: [
      {
        icon: 'keyShadow',
        title: 'Access Control',
        description:
          'Standards that define how systems uniquely identify users, manage emergency access, enforce automatic logoff, and apply encryption and decryption to protect electronic health information.',
        url: 'access-control',
      },
      {
        icon: 'checkedBlueShadow',
        title: 'Integrity',
        description: 'Controls that ensure electronic protected health information remains accurate, complete, and unaltered.',
        url: 'data-integrity',
      },
      {
        icon: 'lockShadow',
        title: 'Transmission Security',
        description:
          'Safeguards that protect electronic health information from unauthorized access or modification during network transmission through integrity controls and encryption.',
        url: 'transmission-security',
      },
      {
        icon: 'notesShadow',
        title: 'Audit Controls',
        description: 'Mechanisms that record and monitor system activity involving electronic health information.',
        url: 'audit-controls',
      },
      {
        icon: 'guardShadow',
        title: 'Person or Entity Authentication',
        description: 'Processes that verify users or systems are who they claim to be before access is granted.',
        url: 'authentication',
      },
    ],
  },
Enterprise: {
    title: '',
    items: [
      {
        icon: 'i1',
        title: 'Data Control & Ownership',
        description:
          'Maintain direct control over how protected health information (PHI) is stored, accessed, and managed within your own infrastructure.',
      
      },
      {
        icon: 'i2',
        title: 'Trusted Security Controls',
        description: 'Configurable firewalls, intrusion detection mechanisms, and physical security controls aligned with HIPAA requirements.',
    
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
        description: 'Limit dependence on third-party cloud providers to reduce the risk of unauthorized access or data exposure.',
        
      },
      {
        icon: 'i5',
        title: 'Offline Availability',
        description: 'Ensure access to critical applications and data during network outages to support operational continuity.',
   
      },
      {
        icon: 'i6',
        title: 'Controlled Management',
        description: 'Implement role-based access, audit logging, and authentication controls to support secure handling of PHI.',
   
      },
    ],
  },

  keyFeatures: {
    title: 'Discover The Power Behind HipaaChecker\n Our Key Features',
    description: 'Discover The Power Behind HipaaChecker Our Key Features',
    features: [
      {
        image: 'featureImage',
        title: 'PHI access rights and authorization',
        description:
          'Enhance data security with robust PHI access controls. Ensure compliance with HIPAA regulations effortlessly',
        slug: 'phi-rights-authorization',
      },
      {
        image: 'featureImage',
        title: 'Encryption and decryption protocol',
        description:
          'Safeguard PHI transmission across network communications. Mitigate risks of unauthorized data breaches effectively',
        slug: 'encryption-decryption-protocol',
      },
      {
        image: 'featureImage',
        title: 'Personal health record (PHI) encryption',
        description:
          'Protect personal health records with advanced encryption protocols.\nMaintain patient confidentiality with seamless encryption solutions',
        slug: 'personal-health-record-encryption',
      },
      {
        image: 'featureImage',
        title: 'Prevent unauthorized PHI alteration and destruction',
        description:
          'Track patient identities with precision and accuracy. Ensure accountability through comprehensive user session tracking',
        slug: 'prevent-unauthorized-phi',
      },
      {
        image: 'featureImage',
        title: 'PHI access authentication validation',
        description:
          'Verify PHI access with stringent authentication protocols. Empower users with secure and authorized data access',
        slug: 'phi-authentication-validation',
      },
      {
        image: 'featureImage',
        title: 'Guard against unauthorized PHI transmission over network communication',
        description:
          'Preserve PHI integrity against unauthorized alterations. Prevent data tampering during transmission for heightened security',
        slug: 'guard-against-unauthorized-phi',
      },
    ],
  },
  gainWithHIPAAChecker: {
    title: '',
    gains: [
      {
        stat: '',
        title: (
          <>
            Faster
            <br />
            Audit Readiness
          </>
        ),
        description: 'Spend more time building product and less time managing compliance documentation.',
      },
      {
        stat: '',
        title: 'Automated Documentation',
        description: 'Generate audit logs, policies, and supporting evidence with clearly defined remediation guidance.',
      },
      {
        stat: '20+',
        title: 'Days Saved Per Fix',
        description: 'Identify and address HIPAA-related issues earlier in the development lifecycle to avoid release delays.',
      },
    ],
    image: 'gain.png',
  },

  solutions: {
    title: 'What are we providing?',
    description1:
      'The HIPAAChecker provides a complete solutions to security measures and vulnerability scanning, fixing, and certifying healthcare applications, and software/ tools according to ',
    link1: 'HIPAA technical safeguards',
    link2: 'www.cms.hhs.gov',
    description2: 'and CMS Regulations and Guidance at',
    url1: 'https://www.hhs.gov/sites/default/files/ocr/privacy/hipaa/administrative/securityrule/techsafeguards.pdf',
    url2: 'https://www.cms.hhs.gov',
    safety: {
      title: 'Safety Certified',
      description:
        'The HIPAAChecker provides a complete solution to security measures and vulnerability scanning, fixing and certifying healthcare applications, software and tools according to HIPAA technical safeguards.',
    },
    component: {
      title: 'Key Components',
      description:
        'Privacy of your codebase, HIPAA reports, HIPAA scoring, vulnerability levels, code segment highlighting, and fixing suggestions',
    },
    visualization: {
      title: 'Advanced Visualization',
      description:
        'Visualize HIPAA reports with advanced filtering, navigation, and security measures',
    },
    implementation: {
      title: 'Implementation',
      description:
        'Entities can choose suitable security measures, conduct risk assessments, and train staff from HIPPAChecker experts to meet HIPAA standards',
    },
    securityDetails: {
      title: 'Security Details',
      description:
        'Strong encryption, firewalls, intrusion detection, and multi-factor authentication protect ePHI and guard sensitive data',
    },
    examples: {
      title: 'Examples',
      description:
        'Strong encryption, firewalls, intrusion detection, and multi-factor authentication protect ePHI and guard sensitive data',
    },
  },

  facilities: {
    title: ' HIPAAChecker to Certify Software/ Tools of These Healthcare Facilities',
    items: [
      'Ambulatory Surgical Centers (ASCs)',
      'Community Mental Health Centers (CMHCs)',
      'Comprehensive Outpatient Rehabilitation Facilities (CORFs)',
      'End-Stage Renal Disease (ESRD) Facilities',
      'Federally Qualified Health Centers (FQHCs)',
      'Home Health Agencies (HHAs)',
      'Hospices and Hospitals',
      'Clinics, Rehabilitation Agencies, and Public Health Agencies as Providers of Outpatient Physical Therapy and Speech-Language Pathology Services (OPT/OSP)',
      'Portable X-Ray (PXR)',
      'Skilled Nursing Facilities (SNF)',
    ],
  },
  product: {
    title: 'Our Products',
    description: 'Solutions designed to help applications meet HIPAA technical safeguard requirements across platforms and frameworks.',
  },
  TrustedBySection: {
    title: '',
    testimonial:
      '“HIPAAChecker has a transparent model to identify security vulnerabilities, ensuring our data remains secure and compliant with HIPAA guidelines.”',
    user: {
      name: 'Ben Goodman',
      designation: 'CEO, 4A Security & Compliance',
    },
  },


  // clients: {
  //   title: 'Clients',
  //   description: 'Trusted by Leading Organizations',
  //   items: [
  //     { icon: 'technaf.svg', url: 'https://technaf.com' },
  //     { icon: '4a-aliance.svg', url: '/#' },
  //     { icon: 'jet-constellations.svg', url: 'https://jetconstellations.com' },
  //   ],
  // },
  // testimonial: [
  //   {
  //     companyLogo: '4a-aliance.svg',
  //     comment:
  //       'HIPAAChecker has a transparent model to identify security vulnerabilities, ensuring our data remains secure and compliant with HIPAA guidelines.',
  //     user: {
  //       avatar: 'ben-goodman',
  //       name: 'Ben Goodman',
  //       designation: 'CEO, 4A Security & Compliance',
  //     },
  //   },
  // ],

  userGuidelineData: [
    {
      title: 'Step 1: Login and Subscribe',
      description: 'At first login or sign up to the system. Then subscribe a plan.',
    },
    {
      title: 'Step 2: Uploading process',
      description: 'You can upload a file or GitHub url in this system.',
      image: 'uploading-process',
    },
    {
      title: 'More on this topic',
    },
    {
      title: 'Step 3: Scan Process',
      description: 'After upload your file click <b>Extract and Scan</b> for scanning.',
      image: 'scan-process',
    },
    {
      title: 'Step 4: See analysis report',
      description:
        'After click extract and scan system will generate a report and show me the score.',
      image: 'analysis-report',
    },
    {
      title: 'Step 5: Report show',
      description: 'After click  it redirect me a report page based on project file.',
      image: 'report-show',
    },
    {
      title: 'Step 6: Vulnerable code line.',
      description: 'If you click show in code, It redirect you the code view page.',
      image: 'vulnerable-code-line',
    },
    {
      title: 'Step 7: Summarise Report',
      description: 'Here you will see a report based on rules specific.',
      image: 'summarize-report',
    },
    {
      title: 'Step 8: Report show based on rule.',
      description: 'You will find rules based details report in here.',
      image: 'report-show-based-on-rule',
    },
    {
      title: 'Step 9: Scanned application list',
      description: 'All the list will be available in here',
      image: 'scanned-application-list',
    },
  ],






  androidGuidelineData: [
    {
      title: 'Step 1: Download plugin',
      description: `
        <div>
          Download latest hipaachecker 
          <strong>build version 1.0.8</strong> 
          <a href="/downloads" class="developerGuidelineAndroid__install-step__link">Click here to Download.</a>
        </div>`,
    },
    {
      title: 'Step 2: Create a hidden file',
      description: `
        <div>
          You need to create a hidden file named 
          <span class="developerGuidelineAndroid__install-step__tag developerGuidelineAndroid__install-step__tag--red">.hipaa_jwt</span> 
          into your Android project\'s root directory.
        </div>`,
    },
    {
      title: 'Step 3: Collect API credentials',
      description: `
        <div>
          Get and copy your API credentials from here 
          <a href="#" class="developerGuidelineAndroid__install-step__link">Go to API Credential.</a>
        </div>`,
    },
    {
      title: 'Step 4: Copy and paste',
      description: `
        <div>
          Put the copied 
          <strong class="developerGuidelineAndroid__install-step__bold-text developerGuidelineAndroid__install-step__bold-text--medium">API KEY(jwt token)</strong> 
          into this hidden file and save it. Sample of API Key inside 
          <span class="developerGuidelineAndroid__install-step__tag developerGuidelineAndroid__install-step__tag--red">.hipaa_jwt</span>
          file as below:<br/><br/>
          <img 
            src="/images/common/copy-and-paste.svg" 
            alt="Copy and paste API key" 
            class="developerGuidelineAndroid__install-step__instruction-image developerGuidelineAndroid__install-step__instruction-image--copy-paste"
          />
        </div>`,
    },
    {
      title: 'Step 5: Install plugin',
      description: `
        <div>
          Install the plugin using 
          <span class="developerGuidelineAndroid__install-step__tag developerGuidelineAndroid__install-step__tag--grey">Install Plugin from Disk...</span> 
          option from your Android Studio settings.<br/>
          <strong class="developerGuidelineAndroid__install-step__bold-text developerGuidelineAndroid__install-step__bold-text--regular">File -> Settings -> Plugins</strong><br/><br/>
          <img 
            src="/images/common/install-plugin.svg" 
            alt="Install plugin from disk" class="developerGuidelineAndroid__install-step__instruction-image" 
          />
        </div>`,
    },
    {
      title: 'Step 6: Installation status',
      description: `
        <div>
          If the plugin is installed successfully, it will look like this as below:<br/><br/>
          <img 
            src="/images/common/installation-status.svg" 
            alt="Installation status" 
            class="developerGuidelineAndroid__install-step__instruction-image" 
          />
        </div>`,
      image: 'installation-status',
    },
    {
      title: 'Step 7: Menu placement for "Check HIPAA Compliances" in IDE',
      description: `
        <div>
          After the plugin gets installed, there will be a menu named 
          <span class="developerGuidelineAndroid__install-step__tag developerGuidelineAndroid__install-step__tag--grey">Check HIPAA Compliances</span> 
          into the main menu on right most place in Mac and in Linux(Ubuntu), there will be Check HIPAA in the main menu and then Check HIPAA Compliances will be as sub menu.<br/><br/>
          <img 
            src="/images/common/menu-placement.svg" 
            alt="Menu placement for Check HIPAA Compliances" 
            class="developerGuidelineAndroid__install-step__instruction-image developerGuidelineAndroid__install-step__instruction-image--placement" 
          />
          <br/>Upon clicking on the menu, there will be a few sequential dialogues and you will get the HIPAA report link in your email Inbox after a while.
        </div>`,
    },
    {
      title: 'Step 8: Uninstall process!',
      description: `
        <div>
          It is pretty easy to uninstall or disable the plugin from the options on gear icon of the plugin as below:<br/><br/>
          <img 
            src="/images/common/uninstall-process.svg" 
            alt="Uninstall process" 
            class="developerGuidelineAndroid__install-step__instruction-image developerGuidelineAndroid__install-step__instruction-image--uninstall-process"
          />
        </div>`,
    },
  ],

  xcodeGuidelineData: [
    {
      title: 'Step 1: Create Project',
      description: `
        <div>
          From the iOS IDE - Xcode, create a project
        </div>`,
    },
    {
      title: 'Step 2: Add Package',
      description: `
        <div>
          Click on the File option Xcode and click 
          <span style="color: #c16f6f; font-weight: bold;">"Add Package...."</span>
        </div>`,
    },
    {
      title: 'Step 3: Download Package from Github',
      description: `
        <div>
          <span class="step-number">1.</span> Search for HIPAAChecker-iOS or paste the GitHub repository link.<br/>
          <span class="step-number">2.</span> Select the main branch.<br/>
          <span class="step-number">3.</span> Click 
          <span style="color: #c16f6f; font-weight: bold;">"Add Package"</span>.<br/>
          <span class="step-number">4.</span> 
          HIPAAChecker main will be shown in the project Package Dependencies.
        </div>`,
    },
    {
      title: 'Step 4: Project Build Phase configuration',
      description: `
        <div>
          <span class="step-number">1.</span> Select the project file in Xcode.<br/>
          <span class="step-number">2.</span> Go to Build Phases.<br/>
          <span class="step-number">3.</span> Expand Link Binary With Libraries.<br/>
          <span class="step-number">4.</span> Click <span style="color: #c16f6f; font-weight: bold;">"+"</span> icon.<br/>
          <span class="step-number">5.</span> Search for HIPAAChecker.<br/>
          <span class="step-number">6.</span> Add HIPAAChecker.'<br/><br/>
          <img 
            src="/images/common/s1.jpg" 
            alt="Add HIPAAChecker package" 
            class="developerGuidelineXcode__install-step__instruction-image developerGuidelineXcode__install-step__instruction-image--copy-paste"
          />
        </div>`,
    },
    {
      title: 'Step 5: Project configuration',
      description: `
        <div>
          <span class="step-number">1.</span> Go to the initial file that would be run after starting the project. It can be AppDelegate or SceneDelegate or any other root viewcontroller<br/>
          <span class="step-number">2.</span> Import HIPAAChecker.<br/><br/>
          <img 
            src="/images/common/s2.jpg" 
            alt="Import HIPAAChecker" 
            class="developerGuidelineXcode__install-step__instruction-image mb-8"  
          />
          <img 
            src="/images/common/s3.jpg" 
            alt="Initialize HIPAAChecker" 
            class="developerGuidelineXcode__install-step__instruction-image ml-2"
          />
        </div>`,
    },
    {
      title: 'Step 6: Package Initialization',
      description: `
        <div>
          <p>If the plugin is installed successfully, the package API will be accessible.</p>
          <p>Just add:</p>
          <pre 
            class="developerGuidelineXcode__install-step__code"
          >
            <code style="white-space: nowrap">
              <span style="color: #943ead">let _ </span>\
              <span style="color: #f31c16">= </span>\
              <span style="color: #13610d">HIPAAChecker</span>\
              <span style="color: #f31c17">(</span><span style="color: #13610d">in</span>\
              <span style="color: #f31c16">:</span><span style="color: #6a177f">self.</span>\
              <span style="color: #b52ad8">view</span><span style="color: #f31c17">,</span>\
              <span style="color: #98c379">projectPath</span>\
              <span style="color: #f31c17">:</span>\
              <span style="color: #c16f6f">&quot; &quot;</span>\
              <span style="color: #f31c17">,</span>\
              <span style="color: #98c379">email</span>\
              <span style="color: #f31c17">:</span>\
              <span style="color: #c16f6f">&quot; </span>\
              <span style="color: #f31c17">,</span>\
              <span style="color: #98c379">password</span>\
              <span style="color: #f31c17">:</span>\
              <span style="color: #c16f6f">&quot; &quot;</span>\
              <span style="color: #f31c17">)</span>\
            </code>
          </pre>
          <br/>
          <p>
            <strong>Self.view</strong> will be the view that needs to be passed. It can be a window view or any view in a controller.
          </p>
          <p>
            Project path needs to be given. It can be copied from the Xcode right panel or from Finder in Mac. That is the root directory of the project.
          </p>
          <p>
            The email and password are the credentials of the HIPAA checker platform.
          </p>
          <br/>
          <img 
            src="/images/common/st4.jpg" 
            alt="HIPAAChecker initialization" 
            class="developerGuidelineXcode__install-step__instruction-image mb-6"
          />
          <img 
            src="/images/common/s6.jpg" 
            alt="HIPAAChecker initialization with credentials" 
            class="developerGuidelineXcode__install-step__instruction-image"
          />
        </div>`,
    },
    {
      title: 'Step 7: Run Package',
      description: `
        <div>
          After adding these code in the project, just run the project. It will traverse the project with valid token and find the HIPAA rules implementation on the project. The report can be shown on the HIPAA checker web platform. The above code should be comment out if the developer do not want to check the HIPAA rules everytime when the project started.
        </div>`,
    },
    {
      title: 'Step 8: Uninstall process!',
      description: `
        <div>
          <span class="step-number">1.</span> Go to the Package Dependencies from Project navigation.<br/>
          <span class="step-number">2.</span> Remove the package by clicking 
          <span style="color: #c16f6f; font-weight: bold;">"-"</span> after selecting the package.
          <img 
            src="/images/common/s8.jpg" 
            alt="Remove HIPAAChecker package" 
            class="developerGuidelineXcode__install-step__instruction-image developerGuidelineXcode__install-step__instruction-image--uninstall-process"
          />
        </div>`,
    },
  ],
};
