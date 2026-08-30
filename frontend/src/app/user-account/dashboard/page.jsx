'use client';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/button';
import CardTop from '@/components/card-top';
import DropDown from '@/components/drop-down';
import HalfDoughnut from '@/components/half-doughnut';
import Heading from '@/components/heading';
import Icon from '@/components/icon';
import Loader from '@/components/loader';
import NoData from '@/components/no-data';
import ReportList from '@/components/report-list/page';
import SegmentedBarChart from '@/components/segmented-bar-chart';
import Text from '@/components/text';
import Tooltip from '@/components/tooltip';
import { useSelectedOption } from '@/context/selectOptionContext';
import SubscriptionContext from '@/context/subscriptionContext';
import { get } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import { hipaaScoreStatus, platformType } from '@/utils/constant-data';
import { formatNumberWithThousandsSuffix } from '@/utils/helper';
import useLocalStorage from '@/utils/useLocalData';
import { useQuery } from '@tanstack/react-query';

import './index.scss';

const Dashboard = () => {
  const route = useRouter();
  const [localData] = useLocalStorage('user');
  const { state, dispatch } = useSelectedOption();
  const [hipaaScore, setHipaaScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalPagesNumber, setTotalPagesNumber] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const { LowStatus, AverageStatus, StandardStatus } = hipaaScoreStatus;
  const { SPRING, ANDROID, LARAVEL, IOS, EXPRESS, DJANGO, DOTNET } = platformType;


  const {
    data: applicationList,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ['dashboard', currentPageNumber],
    queryFn: async () => {
    const response = await get(`${API_ENDPOINTS.DASHBOARD}?page=${currentPageNumber}`, true, 2);
    const data = response?.data?.dashboard?.user;
    if (data?.pagination?.total_pages) {
      setTotalPagesNumber(data.pagination.total_pages);
    }
    return data;
    },
    onError: (error) => {
      if (error.response?.status === 500) {
        setErrorMessage(error.response?.statusText || 'Internal Server Error');
      } else {
        setErrorMessage(error.message || 'An error occurred');
      }
    },
  });

  // console.log(applicationList)
  const criticalRisksCount = applicationList?.total_critical_risks;
  const highRisksCount = applicationList?.total_high_risks;
  const mediumRisksCount = applicationList?.total_medium_risks;
  const lowRisksCount = applicationList?.total_low_risks;
  const noRisksCount = applicationList?.total_no_risks;

  const topDataList = [
    {
      id: 1,
      title: 'Total Scanned',
      value: applicationList?.user_uploads_count ? applicationList?.user_uploads_count : 0,
      icon: 'top-scan',
      color: 'blue',
    },
    {
      id: 2,
      title: 'Critical Risks',
      value: criticalRisksCount ? criticalRisksCount : 0,
      icon: 'high-risk',
      color: 'deep-carmine-pink',
    },
    {
      id: 3,
      title: 'High Risks',
      value: highRisksCount ? highRisksCount : 0,
      icon: 'high-risk',
      color: 'red',
    },
    {
      id: 4,
      title: 'Medium Risks',
      value: mediumRisksCount ? mediumRisksCount : 0,
      icon: 'high-risk',
      color: 'orange',
    },
    {
      id: 5,
      title: 'Low Risks',
      value: lowRisksCount ? lowRisksCount : 0,
      icon: 'high-risk',
      color: 'green',
    },
  ];

  const setHippaScoreV2 = async (applicationID) => {
    setChartLoading(true);
    try {
      const response = await get(
        `${API_ENDPOINTS.USER_UPLOADS}/user_uploads/${applicationID}/rule_wise`,
        true,
        2,
      );
      const data = await response?.data;
      setHipaaScore(
        (data.user_upload.hipaa_risk_scores.cvss_risk_remaining /
          data.user_upload.hipaa_risk_scores.total_risk_score) *
          10,
      );
    } catch (error) {

    } finally {
      setChartLoading(false);
    }
  };

  const { userData, fetchData } = useContext(SubscriptionContext);
  // console.log("userdata:", applicationList)

  useEffect(() => {
    dispatch({
      type: 'SET_DATA',
      payload: {
        selectedOption: 'SUMMARIZE',
        currentPage: 1,
        startPage: 1,
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    });

    dispatch({
      type: 'SET_FILTER',
      payload: {
        filterStatus: 'All',
        currentPage: 1,
        startPage: 1,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (applicationList?.user_uploads[0]?.hipaa_risk_scores?.cvss_risk_remaining)
      setHipaaScore(
        (applicationList?.user_uploads[0]?.hipaa_risk_scores?.cvss_risk_remaining /
          applicationList?.user_uploads[0]?.hipaa_risk_scores?.total_risk_score) *
          100,
      );
  }, [applicationList]);

  return (
    <div className='dashboard'>
      <div className='dashboard__header'>
        <div>
          <Heading
            title={
              localData?.first_name
                ? `Welcome back, ${localData?.first_name + ' ' + localData?.last_name}`
                : 'Welcome back'
            }
            type='h5'
            color='neutral-900'
          />
          <Text
            color='neutral-500'
            size='fs-16'
          >
            Scan to check HIPAA reports and vulnerability fixing by HIPAAChecker
          </Text>
        </div>

        <Button
          type='primary'
          size='large'
          icon={'scan'}
          iconPosition={'after'}
          onClick={() => route.push('/user-account/scan')}
        >
          Scan Now
        </Button>
      </div>
      {errorMessage && (
        <div className='dashboard__server-error-message'>
          Sorry, there is an internal server error!!
        </div>
      )}
      <div className='dashboard__topCard'>
        {topDataList.map((item, index) => (
          <CardTop
            key={index}
            {...item}
          />
        ))}
      </div>
      {userData && (
        <div className='dashboard__sectionScore'>
          {userData?.plan && userData?.plan?.get_hipaa_score ? (
            <div className='dashboard__card'>
              <div className='dashboard__scoreHead'>
                <h3 className='dashboard__title'>HIPAA Risk Score</h3>
              </div>
              <DropDown
                type={'object'}
                data={
                  applicationList?.user_uploads?.length > 0 ? applicationList?.user_uploads : []
                }
                value={
                  applicationList?.user_uploads?.length > 0 && applicationList?.user_uploads[0].id
                }
                setValue={(val) =>
                  applicationList?.user_uploads?.some((item) => {
                    if (item.id === val) {
                      setHipaaScore(
                        (item?.hipaa_risk_scores?.cvss_risk_remaining /
                          item?.hipaa_risk_scores?.total_risk_score) *
                          100,
                      );
                      return true;
                    }
                  })
                }
              />
              <div className='dashboard__scoreContent'>
                <div className='dashboard__graph'>
                  <HalfDoughnut
                    isLoading={chartLoading}
                    pointervalue={hipaaScore}
                    comment={`${
                      hipaaScore >= 0 && hipaaScore <= 20
                        ? 'Low'
                        : hipaaScore > 20 && hipaaScore <= 45
                          ? 'Medium'
                          : hipaaScore > 45 && hipaaScore <= 80
                            ? 'High'
                            : 'Critical'
                    }`}
                    displayFormat='fraction'
                  />
                </div>
                <div className='dashboard__scoreItems'>
                  <span className='dashboard__scoreItem dashboard--cornell-red'>Critical</span>
                  <span className='dashboard__scoreItem dashboard--red'>High</span>
                  <span className='dashboard__scoreItem dashboard--orange'>Medium</span>
                  <span className='dashboard__scoreItem dashboard--green'>Low</span>
                </div>
              </div>
            </div>
          ) : (
            <div className='relative w-full h-full p-6'>
              <div className='dashboard__scoreHead'>
                <h3 className='dashboard__title'>Application Hipaa Score</h3>
              </div>
              <DropDown
                type={'object'}
                data={[]}
                value=''
              />
              <div className='dashboard__scoreContent'>
                <div className='dashboard__graph'>
                  <HalfDoughnut />
                </div>
                <div className='dashboard__scoreItems'>
                  <span className='dashboard__scoreItem dashboard--dark-red'>Critical</span>
                  <span className='dashboard__scoreItem dashboard--red'>High</span>
                  <span className='dashboard__scoreItem dashboard--orange'>Medium</span>
                  <span className='dashboard__scoreItem dashboard--green'>Low</span>
                </div>
              </div>
              <div
                onClick={() => route.push('/user-account/subscription')}
                className='absolute inset-0 bg-black bg-opacity-5 backdrop-blur-md rounded-[8px] 
            z-10 flex flex-col justify-center items-center cursor-pointer'
              >
                <div className='font-semibold'>Application Hipaa Score</div>
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
          <div className='dashboard__card'>
            <div className='dashboard__scannedHead'>
              <h3 className='dashboard__title'>Recently scanned</h3>
              <div className='dashboard__riskContent'>
                <span className='dashboard__riskItem dashboard--dark-red'>Critical</span>
                <span className='dashboard__riskItem dashboard--red'>High</span>
                <span className='dashboard__riskItem dashboard--orange'>Medium</span>
                <span className='dashboard__riskItem dashboard--green'>Low</span>
                {/* <span className='dashboard__riskItem dashboard--green'>No Risk</span> */}
              </div>
            </div>
            <div className='dashboard__table'>
              <table className='dashboard__scannedTable'>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Vulnerabilities</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        className='dashboard__loader'
                        colSpan={2}
                      >
                        <Loader size='medium' />
                      </td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td
                        className='dashboard__loader'
                        colSpan={2}
                      >
                        <NoData title={errorMessage} />
                      </td>
                    </tr>
                  ) : (
                    <>
                      {applicationList?.user_uploads?.length > 0 ? (
                        <>
                          {applicationList?.user_uploads?.slice(0, 3)?.map((item) => (
                            <tr key={item.id}>
                              {/*<td width={5}>*/}
                              {/*  <Image*/}
                              {/*    src={`/images/icons/${*/}
                              {/*      item?.platform === ANDROID*/}
                              {/*        ? 'android.svg'*/}
                              {/*        : item?.platform === DJANGO*/}
                              {/*          ? 'python.svg'*/}
                              {/*          : item?.platform === LARAVEL*/}
                              {/*            ? 'laravel.svg'*/}
                              {/*            : item?.platform === IOS*/}
                              {/*              ? 'ios.svg'*/}
                              {/*              : item?.platform === EXPRESS*/}
                              {/*                ? 'express.svg'*/}
                              {/*                : item?.platform === SPRING*/}
                              {/*                  ? 'spring.svg'*/}
                              {/*                  : item?.platform === DOTNET*/}
                              {/*                    ? 'dotnet.svg'*/}
                              {/*                    : 'rails.svg'*/}
                              {/*    }`}*/}
                              {/*    width={32}*/}
                              {/*    height={32}*/}
                              {/*    alt='Hipaachecker logo'*/}
                              {/*  />*/}
                              {/*</td>*/}
                              <td className='dashboard__productName'>
                                <Tooltip
                                  position='top'
                                  TooltipText={item?.name}
                                  type='div'
                                >
                                  <Text
                                    size='fs-14'
                                    color='neutral-900'
                                    weight='medium'
                                  >
                                    {item?.name}
                                  </Text>
                                </Tooltip>
                              </td>

                              <td>
                                {userData?.plan && userData?.plan?.get_vulnerability_breakdown ? (
                                  <div className='dashboard__vulnerabilityWrapper'>
                                    <SegmentedBarChart
                                      segments={[
                                        {
                                          color: 'dark-red',
                                          percent: item?.severity_counts.critical_risk
                                            ? (item.severity_counts.critical_risk /
                                                (item.severity_counts.high_risk +
                                                  item.severity_counts.medium_risk +
                                                  item.severity_counts.low_risk +
                                                  item.severity_counts.no_risk)) *
                                              100
                                            : 0,
                                          rawCount: item?.severity_counts.critical_risk,
                                          countTotal:
                                            item.severity_counts.high_risk +
                                            item.severity_counts.medium_risk +
                                            item.severity_counts.low_risk +
                                            item.severity_counts.critical_risk,
                                        },
                                        {
                                          color: 'red',
                                          percent: item?.severity_counts.high_risk
                                            ? (item.severity_counts.high_risk /
                                                (item.severity_counts.high_risk +
                                                  item.severity_counts.medium_risk +
                                                  item.severity_counts.low_risk +
                                                  item.severity_counts.no_risk)) *
                                              100
                                            : 0,
                                          rawCount: item?.severity_counts.high_risk,
                                          countTotal:
                                            item.severity_counts.high_risk +
                                            item.severity_counts.medium_risk +
                                            item.severity_counts.low_risk +
                                            item.severity_counts.critical_risk,
                                        },
                                        {
                                          color: 'orange',
                                          percent: item?.severity_counts.medium_risk
                                            ? (item.severity_counts.medium_risk /
                                                (item.severity_counts.high_risk +
                                                  item.severity_counts.medium_risk +
                                                  item.severity_counts.low_risk +
                                                  item.severity_counts.no_risk)) *
                                              100
                                            : 0,
                                          rawCount: item?.severity_counts.medium_risk,
                                          countTotal:
                                            item.severity_counts.high_risk +
                                            item.severity_counts.medium_risk +
                                            item.severity_counts.low_risk +
                                            item.severity_counts.critical_risk,
                                        },
                                        {
                                          color: 'green',
                                          percent: item?.severity_counts.low_risk
                                            ? (item.severity_counts.low_risk /
                                                (item.severity_counts.high_risk +
                                                  item.severity_counts.medium_risk +
                                                  item.severity_counts.low_risk +
                                                  item.severity_counts.no_risk)) *
                                              100
                                            : 0,
                                          rawCount: item?.severity_counts.low_risk,
                                          countTotal:
                                            item.severity_counts.high_risk +
                                            item.severity_counts.medium_risk +
                                            item.severity_counts.low_risk +
                                            item.severity_counts.critical_risk,
                                        },
                                      ]}
                                      showPercentages={false}
                                    />
                                    <div className='dashboard__vulnerabilityCounts'>
                                      <span className='dashboard__riskItem dashboard--dark-red'>
                                        {formatNumberWithThousandsSuffix(
                                          item?.severity_counts.critical_risk || 0,
                                        )}{' '}
                                        /{' '}
                                        {formatNumberWithThousandsSuffix(
                                          (item.severity_counts.high_risk || 0) +
                                            (item.severity_counts.medium_risk || 0) +
                                            (item.severity_counts.low_risk || 0) +
                                            (item.severity_counts.critical_risk || 0),
                                        )}
                                      </span>
                                      <span className='dashboard__riskItem dashboard--red'>
                                        {formatNumberWithThousandsSuffix(
                                          item?.severity_counts.high_risk || 0,
                                        )}{' '}
                                        /{' '}
                                        {formatNumberWithThousandsSuffix(
                                          (item.severity_counts.high_risk || 0) +
                                            (item.severity_counts.medium_risk || 0) +
                                            (item.severity_counts.low_risk || 0) +
                                            (item.severity_counts.critical_risk || 0),
                                        )}
                                      </span>
                                      <span className='dashboard__riskItem dashboard--orange'>
                                        {formatNumberWithThousandsSuffix(
                                          item?.severity_counts.medium_risk || 0,
                                        )}{' '}
                                        /{' '}
                                        {formatNumberWithThousandsSuffix(
                                          (item.severity_counts.high_risk || 0) +
                                            (item.severity_counts.medium_risk || 0) +
                                            (item.severity_counts.low_risk || 0) +
                                            (item.severity_counts.critical_risk || 0),
                                        )}
                                      </span>
                                      <span className='dashboard__riskItem dashboard--green'>
                                        {formatNumberWithThousandsSuffix(
                                          item?.severity_counts.low_risk || 0,
                                        )}{' '}
                                        /{' '}
                                        {formatNumberWithThousandsSuffix(
                                          (item.severity_counts.high_risk || 0) +
                                            (item.severity_counts.medium_risk || 0) +
                                            (item.severity_counts.low_risk || 0) +
                                            (item.severity_counts.critical_risk || 0),
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className='relative w-full h-full'>
                                    <SegmentedBarChart
                                      segments={[
                                        {
                                          color: 'custom-dark-red',
                                          percent: 10,
                                        },
                                        {
                                          color: 'red',
                                          percent: 10,
                                        },
                                        {
                                          color: 'orange',
                                          percent: 20,
                                        },
                                        {
                                          color: 'iris-blue',
                                          percent: 30,
                                        },
                                        {
                                          color: 'green',
                                          percent: 40,
                                        },
                                      ]}
                                    />
                                    <div
                                      // onClick={() => route.push('/user-account/subscription')}
                                      className='absolute inset-0 bg-black bg-opacity-5 backdrop-blur-md rounded-[8px]
      z-10 flex flex-col justify-center items-center'
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
                          ))}
                        </>
                      ) : (
                        <tr>
                          <td
                            className='dashboard__loader'
                            colSpan={2}
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
          </div>
        </div>
      )}
      <ReportList
        reportLIst={applicationList?.user_uploads?.length > 0 && applicationList?.user_uploads}
        loading={isLoading}
        errorMessage={errorMessage}
        route={route}
        userData={userData}
        currentPageNumber={currentPageNumber}
        setCurrentPageNumber={setCurrentPageNumber}
        pagination={applicationList?.pagination}
      />
    </div>
  );
};
export default Dashboard;
