'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Breadcrumb from '@/components/breadcrumb';
import Button from '@/components/button';
import CommonDialog from '@/components/dialog';
import DropDown from '@/components/drop-down';
import Heading from '@/components/heading';
import ProgressBar from '@/components/progress-bar';
import Text from '@/components/text';
import TextInput from '@/components/textInput';
import { get,post, put } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import { platformsDropdownData } from '@/utils/constant-data';
import { isValidGitHubRepoUrl } from '@/utils/helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import './index.scss';


const typeData = ['Public', 'Private'];

const GithubUrlUpload = () => {
  const queryClient = useQueryClient();
  const route = useRouter();
  const [isAllFilled, setAllFilled] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [typeValue, setTypeValue] = useState('Public');
  const [githubURL, setGithubURL] = useState(null);
  const [accessKey, setAccessKey] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [reportProgress, setReportProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(''); // 'extracting' or 'generating'
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('Processing');
  const [errorMessage, setErrorMessage] = useState('');
  const validateURL = isValidGitHubRepoUrl(githubURL);
  useEffect(() => {
    if (selectedPlatform && typeValue === 'Private' && validateURL && accessKey) setAllFilled(true);
    else if (selectedPlatform && typeValue === 'Public' && validateURL) setAllFilled(true);
    else setAllFilled(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlatform, typeValue === 'Public', typeValue === 'Private', validateURL, accessKey]);

  const paths = [
    { name: 'Scanner', url: '/user-account/scan' },
    { name: 'New Scan', url: '/user-account/scan' },
  ];

  const pollExtractionProgress = async (uploadId, maxDuration = 300000) => {
    const startTime = Date.now();

    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        if (Date.now() - startTime > maxDuration) {
          clearInterval(interval);
          setCurrentStage('timeout');
          setUploadStage('Timeout reached.');
          resolve();
          return;
        }

        try {
          const res = await get(`user_uploads/${uploadId}/show_progress`, true);

          const data = res?.data;
          const { status, extraction_progress = 0, report_generation_progress = 0 } = data.progress;

          let computedProgress = 0
          let stageText = '';

          switch (status) {
            case 0:
            case 'pending':
              computedProgress = 0;
              stageText = 'Pending...';
              break;
            case 1:
            case 'uploading':
              computedProgress = 100;
              stageText = 'Connecting to GitHub...';
              break;
            case 2:
            case 'extracting':
              computedProgress = Math.floor(extraction_progress);
              stageText = 'Extracting...';
              break;
            case 3:
            computedProgress = 100;
              stageText = 'Extraction completed 100%.';
              break;
            case 4:
            case 'report_generating':
              computedProgress = Math.floor(report_generation_progress);
              stageText = 'Generating report...';
              break;
            case 5:
            case 'report_generated':
              computedProgress = 100;
              stageText = 'Report generated!';
              clearInterval(interval);
              resolve();
              break;
            case 6:
            case 'failed':
              computedProgress = 0;
              stageText = 'Failed.';
              clearInterval(interval);
              break;
            default:
              computedProgress = 0;
              stageText = 'Unknown status';
          }

          setUploadProgress(Math.floor(computedProgress));
          setUploadStage(stageText);

          if (status === 'report_generated' || status === 5) {
            clearInterval(interval);
            resolve();
          }
        } catch (err) {
          clearInterval(interval);
          resolve();
        }
      }, 1000); // poll every second
    });
  };



  const mutation = useMutation({
    mutationFn: async (formData) => {
      setUploadProgress(0);
      setUploadStage('Connecting to GitHub...');
      setDialogTitle('Processing');
      setIsDialogOpen(true);

      try {
        const responseForm = await post(API_ENDPOINTS.GITHUB_URL, formData, true, true);
        const formDataResponse = responseForm?.data;

        await put(
          `${API_ENDPOINTS.USER_UPLOADS}/${formDataResponse?.id}/extract`,
          {},
          true,
        );

        // Now poll show_progress until report is generated
        await pollExtractionProgress(formDataResponse?.id);
        await queryClient.invalidateQueries(['dashboard']);

        // Done
        setTimeout(() => setIsDialogOpen(false), 1500);

        route.push('/user-account/dashboard');
        // route.refresh();
      } catch (error) {
        throw error;
      }
    },

    onMutate: () => {
      setIsLoading(true);
      setUploadStage('Connecting to GitHub...');
      setUploadProgress(0);
      setErrorMessage('');
    },
    onError: (error) => {
      setIsLoading(false);
      setUploadProgress(0);
      setDialogTitle('Error');

      if (error.response?.status === 422) {
        const errorMsg = error.response?.data?.errors?.[0] || 'Validation error';
        setErrorMessage(errorMsg);
        setUploadStage(errorMsg);
      } else if (error.response?.status === 500) {
        setUploadStage('Internal Server Error');
      } else {
        setUploadStage(error.message || 'Something went wrong');
      }

      setTimeout(() => setIsDialogOpen(false), 3000);
    },
    onSuccess: () => {
      setIsLoading(false);
    },
  });

  const handleOnSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('github_upload[platform]', selectedPlatform);
    formData.append('github_upload[repo_type]', typeValue.toLowerCase());
    formData.append('github_upload[github_url]', githubURL);
    accessKey &&
      typeValue === 'Private' &&
      formData.append('github_upload[access_token]', accessKey);
    mutation.mutate(formData);
  };

  return (
    <div className='github-url-upload'>
      <Breadcrumb
        header={'New Scan'}
        paths={paths}
        backButtonURL={'/user-account/scan'}
      />

      <CommonDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={dialogTitle}
      >
        <div className='flex flex-col gap-4 w-full'>
          <Text
            size='fs-16'
            color='primary-850'
            weight='medium'
          >
            {uploadStage}
          </Text>
          <div className='w-full'>
            <ProgressBar


              percentage={uploadProgress}
          
              color="primary"
            />
          </div>
          {errorMessage && (
            <Text
              size='fs-14'
              color='radical-red'
              weight='medium'
            >
              {errorMessage}
            </Text>
          )}
        </div>
      </CommonDialog>

      <div className='github-url-upload__body'>
        <div className='github-url-upload__header'>
          <Heading
            type='h6'
            title={'Github URL upload'}
            color='neutral-700'
          />
        </div>
        <form className='github-url-upload__content'>
          <div className='github-url-upload__fieldWrapper'>
            <Text
              size='fs-14'
              color='neutral-600'
              weight='semi-bold'
            >
              Type
            </Text>
            <DropDown
              data={typeData}
              value='Public'
              setValue={(val) => setTypeValue(val)}
            />
          </div>
          {typeValue === 'Private' && (
            <div className='github-url-upload__fieldWrapper'>
              <Text
                size='fs-14'
                color='neutral-600'
                weight='semi-bold'
              >
                Access key
              </Text>

              <textarea
                className='github-url-upload__textArea'
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder={'Enter the access key'}
              />
            </div>
          )}
          <div className='github-url-upload__fieldWrapper'>
            <Text
              size='fs-14'
              color='neutral-600'
              weight='semi-bold'
            >
              Github URL
            </Text>
            <TextInput
              value={githubURL}
              setValue={(val) => setGithubURL(val)}
              placeholder={'Ex.: www.github.com/demogithub'}
              errorMessage={
                githubURL && !isValidGitHubRepoUrl(githubURL) && 'Please enter a valid GitHub URL'
              }
            />
          </div>

          <div className='github-url-upload__fieldWrapper'>
            <Text
              size='fs-14'
              color='neutral-600'
              weight='semi-bold'
            >
              Platform
            </Text>
            <div className='github-url-upload__platformWrapper'>
              {platformsDropdownData?.map((item) => (
                <div
                  key={item.id}
                  className={`github-url-upload__platform ${selectedPlatform === item.value ? 'github-url-upload__platform-selected' : ''}`}
                  onClick={() => setSelectedPlatform(item.value)}
                >
                  <div className={`github-url-upload__platform__iconWrapper`}>
                    <Image
                      className={`github-url-upload__platform__icon github-url-upload__platform__icon-${item.icon}`}
                      src={`/images/icons/${item.icon}.svg`}
                      alt={item.title}
                      width={item.width}
                      height={item.height}
                    />
                  </div>
                  <Text
                    size='fs-12'
                    color='neutral-700'
                    weight='semi-bold'
                  >
                    {item.title}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </form>
        <div className='github-url-upload__button'>
          <Button
            type='primary'
            size='large'
            icon={'scan'}
            iconPosition={'after'}
            isDisabled={!isAllFilled || isLoading}
            onClick={handleOnSubmit}
          >
            Extract & Scan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GithubUrlUpload;
