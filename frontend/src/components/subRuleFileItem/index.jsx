import { useEffect, useState } from 'react';
import Image from 'next/image';

// import {createPortal} from 'react-dom';
import CodeSuggestionParser from '@/components/code-suggestion-parser/codeSuggestionParser';
import Loader from '@/components/loader';
import NoData from '@/components/no-data';
import Remediation from '@/components/remediation';
import Text from '@/components/text';
// import Tooltipcard from '@/components/tooltipcard';
import { useSelectedOption } from '@/context/selectOptionContext';
import { get } from '@/utils/api-service';
import { vulnerabilityStatus } from '@/utils/constant-data';
import useIsSpDevice from '@/utils/useSpDevice';

import './index.scss';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const SubRuleFileItem = ({
                           rule,
                           ruleTitle,
                           fileName,
                           vulnerableCodeData,
                           vulnerability,
                           isErrorCodeView,
                           isLoadingCodeView,
                           reportCodeViewData,
                           activeTab,
                           setActiveTab,
                           selectedSubruleId,
                           platform,
                           uploadType,
                           hipaaPolicy,
                           hipaaPolicyReference,
                           ruleId,
                           applicationID,
                           ruleName,
                           currentSeverity,
                           vulnerabilityCategory,
                         }) => {
  const [currentFixIndex, setCurrentFixIndex] = useState(0);
  const [suggestedFixes, setSuggestedFixes] = useState([]);

  const { state, dispatch } = useSelectedOption();
  const isSpDevice = useIsSpDevice();

  const { All, High, Low, Medium, Critical } = vulnerabilityStatus;

  const [showModalLine, setShowModalLine] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);

  const handleClick = (e, index) => {
    const subruleEl = document.querySelector('.summarizeDetails__subrule-container');
    const auditEl = document.querySelector('.summarizeDetails__audit-record-container');

    if (!subruleEl || !auditEl) return;

    const subruleRect = subruleEl.getBoundingClientRect();
    const auditRect = auditEl.getBoundingClientRect();

    const left = subruleRect.left + window.scrollX;
    const right = auditRect.right + window.scrollX;
    const width = right - left;

    setTooltipPos({
      top: subruleRect.top + window.scrollY,
      left,
      width,
    });

    setShowModalLine(showModalLine === index + 1 ? null : index + 1);
  };

  // Fetch suggested fixes
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await get(`suggestions?platform=${platform}&rule=${ruleId}`, false);
        const data = response?.data;

        const matchedSubrule = data?.subrules?.find(
          (subrule) => subrule?.subrule === selectedSubruleId,
        );

        const suggestions = matchedSubrule?.suggestion || [];
        const rawCodes = vulnerableCodeData.flat();
        const allSnippets = rawCodes.map((codes) => {
          const obj = JSON.parse(codes);
          return obj.codeSegment;
        });

        // Use Set to prevent duplicate snippets
        const snippetsSet = new Set();

        suggestions.forEach((suggestion) => {
          const { snippet, pattern: patterns } = suggestion;

          // Check if ANY code segment matches ANY pattern
          const hasMatch = allSnippets.some((code) =>
            (Array.isArray(patterns) ? patterns : []).some((pattern) => new RegExp(pattern).test(code))
          );

          if (hasMatch) {
            snippetsSet.add(snippet);
          }
        });

        setSuggestedFixes(Array.from(snippetsSet));
      } catch (error) {}
    }

    fetchSuggestions();
  }, [selectedSubruleId, platform, ruleId, vulnerableCodeData]);

  const handleNext = () => {
    setCurrentFixIndex((prevIndex) => (prevIndex + 1 < suggestedFixes.length ? prevIndex + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentFixIndex((prevIndex) =>
      prevIndex - 1 >= 0 ? prevIndex - 1 : suggestedFixes.length - 1,
    );
  };

  const flatData = vulnerableCodeData?.flatMap((data) => data?.map((code) => code?.split(',')));
  const coseSegmentData = flatData?.flatMap((item) => JSON.parse(item));

  const codeDataItem = coseSegmentData?.map((line) => line?.lineNumber);

  const handleShowCode = () => {
    dispatch({
      type: 'SET_LINENUMBER',
      payload: {
        lineNumber: codeDataItem,
      },
    });
  };

  const codeData = reportCodeViewData?.codebase?.split('\n');

  // Check if LLM features are enabled via environment variable
  // Defaults to false if not set or if set to anything other than 'true'
  const isLLMFeaturesEnabled = process.env.NEXT_PUBLIC_ENABLE_LLM_FEATURES === 'true';

  // Filter tabs based on feature flag
  const availableTabs = isLLMFeaturesEnabled
    ? ['Details', 'View Code', 'Suggested Fix', 'AI Remediation']
    : ['Details', 'View Code', 'Suggested Fix'];

  return (
    <div className='summarizeDetails__audit-record-container'>
      <div className='summarizeDetails__container__audit-record-container'>
        <div className='summarizeDetails__container__audit-record-container__heading'>
          <div style={{ display: 'flex', columnGap: '8px' }}>
            <Image
              src='/images/icons/arrow-break-blue.svg'
              className='summarizeDetails__container__audit-record-container__heading-image'
              width={20}
              height={20}
              alt='code logo'
            />
            <Text
              color='primary-700'
              size='fs-14'
              weight='medium'
            >
              {ruleTitle}
            </Text>
          </div>
          <div className='summarizeDetails__container__audit-record-container__heading-content'>
            <Image
              src='/images/icons/codefile.svg'
              className='summarizeDetails__container__audit-record-container__heading-image'
              width={24}
              height={24}
              alt='code logo'
            />
            <Text
              color='neutral-700'
              size='fs-18'
              weight='bold'
            >
              {fileName}
            </Text>
          </div>

          {/* Tab Buttons Section */}
          <div className='summarizeDetails__container__audit-record-container__tabs'>
            {availableTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (tab === 'View Code') {
                    handleShowCode();
                  }
                  setActiveTab(tab);
                }}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className='summarizeDetails__container__audit-record-container__heading-footer'>
            <div
              className={`summarizeDetails__container__audit-record-container__heading-footer__tag summarizeDetails__container__audit-record-container__heading-footer__tag--${
                vulnerability === Critical
                  ? 'cornell-red'
                  : vulnerability === Low
                    ? 'green'
                    : vulnerability === Medium
                      ? 'orange'
                      : vulnerability === High
                        ? 'red'
                        : vulnerability === All
                          ? 'blue'
                          : 'red'
              }`}
            >
              {vulnerability === Critical
                ? 'Critical'
                : vulnerability === Low
                  ? 'Low'
                  : vulnerability === Medium
                    ? 'Medium'
                    : vulnerability === High
                      ? 'High'
                      : vulnerability === All
                        ? 'All'
                        : 'High'}{' '}
              {vulnerability !== 'Critical' && 'vulnerabilities'}
            </div>
          </div>
        </div>

        {/* Details Tab */}
        {activeTab === 'Details' && (
          <div className='summarizeDetails__container__audit-record-container__json-format'>
            <ul className='summarizeDetails__container__audit-record-container__json-format__items'>
              {coseSegmentData?.length > 0 ? (
                coseSegmentData?.map((item, index) => (
                  <li
                    key={index}
                    className='summarizeDetails__container__audit-record-container__json-format__item'
                  >
                    {`{\n\n"lineNumber": ${item?.lineNumber},\n\n"codeSegment": "${item?.codeSegment}"\n\n}`}
                  </li>
                ))
              ) : (
                <div className='summarizeDetails__container__audit-record-container__json-format__not-found'>
                  <NoData />
                </div>
              )}
            </ul>
          </div>
        )}

        {/* View Code Tab */}
        {activeTab === 'View Code' && (
          <div className='summarizeCodeView'>
            <div className='summarizeCodeView__main-container'>
              <div className='summarizeCodeView__main-container__title'></div>
              <div>
                {isErrorCodeView ? (
                  <NoData title={'Sorry! There was an error from server while loading this file'} />
                ) : (
                  <>
                    {isLoadingCodeView ? (
                      <div className='summarizeDetails__loader'>
                        <Loader size='large' />
                      </div>
                    ) : (
                      <div className='summarizeCodeView__json-format'>
                        <div
                          className='summarizeCodeView__scrollable overflow-auto max-h-[600px] w-full border rounded-lg bg-white p-2'
                          style={{ whiteSpace: 'pre' }}
                        >
                          <pre>
                            <ul className='summarizeCodeView__main-container__items'>
                              {reportCodeViewData?.errors && reportCodeViewData?.errors[0] ? (
                                <NoData title={reportCodeViewData?.errors[0]} />
                              ) : (
                                codeData?.length > 0 &&
                                codeData?.map((code, index) => (
                                  <li
                                    key={index}
                                    className='summarizeCodeView__main-container__item'
                                  >
                                    <span
                                      style={{
                                        backgroundColor: state?.lineNumber?.includes(index + 1)
                                          ? 'yellow'
                                          : '',
                                        display: 'flex',
                                        gap: `${isSpDevice ? '8px' : '16px'}`,
                                        alignItems: 'center',
                                      }}
                                    >
                                      <span style={{ minWidth: '35px', textAlign: 'right' }}>
                                        {index + 1}
                                      </span>{' '}
                                      <span>{code}</span>
                                      {/* {state?.lineNumber?.includes(index + 1) && (
                                        <span style={{ position: 'relative', display: 'inline-block' }}>
                                          <Image
                                            src="/images/icons/helpcircle.svg"
                                            alt="Help"
                                            width={16}
                                            height={16}
                                            onClick={(e) => handleClick(e, index)}
                                            style={{ cursor: 'pointer' }}
                                            title="View Severity Assessment"
                                          />
                                          {showModalLine === index + 1 &&
                                            createPortal(
                                              <div
                                                style={{
                                                  position: 'absolute',
                                                  top: tooltipPos?.top - 16,
                                                  left: tooltipPos?.left,
                                                  width: tooltipPos?.width,
                                                  zIndex: 1000,
                                                }}
                                              >

                                              <Tooltipcard
                                                lineNumber={index + 1}
                                                // subTitle={subTItle}
                                                // severityLevel={subTItle?.severity}
                                                // vulnerabilityCategory={subTItle?.vulnerability_cat}
                                                // description={subTItle?.description}
                                                // exampleCode={subTItle?.example_code}
                                                // explanation={subTItle?.explanation}
                                                // recommendation={subTItle?.recommendation}
                                                // references={subTItle?.references}
                                                onOutsideClick={() => setShowModalLine(null)}
                                                onClose={() => setShowModalLine(null)}
                                              />
                                            </div>,
                                            document.body
                                          )}
                                        </span>
                                      )} */}
                                    </span>
                                  </li>
                                ))
                              )}
                            </ul>
                          </pre>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Suggested Fix Tab */}
        {activeTab === 'Suggested Fix' && suggestedFixes?.length > 0 && (
          <div className='suggested-fix__carousel'>
            <h4 className='suggested-fix__title'>Suggested Fix:</h4>
            <div className='suggested-fix__block'>
              <CodeSuggestionParser
                html={suggestedFixes[currentFixIndex]}
                platform={'android'}
              />
            </div>
            <div className='suggested-fix__controls'>
              <button
                onClick={handlePrev}
                className='carousel-arrow'
              >
                ◀
              </button>
              {suggestedFixes.map((_, idx) => (
                <span
                  key={idx}
                  className={`carousel-dot ${idx === currentFixIndex ? 'active' : ''}`}
                />
              ))}
              <button
                onClick={handleNext}
                className='carousel-arrow'
              >
                ▶
              </button>
            </div>
          </div>
        )}

        {/* AI Remediation Tab */}
        {isLLMFeaturesEnabled && activeTab === 'AI Remediation' && (
          <div className='summarizeDetails__container__audit-record-container__json-format'>
            <Remediation
              rule={rule}
              applicationID={applicationID}
              platform={platform}
              uploadType={uploadType}
              hipaaPolicy={hipaaPolicy}
              hipaaPolicyReference={hipaaPolicyReference}
              ruleId={ruleId}
              ruleName={ruleName}
              selectedSubruleId={selectedSubruleId}
              ruleTitle={ruleTitle}
              fileName={fileName}
              vulnerableCodeData={vulnerableCodeData}
              currentSeverity={currentSeverity}
              vulnerabilityCategory={vulnerabilityCategory}
              activeTab={activeTab}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubRuleFileItem;