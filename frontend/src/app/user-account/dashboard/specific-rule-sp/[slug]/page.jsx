'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import Breadcrumb from '@/components/breadcrumb';
import Button from '@/components/button';
import Loader from '@/components/loader';
import NoData from '@/components/no-data';
import Skeleton from '@/components/skeleton-row';
import Subtitle from '@/components/subtitle';
import Text from '@/components/text';
import { useSelectedOption } from '@/context/selectOptionContext';
import { get } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import { riskStatus, vulnerabilityStatus } from '@/utils/constant-data';
import { cleanFilename, decodeString } from '@/utils/helper';
import { useQuery } from '@tanstack/react-query';

import './index.scss';

const SpecificRuleForSp = ({ params }) => {
  const { slug } = params;
  const { All, High, Low, Medium, Critical, Satisfactory } = vulnerabilityStatus;
  const { HighRisk, MediumRisk, LowRisk, NoRisk, CriticalRisk } = riskStatus;
  const { state, dispatch } = useSelectedOption();
  const pathSegments = slug.split('--');
  const applicationID = pathSegments[0];
  const currentPage = pathSegments[1];
  const viewStatus = decodeString(pathSegments[2]);
  const vulnerability = viewStatus?.split(' ')[0];
  const fileID = pathSegments[3];
  const subruleID = pathSegments[4];
  const filename = pathSegments[5];
  const ruleID = pathSegments[6];
  const ruleName = decodeString(pathSegments[7]);

  const [subTitle, setSubTitle] = useState('');
  const [codeSegmentData, setCodeSegmentData] = useState();
  const {
    data: specificReportDetailsData,
    isLoading: isLoadingSpecificReportDetails,
    isError: isErrorSpecificReportDetails,
    isSuccess: isSuccessSpecificReportDetails,
  } = useQuery({
    queryKey: ['specificReportDetailsAnalysis', currentPage, viewStatus, vulnerability],
    queryFn: async () => {
      const response = await get(
        `${API_ENDPOINTS.USER_UPLOADS}/${applicationID}/file_wise?page=${currentPage}${
          viewStatus === NoRisk || vulnerability === Satisfactory
            ? '&severity=0'
            : viewStatus === LowRisk || vulnerability === Low
              ? '&severity=1'
              : viewStatus === MediumRisk || vulnerability === Medium
                ? '&severity=2'
                : viewStatus === HighRisk || vulnerability === High
                  ? '&severity=3'
                  : viewStatus === CriticalRisk || vulnerability === Critical
                    ? '&severity=4'
                    : '&severity=3'
        }`,
        true,
        2,
      );
      return response?.data?.user_upload;
    },
  });

  const filterDataForSpecificReport = specificReportDetailsData?.analyzed_results?.filter(
    (item) => item?.file_id?.toString() === fileID,
  );
  useEffect(() => {
    const handleSubruleSpecific = () => {
      const getSubRulesWithCountGreaterThanZero = (rules) => {
        return rules
          ?.map((rule) => ({
            ...rule,
            sub_rules: rule?.sub_rules?.filter((subRule) => subRule?.count > 0),
          }))
          .filter((rule) => rule?.sub_rules?.length > 0);
      };

      const filteredDataWithCounts = filterDataForSpecificReport
        ?.map((item) => ({
          ...item,
          rules: getSubRulesWithCountGreaterThanZero(item?.rules),
        }))
        .filter((item) => item?.rules?.length > 0);

      filteredDataWithCounts?.map((item) =>
        item?.rules?.flatMap((rule) =>
          rule.sub_rules.filter((sub_rule) => {
            if (sub_rule.subrule_id === subruleID) {
              setSubTitle(sub_rule);
              return true;
            }
            return false;
          }),
        ),
      );
    };

    handleSubruleSpecific();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDataForSpecificReport]);

  useEffect(() => {
    const flatData = subTitle?.code_segments?.map((data) => data.split(','));
    const codeData = flatData?.flatMap((item) => JSON.parse(item));

    const codeDataItem = codeData?.map((item) => item?.lineNumber);
    setCodeSegmentData(codeData);
    dispatch({
      type: 'SET_LINENUMBER',
      payload: {
        lineNumber: codeDataItem,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subTitle]);

  return (
    <div className='specificRuleForSp'>
      <Breadcrumb
        header={'Back to rule'}
        backButtonURL={`/user-account/dashboard/specific-report-details/${applicationID}--${currentPage}--${viewStatus}--${fileID}--${cleanFilename(filename)}`}
      />
      <Subtitle> {filename}</Subtitle>

      <div className='specificRuleForSp__main-container'>
        <div className='specificRuleForSp__container'>
          <div className='specificRuleForSp__audit-record-container'>
            <div className='specificRuleForSp__container__audit-record-container'>
              <div className='specificRuleForSp__container__audit-record-container__heading'>
                <div className='specificRuleForSp__container__audit-record-container__heading-rule'>
                  <Image
                    src='/images/icons/break-arrow-blue-color.svg'
                    width={20}
                    height={20}
                    alt='arrow logo'
                  />
                  <Text
                    color='primary-700'
                    size='fs-14'
                    weight='medium'
                  >
                    {ruleName}
                  </Text>
                </div>
                <div className='specificRuleForSp__container__audit-record-container__heading-subrule'>
                  <Image
                    src='/images/icons/sp-device.svg'
                    width={24}
                    height={24}
                    alt='arrow logo'
                  />
                  {isLoadingSpecificReportDetails ? (
                    <Skeleton />
                  ) : (
                    <Text
                      color='neutral-700'
                      size='fs-18'
                      weight='bold'
                    >
                      {subTitle.description}
                    </Text>
                  )}
                </div>
                <div className='specificRuleForSp__container__audit-record-container__heading-footer'>
                  <div
                    className={`specificRuleForSp__container__audit-record-container__heading-footer__tag specificRuleForSp__container__audit-record-container__heading-footer__tag--${
                      vulnerability === Satisfactory
                        ? 'green'
                        : vulnerability === Low
                          ? 'iris-blue'
                          : vulnerability === Medium
                            ? 'orange'
                            : vulnerability === High
                              ? 'red'
                              : vulnerability === Critical
                                ? 'cornell-red'
                                : 'red'
                    }`}
                  >
                    {vulnerability === Satisfactory
                      ? 'Satisfactory'
                      : vulnerability === Low
                        ? 'Low'
                        : vulnerability === Medium
                          ? 'Medium'
                          : vulnerability === High
                            ? 'High'
                            : vulnerability === Critical
                              ? 'Critical'
                              : 'High'}{' '}
                    {vulnerability !== Satisfactory && 'vulnerabilities'}
                  </div>
                  <Button
                    type='link'
                    size='large'
                    href={`/user-account/dashboard/code-view/${applicationID}--${currentPage}--${ruleID}--${fileID}--${filename}`}
                    icon={'arrowRight'}
                    iconPosition={'after'}
                    animateIcon={true}
                  >
                    Show code
                  </Button>
                </div>
              </div>
              {!isLoadingSpecificReportDetails ? (
                <div className='specificRuleForSp__container__audit-record-container__json-format'>
                  <ul className='specificRuleForSp__container__audit-record-container__json-format__items'>
                    {codeSegmentData?.length > 0 ? (
                      <>
                        {codeSegmentData?.map((item, index) => (
                          <li
                            key={index}
                            className='specificRuleForSp__container__audit-record-container__json-format__item'
                          >
                            {`{\n\n"lineNumber": ${item?.lineNumber},\n\n"codeSegment": "${item?.codeSegment}"\n\n}`}
                          </li>
                        ))}
                      </>
                    ) : (
                      <div className='specificRuleForSp__container__audit-record-container__json-format__not-found'>
                        <NoData />
                      </div>
                    )}
                  </ul>
                </div>
              ) : (
                <Loader size={'medium'} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SpecificRuleForSp;
