'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';

import Subtitle from '@/components/subtitle';
import Text from '@/components/text';
import { remove } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Button from '../button';
import Heading from '../heading';
import Icon from '../icon';
import Loader from '../loader';
import NoData from '../no-data';
import Pagination from '../pagination';
import Tooltip from '../tooltip';

import './index.scss';

const ReportList = ({ reportLIst, loading, errorMessage, route, currentPageNumber, setCurrentPageNumber, pagination, userData }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  // const [hipaaScore, setHipaaScore] = useState(0);

  const paths = [
    { name: 'Dashboard', url: '/user-account/dashboard' },
    { name: 'Report List', url: '/user-account/dashboard' },
  ];

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await remove(`${API_ENDPOINTS.USER_UPLOADS}/${id}`, true, 1);

      // queryClient.invalidateQueries(['dashboard']);
      queryClient.setQueryData(['dashboard'], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          user_uploads: oldData.user_uploads.filter(app => app.id !== id),
          user_uploads_count: oldData.user_uploads_count - 1,
        }
      })
      // queryClient.invalidateQueries(['reportDetails']);
      // queryClient.invalidateQueries(['specificReportDetails']);
      // queryClient.invalidateQueries(['summarizeReportDetails']);
      // queryClient.invalidateQueries(['specificReportDetailsAnalysis']);
      // queryClient.invalidateQueries(['codeView']);
      toast.success('Application deleted successfully');

      return response.data;
    },
    onError: (error) => {
      if (error.response?.status === 500) {
        toast.error('Internal Server Error');
      } else {
        toast.error('Failed to delete');
      }
    },
  });

  const handleDeleteFile = (id) => {
    deleteMutation.mutate(id);
  };

  // const hipaaScore = (
  //   (report?.hipaa_risk_scores?.cvss_risk_remaining / report?.hipaa_risk_scores?.total_risk_score) *
  //   100
  // ).toFixed(1);

  const getRiskLevel = (score) => {
    if (score >= 0 && score <= 20) return 'Low';
    if (score > 20 && score <= 45) return 'Medium';
    if (score > 45 && score <= 80) return 'High';
    return 'Critical';
  };

  function formatStatus(status) {
    if (!status) return 'Not Available';
    return status
      .replace(/_/g, ' ')               // replace underscores with spaces
      .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize each word
  }

  function getStatusColor(status) {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'uploading': return 'text-sky-600';
      case 'extracting': return 'text-blue-800';
      case 'extracted': return 'text-indigo-600';
      case 'report_generating': return 'text-teal-600';
      case 'report_generated': return 'text-green-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-500';
    }
  }
  return (
    <div className='report-list'>
      <div className='report-list__body'>
        <Subtitle>Application list</Subtitle>
        <div className='report-list__tableWrapper'>
          <table>
            <thead>
            <tr>
              <th>Application name</th>
              <th>HIPAA Risk Score</th>
              <th>Risk Level</th>
              <th>Status</th>
              <th>Report</th>
              <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {loading ? (
              <tr>
                <th
                  className='report-list__loader'
                  colSpan={6}
                >
                  <Loader size='medium' />
                </th>
              </tr>
            ) : errorMessage ? (
              <tr>
                <th
                  className='report-list__loader'
                  colSpan={6}
                >
                  <NoData title={errorMessage && errorMessage} />
                </th>
              </tr>
            ) : (
              <>
                {reportLIst?.length > 0 ? (
                  <>
                    {reportLIst?.map((report) => (
                      <tr key={report.id}>
                        <td>
                          <div>
                            <Image
                              src={`/images/icons/${
                                report?.platform === 'apk'
                                  ? 'android.svg'
                                  : report?.platform === 'django'
                                    ? 'python.svg'
                                    : report?.platform === 'laravel'
                                      ? 'laravel.svg'
                                      : report?.platform === 'ios'
                                        ? 'ios.svg'
                                        : report?.platform === 'express'
                                          ? 'express.svg'
                                          : report?.platform === 'spring'
                                            ? 'spring.svg'
                                            : report?.platform === 'dotnet'
                                              ? 'dotnet.svg'
                                              : 'rails.svg'
                              }`}
                              alt='icon'
                              width={32}
                              height={32}
                            />

                            <Tooltip
                              position='top'
                              TooltipText={report?.name}
                              type='div'
                            >
                              <Text
                                size='fs-14'
                                color='neutral-900'
                                weight='medium'
                              >
                                {report?.name}
                              </Text>
                            </Tooltip>
                          </div>
                        </td>
                        <td>
                          {report?.status !== 'report_generated' ?  (
                            <Text
                              size='fs-14'
                              color='black'
                              weight='bold'
                              align='center'
                            >
                              ---
                            </Text>
                          ) : userData?.plan && userData?.plan?.get_hipaa_score ? (
                            <Text
                              size='fs-14'
                              color='neutral-700'
                              align='center'
                            >
                              {(
                                (report?.hipaa_risk_scores?.cvss_risk_remaining /
                                  report?.hipaa_risk_scores?.total_risk_score) *
                                100
                              ).toFixed(1)}{' '}
                              / 100
                            </Text>
                          ) : (
                            <div className='relative w-full h-full'>
                              <Text
                                size='fs-14'
                                color='neutral-700'
                                align='center'
                              >
                                50.0%
                              </Text>
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
                        <td
                          className={` text-center report-list--${report?.status === 'failed'? 'failed': (

                            (report?.hipaa_risk_scores?.cvss_risk_remaining /
                              report?.hipaa_risk_scores?.total_risk_score) *
                            100
                          ).toFixed(1) <= 20 &&
                          (
                            (report?.hipaa_risk_scores?.cvss_risk_remaining /
                              report?.hipaa_risk_scores?.total_risk_score) *
                            100
                          ).toFixed(1) >= 0
                            ? 'Low'
                            : (
                              (report?.hipaa_risk_scores?.cvss_risk_remaining /
                                report?.hipaa_risk_scores?.total_risk_score) *
                              100
                            ).toFixed(1) >= 20 &&
                            (
                              (report?.hipaa_risk_scores?.cvss_risk_remaining /
                                report?.hipaa_risk_scores?.total_risk_score) *
                              100
                            ).toFixed(1) <= 45
                              ? 'Medium'
                              : (
                                (report?.hipaa_risk_scores?.cvss_risk_remaining /
                                  report?.hipaa_risk_scores?.total_risk_score) *
                                100
                              ).toFixed(1) >= 45 &&
                              (
                                (report?.hipaa_risk_scores?.cvss_risk_remaining /
                                  report?.hipaa_risk_scores?.total_risk_score) *
                                100
                              ).toFixed(1) <= 80
                                ? 'High'
                                : 'Critical'
                          }`}
                        >
                          {report?.status !== 'report_generated' ?  (
                            <Text
                              size='fs-14'
                              color='black'
                              weight='bold'


                            >
                              ---
                            </Text>
                          ) : (

                            <Text
                              size='fs-14'
                              color='neutral-700'

                            >
                              {getRiskLevel(
                                (report?.hipaa_risk_scores?.cvss_risk_remaining /
                                  report?.hipaa_risk_scores?.total_risk_score) *100
                              )}
                            </Text>
                          )}
                        </td>
                        {/* {(
                                (report?.hipaa_risk_scores?.cvss_risk_remaining /
                                  report?.hipaa_risk_scores?.total_risk_score) *
                                100
                              ).toFixed(1) <= 20 && */}
                        {/* (
                                (report?.hipaa_risk_scores?.cvss_risk_remaining /
                                  report?.hipaa_risk_scores?.total_risk_score) *
                                100
                              ).toFixed(1) >= 0
                                ? 'Low'
                                : (
                                      (report?.hipaa_risk_scores?.cvss_risk_remaining /
                                        report?.hipaa_risk_scores?.total_risk_score) *
                                      100
                                    ).toFixed(1) >= 20 &&
                                    (
                                      (report?.hipaa_risk_scores?.cvss_risk_remaining /
                                        report?.hipaa_risk_scores?.total_risk_score) *
                                      100
                                    ).toFixed(1) <= 45
                                  ? 'Medium'
                                  : (
                                        (report?.hipaa_risk_scores?.cvss_risk_remaining /
                                          report?.hipaa_risk_scores?.total_risk_score) *
                                        100
                                      ).toFixed(1) >= 45 &&
                                      (
                                        (report?.hipaa_risk_scores?.cvss_risk_remaining /
                                          report?.hipaa_risk_scores?.total_risk_score) *
                                        100
                                      ).toFixed(1) <= 80
                                    ? 'High'
                                    : 'Critical'}
                            </Text> */}

                        {/* </td> */}
                        <td className={`px-4 py-2 text-sm font-semibold text-center ${getStatusColor(report?.status)}`}>
                          {formatStatus(report?.status)}
                        </td>

                        <td>
                          {report?.status === 'report_generated' ?  (
                            <Link
                              href={`/user-account/dashboard/report-list/analysis-report/${report?.id}`}
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
                          ):(
                            <Text
                              size='fs-14'
                              color='radical-red'
                              weight='bold'
                              align='center'
                            >
                              Not Available
                            </Text>
                          )}
                        </td>

                        <td>
                          <Image
                            onClick={() => {
                              setModalOpen(true);
                              setDeleteItem(report);
                            }}
                            className='report-list--delete-icon'
                            src={'/images/icons/delete.svg'}
                            alt='delete-icon'
                            width={24}
                            height={24}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <th
                      className='report-list__loader'
                      colSpan={6}
                    >
                      <NoData />
                    </th>
                  </tr>
                )}
              </>
            )}
            </tbody>
          </table>
          {pagination?.total_entries > 0 && (
            <Pagination
              totalEntries={pagination?.total_entries || 0}
              totalPages={pagination?.total_pages || 1}
              itemsPerPage={pagination?.per_page || reportLIst?.length || 5}
              setCurrentPageNumber={(val) => {
                setCurrentPageNumber(val);
              }}
            />
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className='report-list__modal'>
          <div className='report-list__modal__content'>
            <div className='report-list__modal__titleWrapper'>
              <Heading
                title={'Delete application?'}
                type='h6'
              />
              <Image
                onClick={() => setModalOpen(false)}
                className='report-list__modal__cross'
                src={'/images/icons/cross.svg'}
                alt='cross-icon'
                width={24}
                height={24}
              />
            </div>

            <div className='report-list__modal__body'>
              <Image
                src={'/images/icons/delete-red.svg'}
                alt='delete-icon'
                width={56}
                height={56}

              />
              <Text
                size='fs-16'
                color='neutral-500'
                align='center'
              >
                This will delete permanently <b>“{deleteItem?.name}”</b> application form your list.
                You can’t undo this action.
              </Text>
            </div>
            <div className='report-list__modal__buttonWrapper'>
              <Button
                isFullWidth
                type='secondary'
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                isFullWidth
                onClick={() => {
                  setModalOpen(false);
                  handleDeleteFile(deleteItem?.id);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportList;