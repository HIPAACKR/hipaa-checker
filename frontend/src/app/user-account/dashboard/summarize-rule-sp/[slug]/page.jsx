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
import { vulnerabilityStatus } from '@/utils/constant-data';
import { cleanRuleName, decodeString } from '@/utils/helper';
import { useQuery } from '@tanstack/react-query';

import './index.scss';

const SummarizeRuleForSp = ({ params }) => {
  const { slug } = params;
  const { High, Low, Medium, Satisfactory } = vulnerabilityStatus;
  const { state, dispatch } = useSelectedOption();
  const pathSegments = slug.split('--');
  const applicationID = pathSegments[0];
  const currentPage = pathSegments[1];
  const vulnerability = pathSegments[2];
  const fileID = pathSegments[3];
  const subRuleIndex = pathSegments[4];
  const filename = pathSegments[5];
  const ruleID = pathSegments[6];
  const ruleName = decodeString(pathSegments[7]);
  const [subRuleName, setSubRuleName] = useState();
  const [subTitle, setSubTitle] = useState('');
  const [codeSegmentData, setCodeSegmentData] = useState();
  const {
    data: summarizeReportDetailsData,
    isLoading: isLoadingSummarizeReportDetails,
    isError: isErrorSummarizeReportDetails,
    isSuccess: isSuccessSummarizeReportDetails,
  } = useQuery({
    queryKey: ['summarizeReportDetails', currentPage],
    queryFn: async () => {
      const response = await get(
        `${API_ENDPOINTS.USER_UPLOADS}/${applicationID}/rule_wise?page=${currentPage}`,
        true,
      );
      return response?.data?.user_upload;
    },
  });

  const filterDataForSpecificReport = summarizeReportDetailsData?.analyzed_results?.filter(
    (item) => item.rule_id === ruleID,
  );
  useEffect(() => {
    const totalSubRules = filterDataForSpecificReport?.map((item) =>
      item?.sub_rules?.filter(
        (sub_rule) =>
          sub_rule?.count > 0 &&
          (vulnerability === 'High'
            ? sub_rule?.severity === 3
            : vulnerability === 'Medium'
              ? sub_rule?.severity === 2
              : vulnerability === 'Low'
                ? sub_rule?.severity === 1
                : vulnerability === 'Satisfactory'
                  ? sub_rule?.severity === 0
                  : sub_rule?.severity === 3),
      ),
    );
    if (totalSubRules && totalSubRules[0]) {
      totalSubRules[0]?.some((sub, index) => {
        if (index == subRuleIndex) {
          setSubRuleName(sub.description);
          sub?.files?.some((file) => {
            if (file.file_id == fileID) {
              setSubTitle(file);
              return true;
            }
          });
          return true;
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDataForSpecificReport]);

  useEffect(() => {
    const flatData = subTitle?.matched_data?.flatMap((data) =>
      data?.map((code) => code?.split(',')),
    );
    const codeData = flatData?.flatMap((item) => JSON.parse(item));

    const codeDataItem = codeData?.map((line) => line?.lineNumber);

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
    <div className='summarizeRuleForSp'>
      <Breadcrumb
        header={'Back to rule'}
        backButtonURL={`/user-account/dashboard/summarize-report-details/${applicationID}--${currentPage}--${ruleID}--${cleanRuleName(ruleName)}`}
      />
      <Subtitle> {filename}</Subtitle>

      <div className='summarizeRuleForSp__main-container'>
        <div className='summarizeRuleForSp__container'>
          <div className='summarizeRuleForSp__audit-record-container'>
            <div className='summarizeRuleForSp__container__audit-record-container'>
              <div className='summarizeRuleForSp__container__audit-record-container__heading'>
                <div className='summarizeRuleForSp__container__audit-record-container__heading-rule'>
                  <Image
                    src='/images/icons/break-arrow-blue-color.svg'
                    width={20}
                    height={20}
                    alt='arrow logo'
                  />
                  {isLoadingSummarizeReportDetails ? (
                    <Skeleton />
                  ) : (
                    <Text
                      color='primary-700'
                      size='fs-14'
                      weight='medium'
                    >
                      {subRuleName}
                    </Text>
                  )}
                </div>
                <div className='summarizeRuleForSp__container__audit-record-container__heading-subrule'>
                  <Image
                    src='/images/icons/sp-device.svg'
                    width={24}
                    height={24}
                    alt='arrow logo'
                  />
                  <Text
                    color='neutral-700'
                    size='fs-18'
                    weight='bold'
                  >
                    {filename}
                  </Text>
                </div>
                <div className='summarizeRuleForSp__container__audit-record-container__heading-footer'>
                  <div
                    className={`summarizeRuleForSp__container__audit-record-container__heading-footer__tag summarizeRuleForSp__container__audit-record-container__heading-footer__tag--${
                      vulnerability === Satisfactory
                        ? 'green'
                        : vulnerability === Low
                          ? 'iris-blue'
                          : vulnerability === Medium
                            ? 'orange'
                            : vulnerability === High
                              ? 'red'
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
                            : 'High'}{' '}
                    {vulnerability !== 'Satisfactory' && 'vulnerabilities'}
                  </div>
                  <Button
                    type='link'
                    size='large'
                    href={`/user-account/dashboard/summarize-code-view/${applicationID}--${currentPage}--${ruleID}--${ruleName}--${subTitle && subTitle?.file_id && subTitle?.file_id}--${subTitle && subTitle?.file_name && subTitle?.file_name}`}
                    icon={'arrowRight'}
                    iconPosition={'after'}
                    animateIcon={true}
                  >
                    Show code
                  </Button>
                </div>
              </div>
              {!isLoadingSummarizeReportDetails ? (
                <div className='summarizeRuleForSp__container__audit-record-container__json-format'>
                  <ul className='summarizeRuleForSp__container__audit-record-container__json-format__items'>
                    {codeSegmentData?.length > 0 ? (
                      <>
                        {codeSegmentData?.map((item, index) => (
                          <li
                            key={index}
                            className='summarizeRuleForSp__container__audit-record-container__json-format__item'
                          >
                            {`{\n\n"lineNumber": ${item?.lineNumber},\n\n"codeSegment": "${item?.codeSegment}"\n\n}`}
                          </li>
                        ))}
                      </>
                    ) : (
                      <div className='summarizeRuleForSp__container__audit-record-container__json-format__not-found'>
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
export default SummarizeRuleForSp;
