import { useContext, useEffect, useState } from 'react';
import hljs from 'highlight.js';

import DropDown from '@/components/drop-down';
import Loader from '@/components/loader';
import NoData from '@/components/no-data';
import ProgressBar from '@/components/progress-bar';
import Text from '@/components/text';
import SubscriptionContext from '@/context/subscriptionContext';
import { post } from '@/utils/api-service';
import { useQuery } from '@tanstack/react-query';

import 'highlight.js/styles/github.css'; // Import a highlight.js theme
import 'highlight.js/styles/atom-one-light.css';
import './index.scss';

const remediationResponse = {
  vulnerabilityAnalysis: {
    severityAssessment: {
      severity_level: 4,
      confidence_score: 0.93,
      reasoning:
        'The code uses MD5 (MessageDigest.getInstance("MD5")) to create a hash of data that may include ePHI such as passwords, SSNs, or tokens. MD5 is cryptographically broken and vulnerable to collision and pre-image attacks, making it unsuitable for protecting sensitive health information. Under HIPAA, any ePHI at rest must be rendered unreadable through approved encryption or hashing mechanisms. The presence of MD5 directly violates the Security Rule’s technical safeguards for encryption/decryption and creates a clear path for data exposure through brute-force or rainbow-table attacks. Because the weakness is in core data-handling logic and affects all records processed by this component, the impact is systemic and could lead to large-scale breaches, thus warranting a Critical severity rating.',
      risk_factors: [
        'ePHI data exposure due to weak hashing algorithm',
        'Potential for unauthorized reconstruction of passwords or tokens',
        'Regulatory fines and penalties for HIPAA non-compliance',
        'Reputational damage and loss of patient trust',
        'Increased likelihood of successful ransomware or data-theft incidents',
      ],
      violated_rules: [
        '164.312(a)(2)(iv) - Encryption and decryption',
        '164.312(b) - Integrity',
        '164.312(e)(1) - Transmission security (if hashes are transmitted)',
      ],
      compliance_impact:
        "High - This is a direct violation of the HIPAA Security Rule's Technical Safeguards and would cause an audit failure.",
      regulatory_context:
        'NIST SP 800-131A explicitly prohibits the use of MD5 for cryptographic purposes, and NIST SP 800-63B recommends using strong, salted password hashing functions such as Argon2, bcrypt, or PBKDF2. These standards are referenced by HIPAA as the baseline for secure implementation.',
      references:
        '[https://csrc.nist.gov/publications/detail/sp/800-131a/rev-2/final](https://csrc.nist.gov/publications/detail/sp/800-131a/rev-2/final)',
    },
    remediationPlan: {
      issueSummary:
        'The application hashes sensitive data using MD5, an outdated and insecure algorithm, exposing ePHI to feasible cryptographic attacks and violating HIPAA encryption requirements.',
      priority: {
        level: 'Critical',
        justification:
          'The vulnerability affects core handling of protected health information and directly contravenes mandatory HIPAA safeguards; remediation must occur before any production release.',
      },
      rootCause:
        'Developers selected MD5 for its simplicity and legacy example code, without a secure-coding policy or awareness of HIPAA-mandated cryptographic standards.',
      stepByStepRemediation: [
        {
          step: 1,
          title: 'Introduce Secure Hash Provider',
          durationHours: 2,
          beforeCode:
            'MessageDigest md = MessageDigest.getInstance("MD5");\nbyte[] theDigest = md.digest(bytesOfMessage);',
          afterCode:
            'import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;\n\nBCryptPasswordEncoder encoder = new BCryptPasswordEncoder();\nString hashed = encoder.encode(new String(bytesOfMessage, StandardCharsets.UTF_8));',
          explanation:
            'Switches from MD5 to BCrypt, an adaptive algorithm designed for password hashing with built-in salting and work-factor configuration.',
        },
        {
          step: 2,
          title: 'Encapsulate Hashing Logic in a Spring Bean',
          durationHours: 1,
          beforeCode: '// Direct use of MessageDigest inside utility method',
          afterCode:
            '@Component\npublic class SecureHashService {\n    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();\n    public String hash(String input) {\n        return encoder.encode(input);\n    }\n    public boolean matches(String raw, String encoded) {\n        return encoder.matches(raw, encoded);\n    }\n}',
          explanation:
            'Provides a central, replaceable component, enabling future algorithm upgrades without code duplication.',
        },
        {
          step: 3,
          title: 'Replace Calls to MD5 Utility',
          durationHours: 2,
          beforeCode:
            'String generateHash = this.md5(hashString);\nreturn generateHash.equals(requestParameters.get("verify_sign"));',
          afterCode:
            'String generateHash = secureHashService.hash(hashString);\nreturn secureHashService.matches(hashString, requestParameters.get("verify_sign"));',
          explanation:
            "Ensures verification uses the same secure algorithm and leverages BCrypt's built-in constant-time comparison.",
        },
        {
          step: 4,
          title: 'Add Unit Tests for New Hashing Service',
          durationHours: 2,
          beforeCode: '// No tests for MD5 existed',
          afterCode:
            '@Test\npublic void testHashAndMatch() {\n    String raw = "sampleData";\n    String hashed = secureHashService.hash(raw);\n    assertTrue(secureHashService.matches(raw, hashed));\n    assertFalse(secureHashService.matches("tampered", hashed));\n}',
          explanation:
            'Confirms that hashing is deterministic for verification and that mismatched inputs are rejected.',
        },
        {
          step: 5,
          title: 'Static Analysis & Penetration Test Verification',
          durationHours: 2,
          beforeCode: '// No detection of MD5 usage',
          afterCode: '// Scans now report zero instances of MessageDigest.getInstance("MD5")',
          explanation:
            'Runs tools like SonarQube, OWASP Dependency-Check, and a manual pen-test to ensure the insecure algorithm is fully removed.',
        },
        {
          step: 6,
          title: 'Deploy to Staging & Conduct End-to-End Testing',
          durationHours: 1,
          beforeCode: '// Existing production deployment uses MD5',
          afterCode:
            '// New release uses BCrypt; all integration tests pass with real ePHI samples in a controlled environment',
          explanation:
            'Validates that the change does not break business logic while maintaining security compliance.',
        },
      ],
    },
  },
};

