'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import Breadcrumb from '@/components/breadcrumb';
import HippaCheckerChat from '@/components/chatbot';
import DropDown from '@/components/drop-down';
import Loader from '@/components/loader';
import NoData from '@/components/no-data';
import Skeleton from '@/components/skeleton-row';
import SubRuleFileItem from '@/components/subRuleFileItem';
import Text from '@/components/text';
import { useSelectedOption } from '@/context/selectOptionContext';
import { get, post } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
// import { get } from '@/utils/api-service';
// import API_ENDPOINTS from '@/utils/apiEndpoints';
import {
  CategoryDropdownData,
  severityColorMap,
  severityCount,
  severityMap,
  vulnerabilityDropdownData,
  vulnerabilityStatus,
} from '@/utils/constant-data';
import { decodeString } from '@/utils/helper';
import useIsSpDevice from '@/utils/useSpDevice';
import { useQuery } from '@tanstack/react-query';

import './index.scss';

const SpecificDetails = ({ params }) => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  let filteredDropdownData = [];
  const { slug } = params;
  const { All, High, Low, Medium, Critical } = vulnerabilityStatus;
  const { ZERO, ONE, TWO, THREE, FOUR } = severityCount;
  const { state, dispatch } = useSelectedOption();

  const [showManualCheckPopup, setShowManualCheckPopup] = useState(false);

  const pathSegments = slug.split('--');
  const lastFileId = pathSegments[2];
  const currentPage = pathSegments[1];
  const uploadId = pathSegments[0];
  const ruleName = pathSegments[3];
  const router = useRouter();
  const [vulnerability, setVulnerability] = useState(All);
  const [category, setCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('Details');
  const [manualCheckFile, setManualCheckFile] = useState(null);
    const [selectedSubruleId, setSelectedSubruleId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [ruleTitle, setRuleTitle] = useState(
    state.ruleWise.ruleTitle ? state.ruleWise.ruleTitle : '',
  );
  const [subTItle, setSubTitle] = useState(
    state.ruleWise.subTitle ? state.ruleWise.subTitle[0] : '',
  );
  const applicationID = pathSegments[0];
  const isSpDevice = useIsSpDevice();
  const API_BASE_URL_V2 = process.env.NEXT_PUBLIC_API_BASE_URL_V2;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Check if LLM features are enabled via environment variable
  // Defaults to false if not set or if set to anything other than 'true'
  const isLLMFeaturesEnabled = process.env.NEXT_PUBLIC_ENABLE_LLM_FEATURES === 'true';

  const handleMarkAsVulnerability = async (subruleId) => {
    try {
      const payload = {
        uploadId: uploadId,
        subruleId: subruleId,
      };
      setShowManualCheckPopup(false);
      const response = await post(API_ENDPOINTS.MANUAL_SELECT, payload, true);
      const data = response.data;


      window.location.reload();
      return data;
    } catch (error) {

      throw error;
    }
    
  };
  const handleDismissPopup = () => {

      setShowManualCheckPopup(false);
  };


  useEffect(() => {
    setShowManualCheckPopup(false);
  }, [activeTab]);



  
  useEffect(() => {
    if (categoryParam) {
      setCategory(categoryParam);
    } else {
      setCategory('All');
    }
  }, [categoryParam]);

  const [selectedSubrule, setSelectedSubrule] = useState({});

  const {
    data: reportCodeViewData,
    isLoading: isLoadingCodeView,
    isError: isErrorCodeView,
  } = useQuery({
    queryKey: ['codeView', applicationID, subTItle?.file_id],
    queryFn: async () => {
      const response = await get(
        `${API_ENDPOINTS.USER_UPLOADS}/${applicationID}/file_content?file_id=${subTItle?.file_id}`,
        true,
        1
      );
      return response?.data;
    },
    enabled: !!subTItle?.file_id,
  });


  
  // const {
  //   data: summarizeReportDetailsData,
  //   isLoading: isLoadingSummarizeReportDetails,
  //   isError: isErrorSummarizeReportDetails,
  //   isSuccess: isSuccessSummarizeReportDetails,
  // } = useQuery({
  //   queryKey: ['summarizeReportDetails', currentPage, applicationID, ruleName],
  //   queryFn: async () => {
  //     const response = await get(
  //       `/v2/user_uploads/${applicationID}/rule_wise?page=${currentPage}`,
  //       true,
  //     );
  //     return response.json().then((data) => data?.user_upload);
  //   },
  // });

  const { data: summarizeReportDetailsData, isLoading: isLoadingSummarizeReportDetails } = useQuery(
    {
      queryKey: ['summarizeReportDetails', currentPage, applicationID, ruleName],
      queryFn: async () => {
        const response = await get(
          `${API_ENDPOINTS.USER_UPLOADS}/${applicationID}/rule_wise?page=${currentPage}`,
          true,
          2,
        );
        return response.data?.user_upload;
      },
    },
  );

  const filteredResults = summarizeReportDetailsData?.analyzed_results?.filter(
    (result) => result.rule_name === decodeString(ruleName),
  );

  const currentRule = filteredResults && filteredResults.length > 0 ? filteredResults[0] : null;

  if (filteredResults) {
    const uniqueVulnerabilityCats = [
      // eslint-disable-next-line no-undef
      ...new Set(filteredResults[0].sub_rules.map((rule) => rule.vulnerability_cat)),
    ];

    filteredDropdownData = CategoryDropdownData.filter((item) =>
      uniqueVulnerabilityCats.includes(item.id),
    );

    filteredDropdownData.unshift({ id: 'All', name: 'All' });
  }

  const filterDataForSpecificReport = summarizeReportDetailsData?.analyzed_results?.filter(
    (item) => item.rule_id === lastFileId,
  );
  const platform = summarizeReportDetailsData?.platform;
  const uploadType = summarizeReportDetailsData?.upload_type;

  const totalSubRules = filterDataForSpecificReport?.map((item) => {
    const subrulesWithCount = item?.sub_rules?.filter((sub_rule) => sub_rule?.count > 0);

    const filteredByCategory =
      category === 'All'
        ? subrulesWithCount
        : subrulesWithCount.filter((sub_rule) => sub_rule?.vulnerability_cat === category);

    if (vulnerability === 'All') {
      return filteredByCategory;
    }

    // Otherwise, apply severity filter
    return filteredByCategory.filter((sub_rule) => {
      if (vulnerability === 'Critical' && sub_rule?.severity === FOUR) return true;
      if (vulnerability === 'High' && sub_rule?.severity === THREE) return true;
      if (vulnerability === 'Medium' && sub_rule?.severity === TWO) return true;
      if (vulnerability === 'Low' && sub_rule?.severity === ONE) return true;
      return false;
    });
  });

  const paths = [
    { name: 'Dashboard', url: '/user-account/dashboard' },
    {
      name: 'Analysis Report',
      url: `/user-account/dashboard/report-list/analysis-report/${pathSegments[0]}`,
    },
    { name: 'Summarize report', url: '' },
  ];

  const handleSelectedRule = (value) => {
    setRuleTitle(value);
    setCategory('All');
    dispatch({
      type: 'SET_VULNERABILITY_STATUS',
      payload: {
        ruleWise: {
          ruleTitle: value,
        },
      },
    });
  };
  const handleSubrule = (value, subruleIndex, fileIndex) => {
    const subRuleData = filterDataForSpecificReport?.map((item) =>
      item.sub_rules.flatMap((rule) =>
        rule.files.filter((file) => {
          if (file?.file_id === value) {
            setSubTitle({...file, uniqueIndex: `${subruleIndex}-${fileIndex}`});
            return true;
          }
          return false;
        }),
      ),
    );
    dispatch({
      type: 'SET_VULNERABILITY_STATUS',
      payload: {
        ruleWise: {
          subTitle: subRuleData[0],
        },
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'SET_DATA',
      payload: {
        selectedOption: 'SUMMARIZE',
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flatData = subTItle?.matched_data?.flatMap((data) => data?.map((code) => code?.split(',')));
  const coseSegmentData = flatData?.flatMap((item) => JSON.parse(item));

  const handleChangeVulnerabilityLevel = (value) => {
    setVulnerability(value);
    setRuleTitle('');
    setSubTitle('');
    dispatch({
      type: 'SET_VULNERABILITY_STATUS',
      payload: {
        vulnerabilityStatusForRule: value,
        ruleWise: {
          ruleTitle: '',
          subTitle: [],
        },
      },
    });
  };


  
  useEffect(() => {
    dispatch({
      type: 'SET_PAGINATION',
      payload: {
        currentPage: currentPage,
        startPage: currentPage,
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch({
      type: 'SET_VULNERABILITY_STATUS',
      payload: {
        vulnerabilityStatusForRule: vulnerability,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vulnerability]);

  return (
    <div className='summarizeDetails'>
      <div className='summarizeDetails__header'>
        <div className='summarizeDetails__header__content'>
          <Breadcrumb
            header={decodeString(ruleName)}
            paths={paths}
            backButtonURL={`/user-account/dashboard/report-list/analysis-report/${pathSegments[0]}`}
          />
        </div>
        <div className='summarizeDetails__header__content__application'>
          <Text
            color='neutral-400'
            size='fs-12'
            weight='regular'
          >
            Application name
          </Text>
          <div className='summarizeDetails__header__content__name'>
            {isLoadingSummarizeReportDetails ? (
              <Skeleton />
            ) : (
              <Text
                color='neutral-800'
                size='fs-14'
                weight='medium'
              >
                {summarizeReportDetailsData?.name}
              </Text>
            )}
          </div>
          <div className='summarizeDetails__header__content__details'></div>
        </div>
      </div>
      <div className='summarizeDetails__print-report'>
        <div className='summarizeDetails__print-report__content'>
          <div className='summarizeDetails__print-report__content-options'>
            <Text
              color='neutral-700'
              size='fs-14'
              weight='regular'
            >
              Category
            </Text>
            <DropDown
              type={'colored'}
              data={filteredDropdownData}
              value={category}
              setValue={(val) => setCategory(val)}
            />
            <Text
              color='neutral-700'
              size='fs-14'
              weight='regular'
            >
              showing{' '}
              <span className='summarizeDetails__print-report__high-light'>
                {' '}
                {totalSubRules && totalSubRules[0] && totalSubRules[0]?.length
                  ? totalSubRules[0]?.length
                  : 0}{' '}
              </span>
              subrule {totalSubRules && totalSubRules[0] && totalSubRules[0]?.length > 1 && ''}
              containing
            </Text>
            <DropDown
              type={'colored'}
              data={vulnerabilityDropdownData}
              value={vulnerability}
              setValue={handleChangeVulnerabilityLevel}
            />
            <Text
              size='fs-14'
              weight='regular'
            >
              {vulnerability !== 'Critical' && vulnerability !== All && 'vulnerabilities '}
              {vulnerability === All && 'vulnerabilities '}
            </Text>
          </div>
        </div>
        <div className='summarizeDetails__print-report__button'></div>
      </div>
      <div className='summarizeDetails__main-container'>
        {isLoadingSummarizeReportDetails ? (
          <div className='summarizeDetails__loader'>
            <Loader size='large' />
          </div>
        ) : (
          <div className='summarizeDetails__container'>
            <div className='summarizeDetails__subrule-container'>
              {totalSubRules?.length > 0 && totalSubRules[0]?.length > 0 ? (
                <>
                  {totalSubRules[0]?.map((rule, index_id) => (
                    <div
                      onClick={() => {
                        handleSelectedRule(rule?.description);
                      }}
                      key={index_id}
                      className={`summarizeDetails__container__subrule ${
                        state.ruleWise.ruleTitle.toString() === rule?.description.toString() &&
                        'summarizeDetails__container__subrule--isSelected'
                      }`}
                    >
                      <div className='summarizeDetails__container__subrule__heading'>
                        <div className='summarizeDetails__container__subrule__heading__image' />
                        <Text
                          color='neutral-800'
                          size='fs-16'
                          weight='medium'
                        >
                          {rule?.description}
                        </Text>
                      </div>
                      <div className='summarizeDetails__container__subrule__found__line summarizeDetails__container__subrule__found__line--grey' />
                      <div className='summarizeDetails__container__subrule__found'>
                        <Text
                          color='neutral-600'
                          size='fs-14'
                          weight='regular'
                        >
                          FILES FOUND:
                        </Text>
                        <span
                          className={`summarizeDetails__container__subrule__found__riskItem summarizeDetails__container__subrule__found__riskItem--${
                            vulnerability === Critical
                              ? 'cornell-red'
                              : vulnerability === Low
                                ? 'iris-blue'
                                : vulnerability === Medium
                                  ? 'orange'
                                  : vulnerability === High
                                    ? 'red'
                                    : vulnerability === All
                                      ? severityColorMap.get(rule.severity)
                                      : 'red'
                          }`}
                        >
                          <span className='summarizeDetails__container__subrule__found__content'>{`${rule?.files?.length} `}</span>
                          {vulnerability === Critical
                            ? 'CRITICAL'
                            : vulnerability === Low
                              ? 'LOW'
                              : vulnerability === Medium
                                ? 'MEDIUM'
                                : vulnerability === High
                                  ? 'HIGH'
                                  : vulnerability === All
                                    ? severityMap.get(rule.severity)
                                    : 'HIGH'}
                        </span>
                      </div>
                      <div className='summarizeDetails__container__subrule__found__line' />
                      <div className='summarizeDetails__container__subrule__main-data-content'>
                        {rule?.files?.length > 0 ? (
                          <>
                            {rule?.files?.map((sub, index) => (
                              <div
                                key={index}
                                onClick={() => {
                                  isSpDevice &&
                                  router.push(
                                    `/user-account/dashboard/summarize-rule-sp/${summarizeReportDetailsData?.id}--${currentPage}--${vulnerability}--${sub?.file_id}--${index_id}--${sub?.file_name}--${lastFileId}--${ruleName}`,
                                  );

                                  handleSelectedRule(rule?.description);
                                  handleSubrule(sub?.file_id, index_id, index);
                                  setSelectedSubrule(rule);
                                  setActiveTab('Details');
                                  if (sub?.manual_check === 't') {
                                      setManualCheckFile(sub);
                                      setSelectedSubruleId(rule?.id)
                                      setShowManualCheckPopup(true);
                                      
                                    } else {
                                      setManualCheckFile(null);
                                      setShowManualCheckPopup(false);
                                    }
                                }}
                                className={`summarizeDetails__container__subrule__main-data-content__item ${subTItle?.uniqueIndex === `${index_id}-${index}` ? 'summarizeDetails__container__subrule__main-data-content__item--active' : ''}`}
                              >
                                <div className='summarizeDetails__container__subrule__main-data-content__item__image' />
                                <Text
                                  color='primary-800'
                                  size='fs-14'
                                  weight='regular'
                                >
                                  {sub?.file_name}
                                </Text>
                              </div>
                            ))}
                          </>
                        ) : (
                          <NoData />
                        )}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <NoData />
              )}
            </div>

            {totalSubRules &&
              totalSubRules[0] &&
              totalSubRules[0]?.length > 0 &&
              ruleTitle &&
              subTItle && (
                <SubRuleFileItem
                  applicationID={applicationID}
                  ruleTitle={ruleTitle}
                  fileName={subTItle?.file_name}
                  vulnerableCodeData={subTItle?.matched_data}
                  vulnerability={vulnerability}
                  coseSegmentData={coseSegmentData}
                  isErrorCodeView={isErrorCodeView}
                  isLoadingCodeView={isLoadingCodeView}
                  reportCodeViewData={reportCodeViewData}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  selectedSubruleId={selectedSubrule?.id || ''}
                  platform={platform}
                  uploadType={uploadType}
                  hipaaPolicy={currentRule ? currentRule.hipaa_policy : ''}
                  hipaaPolicyReference={currentRule ? currentRule.hipaa_policy_reference : ''}
                  ruleName={currentRule ? currentRule.rule_name : ''}
                  ruleId={lastFileId}
                  currentSeverity={
                    selectedSubrule?.severity.toString() ? selectedSubrule.severity.toString() : ''
                  }
                  vulnerabilityCategory={
                    selectedSubrule?.vulnerability_cat ? selectedSubrule.vulnerability_cat : ''
                  }
                />
              )}
          </div>
        )}
      </div>

      {isLLMFeaturesEnabled && (
        <div className='chat-wrapper'>
          <div
            className='chat-toggle-btn'
            onClick={() => setIsChatOpen((prev) => !prev)}
          >
            <Image
              src='/images/icons/msg.svg'
              alt='Chatbot'
              width={120}
              height={120}
            />
          </div>

          {isChatOpen && (
            <div className='chat-container'>
              <Image
                src='/images/icons/bottomarrow.svg'
                alt='Arrow'
                width={24}
                height={24}
                className='chat-arrow'
              />
              <HippaCheckerChat userUploadId={applicationID} />
            </div>
          )}
        </div>
      )}
        {showManualCheckPopup && (
  <div className='manual-check-popup'>
    <button
      className='manual-check-popup__close'
      onClick={handleDismissPopup}
      aria-label="Close popup"
    >
      <Image
        src="/images/icons/ButtoncloseX.svg"
        alt="Close"
        width={40}
        height={40}
        style={{ display: 'block' }}
      />
    </button>

    <div className='manual-check-popup__content'>
      <div className='manual-check-popup__icon-title'>
        <div className='manual-check-popup__icon'>
          <Image
            src="/images/icons/popupicon.svg"
            alt="Manual check icon"
            width={48}
            height={48}
          />
        </div>

        <h3 className='manual-check-popup__title'>
          Review Potential Vulnerabilities
        </h3>
      </div>

      <p className='manual-check-popup__description'>
        We found code patterns that might not be vulnerable. Choose which ones should count toward your score.
      </p>
    </div>

    <div className='manual-check-popup__actions'>
      <button
        className='manual-check-popup__button manual-check-popup__button--secondary'
        onClick={handleDismissPopup}
      >
        Dismiss
      </button>
      <button
        className='manual-check-popup__button manual-check-popup__button--primary'
        onClick={() => handleMarkAsVulnerability(selectedSubruleId)}
      >
        Ignore Vulnerability
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default SpecificDetails;