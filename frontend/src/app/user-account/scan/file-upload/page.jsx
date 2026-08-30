'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import Breadcrumb from '@/components/breadcrumb';
import Button from '@/components/button';
import CommonDialog from '@/components/dialog';
import DropDown from '@/components/drop-down';
import FileInput from '@/components/file-input';
import Heading from '@/components/heading';
import ProgressBar from '@/components/progress-bar';
import Text from '@/components/text';
import { get, post, put } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import { platformsDropdownData } from '@/utils/constant-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import './index.scss';

const typeData = ['Healthcare', 'Non-Healthcare'];

const FileUpload = () => {
  const route = useRouter();
  const queryClient = useQueryClient();

  const [isAllFilled, setAllFilled] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(platformsDropdownData[0]); // android
  const [environment, setEnvironment] = useState('app');
  const [file, setFile] = useState(null);
  const [typeValue, setTypeValue] = useState('Healthcare');
  const [progress, setProgress] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('Processing');
  const [errorMessage, setErrorMessage] = useState('');
  const [canCloseDialog, setCanCloseDialog] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!file) return;
    const interval = setInterval(() => {
      if (progress < 100) {
        setProgress((prevProgress) => prevProgress + 1);
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [progress, file]);

  useEffect(() => {
    if (!file) setProgress(null);
    else setProgress(0);
  }, [file]);

  useEffect(() => {
    if (selectedPlatform && typeValue && file && progress === 100) setAllFilled(true);
    else setAllFilled(false);
  }, [selectedPlatform, typeValue, file, progress]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);

    const handleOffline = () => {
      setIsOnline(false);
      // Cancel ongoing upload if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        toast.error('Upload cancelled: Internet connection lost');
        setIsDialogOpen(false);
        setIsLoading(false);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const paths = [
    { name: 'Scanner', url: '/user-account/scan' },
    { name: 'New Scan', url: '/user-account/scan' },
  ];

  const uploadWithProgress = (formData) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setFileUploadProgress(percentComplete);
          setUploadStage('Uploading...');
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setFileUploadProgress(100);
          setUploadStage('File uploaded successfully');
          resolve(xhr.response);
        } else if (xhr.status === 422) {
          const errorData = xhr.response;
          const errorMsg = errorData?.errors?.[0] || 'Validation error';
          setErrorMessage(errorMsg);
          reject(new Error(errorMsg));
        } else if (xhr.status === 500) {
          reject(new Error('Internal Server Error'));
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      // Get auth token
      const localData = JSON.parse(localStorage.getItem('user'));
      const jwt_token = localData?.jwt_token;

      // Set up the request
      xhr.open('POST', `${process.env.NEXT_PUBLIC_API_BASE_URL}/${API_ENDPOINTS.USER_UPLOADS}`);
      xhr.setRequestHeader('Authorization', `Bearer ${jwt_token}`);
      xhr.responseType = 'json';

      // Send the form data
      xhr.send(formData);
    });
  };

  // Helper function to poll progress during extraction
  const pollProgress = async (uploadId, maxDuration = 300000) => {
    const startTime = Date.now();

    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        if (Date.now() - startTime > maxDuration) {
          clearInterval(interval);
          resolve();
          return;
        }

        try {
          const res = await get(`user_uploads/${uploadId}/show_progress`, true);
          const data = await res?.data;
          const { status, extraction_progress = 0, report_generation_progress = 0 } = data.progress;

          let computedProgress = 0;
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
              stageText = 'Uploading...';
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
          throw err;
        }
      }, 1000); // poll every second
    });
  };

  const mutation = useMutation({
    mutationFn: async (formData) => {
      setCanCloseDialog(false);
      setUploadProgress(0);
      setFileUploadProgress(0);
      setUploadStage('Uploading...');
      setDialogTitle('Processing');
      setIsDialogOpen(true);

      abortControllerRef.current = new AbortController();

      try {
        const uploadResponse = await post(
        API_ENDPOINTS.USER_UPLOADS,
        formData,
        true,
        true, // multiform
        1,
        (progressEvent) => {
          const percentComplete = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setFileUploadProgress(percentComplete);
          setUploadStage('Uploading...');
        },
        abortControllerRef.current.signal,
      );

      abortControllerRef.current = null;
      setFileUploadProgress(100);
      setUploadStage('File uploaded successfully');

      const uploadData = uploadResponse.data;

      // Trigger extraction
      await put(`${API_ENDPOINTS.USER_UPLOADS}/${uploadData?.id}/extract`, {}, true);

      // Now poll show_progress until report is generated
      await pollProgress(uploadData?.id);
      await queryClient.invalidateQueries(['dashboard']);

      // Done
      setTimeout(() => setIsDialogOpen(false), 1500);

      // You can route the user if needed
      route.push('/user-account/dashboard');
      route.refresh();
      } catch (error) {
        throw error;
      }
    },

    onMutate: () => {
      setIsLoading(true);
      setUploadStage('Uploading...');
      setUploadProgress(0);
      setErrorMessage('');
    },
    onError: (error) => {
      abortControllerRef.current = null;
      setIsLoading(false);
      setUploadProgress(0);
      setDialogTitle('Error');

      if (error.code === 'ERR_CANCELED' || error.message === 'canceled') {
        setUploadStage('Upload cancelled: Connection lost');
        setErrorMessage('Upload cancelled due to network disconnection');
      } else if (error.response?.status === 422) {
        const errorMsg = error.response?.data?.errors?.[0] || 'Validation error';
        setErrorMessage(errorMsg);
        setUploadStage(errorMsg);
      } else if (error.response?.status === 500) {
        setUploadStage('Internal Server Error');
      } else {
        setUploadStage(error.message || 'Something went wrong');
      }

      setCanCloseDialog(true);
      setTimeout(() => setIsDialogOpen(false), 3000);
    },
    onSuccess: () => {
      abortControllerRef.current = null;
      setIsLoading(false);
      setCanCloseDialog(true);
    },
  });

  const handleOnSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('user_upload[platform]', selectedPlatform?.value || '');
    formData.append('user_upload[upload_type]', typeValue);
    formData.append('user_upload[environment]', environment);
    formData.append('user_upload[file]', file);
    mutation.mutate(formData);
  };

  useEffect(() => {
    if (
      selectedPlatform?.value?.toString()?.toLowerCase() === 'ios' ||
      selectedPlatform?.value?.toString()?.toLowerCase() === 'apk'
    ) {
      setEnvironment('app');
    } else {
      setEnvironment('web application');
    }
  }, [selectedPlatform]);

  return (
    <div className='file-upload'>
      <Breadcrumb
        header={'New Scan'}
        paths={paths}
        backButtonURL={'/user-account/scan'}
      />

      <CommonDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={dialogTitle}
        disableClose={!canCloseDialog}
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
              percentage={uploadStage === 'Uploading...' ? fileUploadProgress : uploadProgress}
              color='primary'
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

      <div className='file-upload__body'>
        <div className='file-upload__header'>
          <Heading
            type='h6'
            title={'File Upload'}
            color='neutral-700'
          />
        </div>
        <form className='file-upload__content'>
          <div className='file-upload__wrapper'>
            <Text
              size='fs-14'
              color='neutral-600'
              weight='semi-bold'
            >
              Platform
            </Text>
            <div className='file-upload__platformWrapper'>
              {platformsDropdownData?.map((item) => (
                <div
                  key={item.id}
                  className={`file-upload__platform ${selectedPlatform?.value === item.value ? 'file-upload__platform-selected' : ''}`}
                  onClick={() => setSelectedPlatform(item)}
                >
                  <div className={`file-upload__platform__iconWrapper`}>
                    <Image
                      className={`file-upload__platform__icon file-upload__platform__icon-${item.icon}`}
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
          <div className='file-upload__wrapper'>
            <Text
              size='fs-14'
              color='neutral-600'
              weight='semi-bold'
            >
              Type
            </Text>
            <DropDown
              data={typeData}
              value={'Healthcare'}
              setValue={(val) => {
                setTypeValue(val);
              }}
            />
          </div>
          <div className='file-upload__wrapper'>
            <Text
              size='fs-14'
              color='neutral-600'
              weight='semi-bold'
            >
              File upload
            </Text>
            <div className='file-upload__fileWrapper'>
              <FileInput
                setValue={setFile}
                setClear={!file ? true : false}
              />
              {file && (
                <div className='file-upload__uploadingWrapper'>
                  <Text
                    size='fs-14'
                    color='primary-850'
                    weight='medium'
                  >
                    Uploaded file
                  </Text>
                  <div className='file-upload__selectedFileWrapper'>
                    <div className='file-upload__selectedFile'>
                      <Image
                        onClick={() => setFile(null)}
                        className='file-upload__android-icon'
                        src={`/images/icons/${selectedPlatform?.icon || ''}.svg`}
                        alt='platform-icon'
                        width={36}
                        height={36}
                      />
                      <div>
                        <Text
                          size='fs-14'
                          color='neutral-600'
                          weight='medium'
                        >
                          {file.name}
                        </Text>
                        <Text
                          size='fs-12'
                          color='neutral-400'
                          weight='medium'
                        >
                          {(file.size / (1024 * 1024)).toFixed(2)}MB
                        </Text>
                      </div>
                    </div>
                    <Image
                      onClick={() => setFile(null)}
                      className='file-upload__delete-icon'
                      src={'/images/icons/delete.svg'}
                      alt='delete-icon'
                      width={36}
                      height={36}
                    />
                  </div>
                  {/* <div className='file-upload__progressWrapper'>
                    <div className='file-upload__progress'>
                      <div
                        className='file-upload__progress-increment'
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                    <Text
                      size='fs-14'
                      color='neutral-600'
                      weight='medium'
                    >
                      {progress}%
                    </Text>
                  </div> */}
                </div>
              )}
            </div>
          </div>

          <div className='file-upload__button'>
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
        </form>
      </div>
    </div>
  );
};

export default FileUpload;
