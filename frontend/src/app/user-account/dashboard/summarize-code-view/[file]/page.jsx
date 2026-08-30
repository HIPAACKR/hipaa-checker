'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Loader from '@/components/loader';
import NoData from '@/components/no-data';
import Text from '@/components/text';
import { useSelectedOption } from '@/context/selectOptionContext';
import { get } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import useIsSpDevice from '@/utils/useSpDevice';
import { useQuery } from '@tanstack/react-query';

import './index.scss';

const CodeView = ({ params }) => {
  const { file } = params;
  const { state, dispatch } = useSelectedOption();
  const applicationID = file?.split('--')[0];
  const fileId = file?.split('--')[4];
  const fileName = file?.split('--')[5];
  const router = useRouter();
  const isSpDevice = useIsSpDevice();

  const {
    data: reportCodeViewData,
    isLoading: isLoadingCodeView,
    isError: isErrorCodeView,
    isSuccess: isSuccessCodeView,
  } = useQuery({
    queryKey: ['codeView', applicationID, fileId],
    queryFn: async () => {
      const response = await get(
        `${API_ENDPOINTS.USER_UPLOADS}/${applicationID}/file_content?file_id=${fileId}`,
        true,
      );
      return response?.data;
    },
  });

  const handlePageRedirect = () => {
    router.back();
  };
  const handleSpRedirect = () => {
    router.back();
  };
  const codeData = reportCodeViewData?.codebase?.split('\n');
  return (
    <div className='summarizeCodeView'>
      <div className='summarizeCodeView__header'>
        <div className='summarizeCodeView__header__content'>
          <div className='summarizeCodeView__header__content__hamburger'>
            <div
              className='codeView__header__content__hamburger__item'
              onClick={() => router.push('/user-account/dashboard')}
            >
              <Text
                color='neutral-400'
                size='fs-12'
                weight='medium'
              >
                Dashboard
              </Text>
            </div>
            <Text
              color='neutral-400'
              size='fs-12'
              weight='medium'
            >
              /
            </Text>
            <div
              className='summarizeCodeView__header__content__hamburger__item'
              onClick={() =>
                router.push(`/user-account/dashboard/report-list/analysis-report/${applicationID}`)
              }
            >
              <Text
                color='neutral-400'
                size='fs-12'
                weight='medium'
              >
                Analysis Report
              </Text>
            </div>
            <Text
              color='neutral-400'
              size='fs-12'
              weight='medium'
            >
              /
            </Text>
            <div
              className='summarizeCodeView__header__content__hamburger__item'
              onClick={() => router.back()}
            >
              <Text
                color='neutral-400'
                size='fs-12'
                weight='medium'
              >
                Summarize Report
              </Text>
            </div>
            <Text
              color='neutral-400'
              size='fs-12'
              weight='medium'
            >
              /
            </Text>
            <Text
              color='neutral-600'
              size='fs-12'
              weight='medium'
            >
              Code
            </Text>
          </div>
          <div className='summarizeCodeView__header__content__button'>
            <Image
              className='summarizeCodeView__header__content__back-button'
              src='/images/icons/circle-left-arrow.svg'
              width={32}
              height={32}
              alt='arrow logo'
              onClick={isSpDevice ? handleSpRedirect : handlePageRedirect}
            />
            <Text
              color='neutral-800'
              size='fs-18'
              weight='semi-bold'
            >
              Back
            </Text>
          </div>
        </div>
      </div>
      <div className='summarizeCodeView__main-container'>
        <div className='summarizeCodeView__main-container__title'>
          <Text
            color='neutral-800'
            size='fs-16'
            weight='semi-bold'
          >
            {fileName && fileName}
          </Text>
        </div>

        <div>
          {isErrorCodeView ? (
            <NoData title={'Sorry ! There is an error from server, while loading this file '} />
          ) : (
            <>
              {isLoadingCodeView ? (
                <div className='summarizeDetails__loader'>
                  <Loader size='large' />
                </div>
              ) : (
                <pre>
                  <ul className='summarizeCodeView__main-container__items'>
                    {reportCodeViewData?.errors && reportCodeViewData?.errors[0] ? (
                      <NoData title={reportCodeViewData && reportCodeViewData?.errors[0]} />
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
                            }}
                          >
                            <span style={{ minWidth: '35px', textAlign: 'right' }}>
                              {index + 1}
                            </span>{' '}
                            <span>{code}</span>
                          </span>
                        </li>
                      ))
                    )}
                  </ul>
                </pre>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default CodeView;