const Remediation = ({
                       rule,
                       applicationID,
                       platform,
                       uploadType,
                       hipaaPolicy,
                       hipaaPolicyReference,
                       ruleId,
                       ruleName,
                       selectedSubruleId,
                       ruleTitle,
                       fileName,
                       vulnerableCodeData,
                       currentSeverity,
                       vulnerabilityCategory,
                       activeTab,
                     }) => {
  const [selectedRemediationStep, setSelectedRemediationStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);
  const [shouldFetchRemediation, setShouldFetchRemediation] = useState(false);
  const { userData } = useContext(SubscriptionContext);

  const prepareVulnerabilityData = () => {
    const flatData = vulnerableCodeData?.flatMap((data) => data?.map((code) => code?.split(',')));
    const coseSegmentData = flatData?.flatMap((item) => JSON.parse(item));
    const userId = userData?.id || userData?.user_id || '';

    const vulnerabilities = coseSegmentData.map((segment) => ({
      user_upload_id: parseInt(applicationID),
      upload_type: uploadType ? uploadType : '',
      platform: platform ? platform : '',
      hipaa_rule_id: ruleId || ruleId || '',
      rule_name: ruleName ? ruleName : '',
      hipaa_policy: hipaaPolicy ? hipaaPolicy : '',
      hipaa_policy_reference: hipaaPolicyReference ? hipaaPolicyReference : '',
      hipaa_subrule_id: selectedSubruleId ? selectedSubruleId : '',
      description: ruleTitle ? ruleTitle : '',
      file_name: fileName ? fileName : '',
      code_snippet: segment.codeSegment ? segment.codeSegment : '',
      current_severity: currentSeverity ? parseInt(currentSeverity) : '',
      vulnerability_category: vulnerabilityCategory ? vulnerabilityCategory : '',
      user_id: userId,
      // session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }));

    return vulnerabilities;
  };

  const {
    data: remediationData,
    isLoading: remediationLoading,
    isError: isRemediationError,
    error: remediationError,
  } = useQuery({
    queryKey: ['aiRemediation', applicationID, selectedSubruleId, fileName],
    queryFn: async () => {
      const vulnerabilities = prepareVulnerabilityData();

      const response = await post(
        'analyze-vulnerability/batch',
        { vulnerabilities },
        false,
        false,
        3,
      );
      return response?.data;
    },
    onError: (error) => {
      if (error.response?.status === 500) {
        setErrorMessage(error.response?.statusText || 'Internal Server Error');
      }
    },
    enabled: shouldFetchRemediation && activeTab === 'AI Remediation',
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  // Trigger AI Remediation fetch when tab becomes active
  useEffect(() => {
    if (activeTab === 'AI Remediation') {
      setShouldFetchRemediation(true);
    }
  }, [activeTab]);

  useEffect(() => {
    hljs.configure({
      languages: [
        'javascript',
        'typescript',
        'java',
        'python',
        'css',
        'html',
        'json',
        'xml',
        'sql',
        'bash',
        'php',
        'ruby',
        'go',
        'rust',
        'swift',
        'kotlin',
        'dart',
      ],
    });
  }, []);

  if (remediationLoading) {
    return (
      <div className='summarizeDetails__loader'>
        <Loader size='large' />
        <Text
          color='neutral-600'
          size='fs-14'
          weight='regular'
        >
          Analyzing vulnerabilities...
        </Text>
      </div>
    );
  }

  if (isRemediationError) {
    return (
      <div className='summarizeDetails__container__audit-record-container__json-format__not-found'>
        <NoData
          title={`Error: ${errorMessage || remediationError?.message || 'Failed to fetch AI remediation'}`}
        />
      </div>
    );
  }

  if (!remediationData) {
    return (
      <div className='summarizeDetails__container__audit-record-container__json-format__not-found'>
        <NoData title='No remediation data available' />
      </div>
    );
  }

  const firstResult = remediationData?.results?.[0];

  if (!firstResult || !firstResult.vulnerability_analysis) {
    return (
      <div className='summarizeDetails__container__audit-record-container__json-format__not-found'>
        <NoData title='No vulnerability analysis data available' />
      </div>
    );
  }

  const vulnerabilityAnalysis = firstResult.vulnerability_analysis;
  const remediationPlan = vulnerabilityAnalysis.remediation_plan;
  const stepByStepRemediation = remediationPlan?.stepByStepRemediation || [];

  if (!stepByStepRemediation || stepByStepRemediation.length === 0) {
    return (
      <div className='summarizeDetails__container__audit-record-container__json-format__not-found'>
        <NoData title='No remediation steps available' />
      </div>
    );
  }

  // Prepare dropdown data from remediation steps
  const remediationStepsDropdownData = stepByStepRemediation.map((step, index) => ({
    id: index + 1,
    name: step.title,
    title: step.title,
    explanation: step.explanation,
    beforeCode: step.beforeCode,
    afterCode: step.afterCode,
  }));

  // Calculate progress percentage based on selected step
  const totalSteps = stepByStepRemediation.length;
  const progressPercentage = Math.round((selectedRemediationStep / totalSteps) * 100);

  // Get current selected step data
  const currentStep = stepByStepRemediation[selectedRemediationStep - 1];

  return (
    <div className='remediation-plan'>
      <div className='remediation-plan__container'>
        <div className='remediation-plan__container__content'>
          <p className='font-semibold my-2'>Remediation Steps:</p>
          <DropDown
            type={'object'}
            data={remediationStepsDropdownData}
            value={selectedRemediationStep}
            setValue={(val) => setSelectedRemediationStep(val)}
          />

          <div className='w-full mt-2 flex items-center gap-3'>
            <span className='text-sm text-gray-600 whitespace-nowrap'>
              {selectedRemediationStep} of {totalSteps} steps
            </span>
            <ProgressBar
              percentage={progressPercentage}
              color='electric-blue'
            />
          </div>

          <div className='flex mt-2 pb-2'>
            <div className='w-1/2'>
              <p className='font-semibold'>IssueSummary:</p>
              <p className='issue-summary mb-1'>{remediationPlan.issueSummary}</p>
            </div>

            <div className='vertical_divider' />

            <div className='w-1/2'>
              <p className='font-semibold mb-1'>RootCause:</p>
              <p className='root-cause'>{remediationPlan.rootCause}</p>
            </div>
          </div>

          {/* Display Explanation for current step */}
          {currentStep?.explanation && (
            <div className='mb-3'>
              <p className='font-semibold'>Explanation:</p>
              <p className='text-sm text-gray-700'>{currentStep.explanation}</p>
            </div>
          )}

          {/* Display Before/After Code */}
          {currentStep?.afterCode ? (
            <>
              <div>
                <p className='font-semibold'>Before:</p>
                <pre
                  style={{
                    backgroundColor: '#fafafa',
                    border: '1px solid #e1e5e9',
                    borderRadius: '6px',
                    padding: '16px',
                    margin: '8px 0',
                    overflow: 'auto',
                    fontSize: '14px',
                    fontFamily: 'Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
                  }}
                >
                  <code
                    dangerouslySetInnerHTML={{
                      __html: hljs.highlightAuto(currentStep.beforeCode || '').value,
                    }}
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                    }}
                  />
                </pre>
              </div>
              <div>
                <p className='font-semibold'>After:</p>
                <pre
                  style={{
                    backgroundColor: '#fafafa',
                    border: '1px solid #e1e5e9',
                    borderRadius: '6px',
                    padding: '16px',
                    margin: '8px 0',
                    overflow: 'auto',
                    fontSize: '14px',
                    fontFamily: 'Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
                  }}
                >
                  <code
                    dangerouslySetInnerHTML={{
                      __html: hljs.highlightAuto(currentStep.afterCode).value,
                    }}
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                    }}
                  />
                </pre>
              </div>
            </>
          ) : (
            <div className='text-center py-4'>
              <NoData title='No code changes for this step' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Remediation;