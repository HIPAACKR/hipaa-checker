'use client';
import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Breadcrumb from '@/components/breadcrumb';
import VulnerabilityDoughnutChart from '@/components/doughnut';
import DropDown from '@/components/drop-down';
import HalfDoughnut from '@/components/half-doughnut';
import Icon from '@/components/icon';
import Loader from '@/components/loader';
import NoData from '@/components/no-data';
import Pagination from '@/components/pagination';
import SegmentedBarChart from '@/components/segmented-bar-chart';
import Skeleton from '@/components/skeleton-row';
import Subtitle from '@/components/subtitle';
import Text from '@/components/text';
import { Button } from '@/components/ui/Button';
import { useSelectedOption } from '@/context/selectOptionContext';
import SubscriptionContext from '@/context/subscriptionContext';
import { get } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import { hipaaScoreStatus, riskStatus } from '@/utils/constant-data';
import {
  cleanFilename,
  cleanRuleName,
  convertToSegmentData,
  decodeString,
  formatDate,
  maxPercentageCount,
} from '@/utils/helper';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import './index.scss';

const AnalysisReport = ({ params }) => {
  const route = useRouter();
  const { id } = params;
  const { HighRisk, MediumRisk, LowRisk, NoRisk, CriticalRisk } = riskStatus;
  const { LowStatus, AverageStatus, HighStatus, CriticalStatus } = hipaaScoreStatus;

  const { state, dispatch } = useSelectedOption();
  const [viewStatus, setViewStatus] = useState(decodeString(state?.filterStatus));

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPagesNumber, setTotalPagesNumber] = useState(0);
  const [totalPageRule, setTotalPageRule] = useState(0);
  const [totalEntriesRule, setTotalEntriesRule] = useState(0);
  const [hipaaScore, setHipaaScore] = useState(0);
  const [filterTrigger, setFilterTrigger] = useState(false);
  const { userData } = useContext(SubscriptionContext);
  const [riskBreakDown, setRiskBreakDown] = useState([]);
  const [totalRemainingRiskPercent, setTotalRemainingRiskPercent] = useState(0);
  const [totalMitigatedRiskPercent, setTotalMitigatedRiskPercent] = useState(0);
  const [analyzedResults, setAnalyzedResults] = useState([]);
  const [noRiskPercentage, setNoRiskPercentage] = useState(0);
  const [allRules, setAllRules] = useState([]);

  // const {
  //   data: reportDetailsData,
  //   isLoading: isLoadingReportDetails,
  //   isError: isErrorReportDetails,
  //   isSuccess: isSuccessReportDetails,
  // } = useQuery({
  //   queryKey: ['reportDetails', id],
  //   queryFn: async () => {
  //     const response = await get(`${API_ENDPOINTS.USER_UPLOADS}/${id}`, true);
  //     console.log(response);
  //     return response.json().then((data) => data?.user_upload);
  //   },
  // });

  const getSeverityScore = (item) => {
    // Get the highest severity level from all rules and sub-rules
    let highestSeverity = 0;

    if (item.rules && item.rules.length > 0) {
      item.rules.forEach((rule) => {
        if (rule.sub_rules && rule.sub_rules.length > 0) {
          rule.sub_rules.forEach((subRule) => {
            if (subRule.severity > highestSeverity) {
              highestSeverity = subRule.severity;
            }
          });
        }
      });
    }

    return highestSeverity;
  };

  const {
    data: reportDetailsData,
    isLoading: isLoadingReportDetails,
    isError: isErrorReportDetails,
    isSuccess: isSuccessReportDetails,
  } = useQuery({
    queryKey: ['reportDetails', id],
    queryFn: async () => {
      const url = `${API_ENDPOINTS.USER_UPLOADS}/${id}/file_wise?page=${currentPage}${severityMap[viewStatus]}`;
      // console.log('Fetching data from:', url);
      const response = await get(url, true);
      const jsonData = response?.data;
      // console.log('API Response:', jsonData);

      // Just return the user_upload data without additional filtering
      return jsonData?.user_upload;
    },
  });

  const severityMap = {
    All: '',
    'No Risk': '&severity=0',
    'Low Risk': '&severity=1',
    'Medium Risk': '&severity=2',
    'High Risk': '&severity=3',
    'Critical Risk': '&severity=4',
  };

  const {
    data: specificReportDetailsData,
    isLoading: isLoadingSpecificReportDetails,
    isError: isErrorSpecificReportDetails,
    isSuccess: isSuccessSpecificReportDetails,
  } = useQuery({
    queryKey: ['specificReportDetails', currentPage, viewStatus, id],
    queryFn: async () => {
      const response = await get(
        `${API_ENDPOINTS.USER_UPLOADS}/${id}/file_wise?page=${currentPage}${
          viewStatus === NoRisk
            ? '&severity=0'
            : viewStatus === LowRisk
              ? '&severity=1'
              : viewStatus === MediumRisk
                ? '&severity=2'
                : viewStatus === HighRisk
                  ? '&severity=3'
                  : viewStatus === CriticalRisk
                    ? '&severity=4'
                    : ''
        }`,
        true,
        2,
      );
      return response?.data?.user_upload;
    },
  });

  const fetchData = async (pageParam) => {
    const response = await get(
      `${API_ENDPOINTS.USER_UPLOADS}/${id}/rule_wise?page=${pageParam}`,
      true,
      2,
    );

    const data = await response?.data;
    const totalPages = data.user_upload?.pagination?.total_pages;

    // console.log(data)

    if (totalPages) {
      setTotalPagesNumber(totalPages);
    }

    if (data?.user_upload && pageParam <= data.user_upload?.pagination?.total_pages) {
      return {
        data: data.user_upload.analyzed_results || [],
        nextPage:
          pageParam <= data.user_upload?.pagination?.total_pages ? pageParam + 1 : undefined,
      };
    } else {
      return { data: [], nextPage: undefined };
    }
  };

  const fetchDataV2 = async () => {
    try {
      const response_v2 = await get(`${API_ENDPOINTS.USER_UPLOADS}/${id}/rule_wise`, true, 2);
      const data_v2 = response_v2?.data;

      if (data_v2?.user_upload?.severity_counts) {
        const severityCounts = data_v2.user_upload.severity_counts;
        // console.log("API Response:", data_v2);

        // console.log("Severity Counts:", severityCounts);
        const total =
          severityCounts.no_risk +
          severityCounts.low_risk +
          severityCounts.medium_risk +
          severityCounts.high_risk +
          severityCounts.critical_risk;

        const noRiskPercentage =
          total > 0
            ? (data_v2?.user_upload?.hipaa_risk_scores?.cvss_risk_remaining /
                data_v2?.user_upload?.hipaa_risk_scores?.total_risk_score) *
              100
            : 0;

        setNoRiskPercentage(
          (data_v2?.user_upload?.hipaa_risk_scores?.cvss_risk_remaining /
            data_v2?.user_upload?.hipaa_risk_scores?.total_risk_score) *
            100,
        );
      }

      if (data_v2?.user_upload?.hipaa_risk_scores?.total_risk_score) {
        setHipaaScore(data_v2.user_upload.hipaa_risk_scores.total_risk_score);
      }

      if (data_v2?.user_upload?.hipaa_risk_scores?.risk_breakdown) {
        setRiskBreakDown(data_v2.user_upload.hipaa_risk_scores.risk_breakdown);
      }

      if (
        data_v2?.user_upload?.hipaa_risk_scores?.cvss_risk_mitigation &&
        data_v2?.user_upload?.hipaa_risk_scores?.total_risk_score
      ) {
        setTotalMitigatedRiskPercent(
          (data_v2.user_upload.hipaa_risk_scores.cvss_risk_mitigation /
            data_v2.user_upload.hipaa_risk_scores.total_risk_score) *
            100,
        );
      }
      if (data_v2?.user_upload?.analyzed_results) {
        setAnalyzedResults(data_v2.user_upload.analyzed_results);
      }

      if (data_v2?.user_upload?.hipaa_risk_scores?.cvss_risk_remaining) {
        setTotalRemainingRiskPercent(
          (data_v2.user_upload.hipaa_risk_scores.cvss_risk_remaining /
            data_v2.user_upload.hipaa_risk_scores.total_risk_score) *
            100,
        );
      }
    } catch (error) {

    }
  };

  const {
    data: summarizeReportDetailsData,
    error: isErrorSummarizeReportDetails,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['summarizeReportDetails', id],
    queryFn: ({ pageParam = 1 }) => fetchData(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (summarizeReportDetailsData?.pages) {
      const allPagesRules = summarizeReportDetailsData.pages.flatMap((page) => page.data || []);
      setAllRules(allPagesRules);
    }
  }, [summarizeReportDetailsData]);

  useEffect(() => {
    fetchDataV2();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSummarizeChange = () => {
    dispatch({
      type: 'SET_DATA',
      payload: {
        selectedOption: 'SUMMARIZE',
      },
    });
  };

  const handleSpecificChange = () => {
    dispatch({
      type: 'SET_DATA',
      payload: {
        selectedOption: 'SPECIFIC',
      },
    });
  };

  const paths = [
    { name: 'Dashboard', url: '/user-account/dashboard' },
    { name: 'Analysis Report', url: '' },
  ];

  useEffect(() => {
    if (
      specificReportDetailsData &&
      specificReportDetailsData?.pagination?.total_entries !== totalEntries &&
      specificReportDetailsData?.pagination?.total_pages !== totalPage
    ) {
      setTotalEntries(specificReportDetailsData?.pagination?.total_entries);
      setTotalPage(specificReportDetailsData?.pagination?.total_pages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specificReportDetailsData]);

  useEffect(() => {
    if (
      summarizeReportDetailsData &&
      summarizeReportDetailsData?.pagination?.total_entries !== totalEntriesRule &&
      summarizeReportDetailsData?.pagination?.total_pages !== totalPageRule
    ) {
      setTotalEntriesRule(summarizeReportDetailsData?.pagination?.total_entries);
      setTotalPageRule(summarizeReportDetailsData?.pagination?.total_pages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summarizeReportDetailsData]);

  // useEffect(() => {
  //   if (reportDetailsData?.hipaa_score) setHipaaScore(reportDetailsData?.hipaa_score / 10);
  // }, [reportDetailsData]);

  useEffect(() => {
    dispatch({
      type: 'SET_VULNERABILITY_STATUS',
      payload: {
        vulnerabilityStatusForFile: 'High',
        vulnerabilityStatusForRule: 'High',
        ruleWise: {
          subTitle: '',
          ruleTitle: [],
        },
        fileWise: {
          subTitle: '',
          ruleTitle: [],
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className='analysisReport'>
      <Breadcrumb
        header={'HIPAA Rules Analysis Report'}
        paths={paths}
        backButtonURL={'/user-account/dashboard'}
      />
      <div className='analysisReport__body-top'>
        <div className='analysisReport__applicationWrapper'>
          <div className='analysisReport__application'>
            <Text
              color='neutral-400'
              size='fs-12'
              weight='regular'
            >
              Application name
            </Text>
            <div className='analysisReport__name'>
              {isLoadingReportDetails ? (
                <Skeleton />
              ) : isErrorReportDetails ? (
                <Text
                  color='neutral-600'
                  size='fs-12'
                  weight='regular'
                >
                  Data fetching failed from server
                </Text>
              ) : (
                <Text
                  color='neutral-800'
                  size='fs-14'
                  weight='medium'
                >
                  {reportDetailsData?.name}
                </Text>
              )}
            </div>
            <div className='analysisReport__details'>
              <div className='analysisReport__details__data'>
                <Text
                  color='neutral-400'
                  size='fs-12'
                  weight='regular'
                >
                  Platform type:
                </Text>
                {isLoadingReportDetails ? (
                  <Skeleton />
                ) : isErrorReportDetails ? (
                  <Text
                    color='neutral-600'
                    size='fs-12'
                    weight='regular'
                  >
                    Data fetching failed from server
                  </Text>
                ) : (
                  <Text
                    color='neutral-600'
                    size='fs-12'
                    weight='regular'
                  >
                    {reportDetailsData?.platform}
                  </Text>
                )}
              </div>

              <div className='analysisReport__details__data'>
                <Text
                  color='neutral-400'
                  size='fs-12'
                  weight='regular'
                >
                  Time
                </Text>

                {isLoadingReportDetails ? (
                  <Skeleton />
                ) : (
                  <Text
                    color='neutral-600'
                    size='fs-12'
                    weight='regular'
                  >
                    {formatDate(reportDetailsData?.created_at)}
                  </Text>
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={() => route.push(`/user-account/dashboard/compliance-report/${id}`)}
            className="button"
          >
            Compliance Report
          </Button>
        </div>
        <div className='analysisReport__cardWrapper'>
          {userData?.plan && userData?.plan?.get_hipaa_score ? (
            <div className='analysisReport__card'>
              <div className='analysisReport__scoreHead analysisReport--pc-justify-center analysisReport__scoreHead--bg-gray'>
                <h3 className='analysisReport__title'>HIPAA Risk Score (%)</h3>
              </div>
              <div className='analysisReport__scoreContent'>
                <div className='analysisReport__graph'>
                  <HalfDoughnut
                    isLoading={isLoadingReportDetails}
                    pointervalue={noRiskPercentage.toFixed(2)}
                    comment={`${
                      totalRemainingRiskPercent >= 0 && totalRemainingRiskPercent <= 20
                        ? LowStatus
                        : totalRemainingRiskPercent > 20 && totalRemainingRiskPercent <= 45
                          ? AverageStatus
                          : totalRemainingRiskPercent > 45 && totalRemainingRiskPercent <= 80
                            ? HighStatus
                            : CriticalStatus
                    }`}
                    displayFormat='fraction'
                  />
                </div>
                <div className='analysisReport__scoreItems'>
                  <span className='analysisReport__scoreItem analysisReport--cornell-red'>
                    Critical
                  </span>
                  <span className='analysisReport__scoreItem analysisReport--red'>High</span>
                  <span className='analysisReport__scoreItem analysisReport--orange'>Medium</span>
                  <span className='analysisReport__scoreItem analysisReport--green'>Low</span>
                </div>
              </div>
            </div>
          ) : (
            <div className='relative w-full h-full p-6'>
              <div className='analysisReport__card'>
                <div className='analysisReport__scoreHead analysisReport--pc-justify-center'>
                  <h3 className='analysisReport__title'>HIPAA Score</h3>
                </div>
                <div className='analysisReport__scoreContent'>
                  <div className='analysisReport__graph'>
                    <HalfDoughnut />
                  </div>
                  <div className='analysisReport__scoreItems'>
                    <span className='analysisReport__scoreItem analysisReport--red'>Low</span>
                    <span className='analysisReport__scoreItem analysisReport--orange'>
                      Avarage
                    </span>
                    <span className='analysisReport__scoreItem analysisReport--green'>
                      Standard
                    </span>
                  </div>
                </div>
              </div>
              <div
                onClick={() => route.push('/user-account/subscription')}
                className='absolute inset-0 bg-black bg-opacity-5 backdrop-blur-md rounded-[8px] 
              z-10 flex flex-col justify-center items-center cursor-pointer'
              >
                <div className='font-semibold'>HIPAA Score</div>
                <div>
                  <Icon
                    name='box-lock'
                    size={24}
                    color='gray'
                  />
                </div>
              </div>
            </div>
          )}
          {userData?.plan && userData?.plan?.get_vulnerability_breakdown ? (
            <div className='analysisReport__card'>
              <div className='analysisReport__scoreHead analysisReport__scoreHead--bg-gray'>
                <h3 className='analysisReport__title'>Vulnerability Breakdown</h3>
              </div>
              <div className='analysisReport__graph'>
                <VulnerabilityDoughnutChart
                  isLoading={isLoadingReportDetails}
                  insufficientAuthorization={
                    riskBreakDown[0]?.total_risk_score && hipaaScore !== 0
                      ? (
                          (((riskBreakDown[0]?.cvss_risk_remaining / hipaaScore) * 100) /
                            noRiskPercentage) *
                          100
                        ).toFixed(2)
                      : 0
                  }
                  inadequateDataSecurity={
                    riskBreakDown[1]?.total_risk_score && hipaaScore !== 0
                      ? (
                          (((riskBreakDown[1]?.cvss_risk_remaining / hipaaScore) * 100) /
                            noRiskPercentage) *
                          100
                        ).toFixed(2)
                      : 0
                  }
                  insecureNetworkCommunication={
                    riskBreakDown[2]?.total_risk_score && hipaaScore !== 0
                      ? (
                          (((riskBreakDown[2]?.cvss_risk_remaining / hipaaScore) * 100) /
                            noRiskPercentage) *
                          100
                        ).toFixed(2)
                      : 0
                  }
                  inconsistentAutditTrail={
                    riskBreakDown[3]?.total_risk_score && hipaaScore !== 0
                      ? (
                          (((riskBreakDown[3]?.cvss_risk_remaining / hipaaScore) * 100) /
                            noRiskPercentage) *
                          100
                        ).toFixed(2)
                      : 0
                  }
                  insufficientAuthorizationAct={
                    riskBreakDown[0]?.total_risk_score ? riskBreakDown[0]?.total_risk_score : 0
                  }
                  inadequateDataSecurityAct={
                    riskBreakDown[1]?.total_risk_score ? riskBreakDown[1]?.total_risk_score : 0
                  }
                  insecureNetworkCommunicationAct={
                    riskBreakDown[2]?.total_risk_score ? riskBreakDown[2]?.total_risk_score : 0
                  }
                  inconsistentAutditTrailAct={
                    riskBreakDown[3]?.total_risk_score ? riskBreakDown[3]?.total_risk_score : 0
                  }
                  insufficientAuthorizationRiskRemaining={
                    riskBreakDown[0]?.total_risk_score ? riskBreakDown[0]?.cvss_risk_remaining : 0
                  }
                  inadequateDataSecurityRiskRemaining={
                    riskBreakDown[1]?.total_risk_score ? riskBreakDown[1]?.cvss_risk_remaining : 0
                  }
                  insecureNetworkCommunicationRiskRemaining={
                    riskBreakDown[2]?.total_risk_score ? riskBreakDown[2]?.cvss_risk_remaining : 0
                  }
                  inconsistentAuditTrailRiskRemaining={
                    riskBreakDown[3]?.total_risk_score ? riskBreakDown[3]?.cvss_risk_remaining : 0
                  }
                  insufficientAuthorizationRiskMitigated={
                    riskBreakDown[0]?.total_risk_score ? riskBreakDown[0]?.cvss_risk_mitigation : 0
                  }
                  inadequateDataSecurityRiskMitigated={
                    riskBreakDown[1]?.total_risk_score ? riskBreakDown[1]?.cvss_risk_mitigation : 0
                  }
                  insecureNetworkCommunicationRiskMitigated={
                    riskBreakDown[2]?.total_risk_score ? riskBreakDown[2]?.cvss_risk_mitigation : 0
                  }
                  inconsistentAuditTrailRiskMitigated={
                    riskBreakDown[3]?.total_risk_score ? riskBreakDown[3]?.cvss_risk_mitigation : 0
                  }
                />
              </div>
            </div>
          ) : (
            <div className='relative w-full h-full p-6'>
              <div className='analysisReport__card'>
                <div className='analysisReport__scoreHead'>
                  <h3 className='analysisReport__title'>Vulnerability Breakdown</h3>
                </div>
                <div className='analysisReport__graph'>
                  <VulnerabilityDoughnutChart
                    insufficientAuthorization={0}
                    inadequateDataSecurity={0}
                    insecureNetworkCommunication={0}
                    inconsistentAuditTrail={0}
                    insufficientAuthorizationAct={0}
                    inadequateDataSecurityAct={0}
                    insecureNetworkCommunicationAct={0}
                    inconsistentAuditTrailAct={0}
                    insufficientAuthorizationRiskRemaining={0}
                    inadequateDataSecurityRiskRemaining={0}
                    insecureNetworkCommunicationRiskRemaining={0}
                    inconsistentAuditTrailRiskRemaining={0}
                    insufficientAuthorizationRiskMitigated={0}
                    inadequateDataSecurityRiskMitigated={0}
                    insecureNetworkCommunicationRiskMitigated={0}
                    inconsistentAuditTrailRiskMitigated={0}
                  />
                </div>
              </div>
              <div
                onClick={() => route.push('/user-account/subscription')}
                className='absolute inset-0 bg-black bg-opacity-5 backdrop-blur-md rounded-[8px] 
              z-10 flex flex-col justify-center items-center cursor-pointer'
              >
                <div className='font-semibold'>Vulnerability Breakdown</div>
                <div>
                  <Icon
                    name='box-lock'
                    size={24}
                    color='gray'
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='analysisReport__card mt-8'>
          <div className='analysisReport__scoreHead analysisReport--pc-justify-center'>
            <h3 className='analysisReport__title'>Risk Breakdown</h3>
          </div>
          <div className='flex gap-4 justify-center mt-4'>
            <div className='flex items-center gap-2'>
              <span className='w-3 h-3 bg-red-600 rounded-full'></span>
              <span className='text-red-4600 text-sm'>Risk Remaining</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='w-3 h-3 bg-green-600 rounded-full'></span>
              <span className='text-green-600 text-sm'>Risk Mitigation</span>
            </div>
          </div>
          <div>
            <div className='analysisReport__specificTable'>
              <table className='w-full border-collapse'>
                <thead>
                  <tr>
                    <th className='px-4 py-2 border-b text-left'>Category</th>
                    <th className='px-4 py-2 border-b'>Breakdown</th>
                  </tr>
                </thead>
                <tbody>
                  {riskBreakDown ? (
                    riskBreakDown.map((item, index) => (
                      <tr
                        key={index}
                        className='w-full'
                      >
                        <td className='px-4 py-2'>
                          {index + 1}. {item.risk_category}
                        </td>
                        <td className='px-4 py-2'>
                          {userData?.plan && userData?.plan?.get_vulnerability_breakdown ? (
                            <SegmentedBarChart
                              segments={[
                                {
                                  color: 'red',
                                  percent: item?.cvss_risk_remaining
                                    ? (item.cvss_risk_remaining / item.total_risk_score) * 100
                                    : 0,
                                },
                                {
                                  color: 'green',
                                  percent: item?.cvss_risk_mitigation
                                    ? (item.cvss_risk_mitigation / item.total_risk_score) * 100
                                    : 0,
                                },
                              ]}
                            />
                          ) : (
                            <div className='relative w-full h-full'>
                              <SegmentedBarChart
                                segments={[
                                  {
                                    color: 'red',
                                    percent: 50,
                                  },
                                  {
                                    color: 'green',
                                    percent: 50,
                                  },
                                ]}
                              />
                              <div
                                onClick={() => route.push('/user-account/subscription')}
                                className='absolute inset-0 bg-black bg-opacity-5 backdrop-blur-md rounded-[8px] 
                                  z-10 flex flex-col justify-center items-center cursor-pointer'
                              >
                                <Icon
                                  name='box-lock'
                                  size={24}
                                  color='gray'
                                />
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>No data Available</tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className='analysisReport__body-bottom'>
        {userData?.plan &&
        userData?.plan?.get_specific_reports &&
        userData?.plan?.get_summerized_reports ? (
          <div>
            <Subtitle>Scanned files</Subtitle>
            <div className='analysisReport__selectWrapper'>
              <div className='analysisReport__tabWrapper'>
                <span
                  className={`analysisReport__tabWrapper--defaultTab ${state?.selectedOption === 'SUMMARIZE' ? 'analysisReport__tabWrapper--active' : ''}`}
                  onClick={handleSummarizeChange}
                >
                  Summarize Report
                </span>
                <span
                  className={`analysisReport__tabWrapper--defaultTab ${state?.selectedOption === 'SPECIFIC' ? 'analysisReport__tabWrapper--active' : ''}`}
                  onClick={handleSpecificChange}
                >
                  Specific Report
                </span>
              </div>
              {state?.selectedOption === 'SPECIFIC' && (
                <DropDown
                  value={viewStatus}
                  data={['All', 'Low Risk', 'Medium Risk', 'High Risk', 'Critical Risk']}
                  setValue={(val) => {
                    // console.log('Risk Status: ', val)
                    setViewStatus(val);
                    setFilterTrigger((prev) => !prev);
                  }}
                />
              )}
            </div>

            {state?.selectedOption === 'SUMMARIZE' && (
              <div className='analysisReport__summarizedTableWrapper'>
                <div className='analysisReport__specificTable'>
                  <table>
                    <thead>
                      <tr>
                        <th>All Rules</th>
                        <th className='items-start'>Vulnerabilities</th>
                        <th>Report</th>
                      </tr>
                    </thead>
                    <tbody>
                      {status === 'loading' ? (
                        <tr>
                          <td
                            className='analysisReport__rules-loader'
                            colSpan={4}
                          >
                            <Loader size='small' />
                          </td>
                        </tr>
                      ) : isErrorSummarizeReportDetails ? (
                        <tr>
                          <td
                            className='analysisReport__loader'
                            colSpan={4}
                          >
                            <NoData title='Data fetching failed from server' />
                          </td>
                        </tr>
                      ) : allRules.length === 0 ? (
                        <tr>
                          <td
                            className='analysisReport__loader'
                            colSpan={4}
                          >
                            <NoData />
                          </td>
                        </tr>
                      ) : (
                        <>
                          {allRules.map((item, index) => {
                            const uniqueCats = [
                              ...new Set(
                                (item.sub_rules || [])
                                  .map((rule) => rule.vulnerability_cat)
                                  .filter(Boolean),
                              ),
                            ];

                            const categoryMap = {
                              'Inadequate Data Security': 'Inadequate Data Security',
                              'Inconsistent Audit Trail': 'Inconsistent Audit Trail',
                              'Insufficient Authorization': 'Insufficient Authorization',
                              'Insecure Network Communication': 'Insecure Network Communication',
                            };

                            return (
                              <tr key={`${item.rule_id}-${index}`}>
                                <td className='max-w-xs'>{item?.rule_name}</td>
                                <td>
                                  {uniqueCats.map((cat, idx) => (
                                    <Link
                                      key={idx}
                                      href={`/user-account/dashboard/summarize-report-details/${id}--${
                                        index + 1
                                      }--${item?.rule_id}--${cleanRuleName(
                                        item?.rule_name,
                                      )}?category=${encodeURIComponent(cat)}`}
                                      passHref
                                    >
                                      <span
                                        className='mr-3 text-blue-600 hover:text-blue-800 cursor-pointer'
                                        title={cat}
                                      >
                                        {categoryMap[cat] || cat}
                                      </span>
                                    </Link>
                                  ))}
                                </td>

                                <td>
                                  {uniqueCats.length > 0 ? (

                                  

                                    <Link
                                      href={`/user-account/dashboard/summarize-report-details/${id}--${
                                        index + 1
                                      }--${item?.rule_id}--${cleanRuleName(item?.rule_name)}`}
                                    >
                                      <Text
                                        size='fs-14'
                                        color='primary-600'
                                        weight='semi-bold'
                                        align='center'
                                      >
                                        View Report
                                      </Text>
                                    </Link>

                                  ) : (
                                    <Link
                                      href={`/user-account/dashboard/code-suggestion/${item.rule_id}--${reportDetailsData?.platform}--${id}--${encodeURIComponent(item?.rule_name)}`}
                                    >
                                    
                                      <Text
                                        size='fs-14'
                                        color='primary-600'
                                        weight='semi-bold'
                                        align='center'
                                      >
                                        Code Suggestion
                                      </Text>
                                    </Link>
                                 )}
                                </td>

                              </tr>
                            );
                          })}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {state?.selectedOption === 'SPECIFIC' && (
              <div className='analysisReport__specificTableWrapper'>
                <div className='analysisReport__specificTable'>
                  <table>
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Severity</th>
                        <th>Vulnerabilities</th>
                        <th>Report</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingSpecificReportDetails ? (
                        <tr>
                          <td
                            className='analysisReport__loader'
                            colSpan={4}
                          >
                            <Loader size='medium' />
                          </td>
                        </tr>
                      ) : isErrorSpecificReportDetails ? (
                        <tr>
                          <td
                            className='analysisReport__loader'
                            colSpan={4}
                          >
                            <NoData title='Data fetching failed from server' />
                          </td>
                        </tr>
                      ) : (
                        <>
                          {specificReportDetailsData?.analyzed_results?.length > 0 ? (
                            specificReportDetailsData?.analyzed_results?.map((item, index) => {
                              const severityData = convertToSegmentData('specific', item.rules);
                              const maxSeverityData = maxPercentageCount(severityData);
                              // console.log("MaxSevData: ", severityData);
                              return (
                                <tr key={index}>
                                  <td>
                                    <Text
                                      size='fs-14'
                                      color='neutral-900'
                                      weight='medium'
                                    >
                                      {item?.filename}
                                    </Text>
                                  </td>
                                  <td>
                                    <div>
                                      <Image
                                        src={`/images/icons/${
                                          maxSeverityData?.color === 'green'
                                            ? 'bug-green.svg'
                                            : maxSeverityData?.color === 'iris-blue'
                                              ? 'bug-cyan.svg'
                                              : maxSeverityData?.color === 'orange'
                                                ? 'bug-yellow.svg'
                                                : maxSeverityData?.color === 'red'
                                                  ? 'bug-red.svg'
                                                  : maxSeverityData?.color == 'cornell-red'
                                                    ? 'bug-dark-red.svg'
                                                    : 'bug-green.svg'
                                        }`}
                                        alt='severity-icon'
                                        width={18}
                                        height={18}
                                      />
                                      <Text
                                        size='fs-14'
                                        color='neutral-600'
                                      >
                                        {`${
                                          maxSeverityData?.color === 'green'
                                            ? 'No Risk'
                                            : maxSeverityData?.color === 'iris-blue'
                                              ? 'Low'
                                              : maxSeverityData?.color === 'orange'
                                                ? 'Medium'
                                                : maxSeverityData?.color === 'red'
                                                  ? 'High'
                                                  : maxSeverityData?.color === 'cornell-red'
                                                    ? 'Critical'
                                                    : 'No Risk'
                                        }`}
                                      </Text>
                                    </div>
                                  </td>
                                  <td>
                                    <SegmentedBarChart
                                      segments={convertToSegmentData('specific', item.rules)}
                                    />
                                  </td>

                                  <td>
                                    <Link
                                      href={`/user-account/dashboard/specific-report-details/${specificReportDetailsData?.id}--${currentPage}--${viewStatus}--${item?.file_id}--${cleanFilename(item?.filename)}`}
                                    >
                                      <Text
                                        size='fs-14'
                                        color='primary-600'
                                        weight='semi-bold'
                                        align='center'
                                      >
                                        View Report
                                      </Text>
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td
                                className='analysisReport__loader'
                                colSpan={4}
                              >
                                <NoData />
                              </td>
                            </tr>
                          )}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                {totalEntries > 0 && (
                  <Pagination
                    totalEntries={totalEntries}
                    totalPages={totalPage}
                    setOne={filterTrigger}
                    setCurrentPageNumber={(val) => {
                      setCurrentPage(val);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div className='relative w-full h-full p-6'>
            <Subtitle>Scanned files</Subtitle>
            <div className='analysisReport__selectWrapper'>
              <div className='analysisReport__tabWrapper'>
                <span
                  className={`analysisReport__tabWrapper--defaultTab ${state?.selectedOption === 'SUMMARIZE' ? 'analysisReport__tabWrapper--active' : ''}`}
                >
                  Summarize Report
                </span>
                <span
                  className={`analysisReport__tabWrapper--defaultTab ${state?.selectedOption === 'SPECIFIC' ? 'analysisReport__tabWrapper--active' : ''}`}
                >
                  Specific Report
                </span>
              </div>
            </div>

            {state?.selectedOption === 'SUMMARIZE' && (
              <div className='analysisReport__summarizedTableWrapper'>
                <div className='analysisReport__specificTable'>
                  <table>
                    <thead>
                      <tr>
                        <th>All Rules</th>
                        <th>vulnerabilities</th>
                        <th>Report</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        <>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                            <>
                              <tr key={index}>
                                <td>
                                  <Text
                                    size='fs-14'
                                    color='neutral-900'
                                    weight='medium'
                                  >
                                    {`${index + 1}. Report`}
                                  </Text>
                                </td>
                                <td>
                                  <SegmentedBarChart
                                    segments={convertToSegmentData('summarize', {
                                      high: 10,
                                      medium: 20,
                                      low: 30,
                                      no_risk: 40,
                                    })}
                                  />
                                </td>
                                <td>
                                  <Text
                                    size='fs-14'
                                    color='primary-600'
                                    weight='semi-bold'
                                    align='center'
                                  >
                                    View Report
                                  </Text>
                                </td>
                              </tr>
                            </>
                          ))}
                        </>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div
              onClick={() => route.push('/user-account/subscription')}
              className='absolute inset-0 bg-black bg-opacity-5 backdrop-blur-md rounded-[8px] 
              z-10 flex flex-col justify-center items-center cursor-pointer'
            >
              <div className='font-semibold'>Specific Report / Summerized Report</div>
              <div>
                <Icon
                  name='box-lock'
                  size={24}
                  color='gray'
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisReport;
