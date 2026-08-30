'use client';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

import Breadcrumb from '@/components/breadcrumb';
import DropDown from '@/components/drop-down';
import Loader from '@/components/loader';
import NoData from '@/components/no-data';
import Skeleton from '@/components/skeleton-row';
import SubRuleFileItem from '@/components/subRuleFileItem';
import Text from '@/components/text';
import {useSelectedOption} from '@/context/selectOptionContext';
import {get} from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import {riskStatus, vulnerabilityDropdownData, vulnerabilityStatus} from '@/utils/constant-data';
import {formatDate} from '@/utils/helper';
import useIsSpDevice from '@/utils/useSpDevice';
import {useQuery} from '@tanstack/react-query';

import './index.scss';

const SpecificDetails = ({params}) => {
    const {slug} = params;
    const fileId = slug?.split('--')[3];
    const {All, High, Low, Medium, Satisfactory, Critical} = vulnerabilityStatus;
    const {HighRisk, MediumRisk, LowRisk, NoRisk, CriticalRisk} = riskStatus;
    const {state, dispatch} = useSelectedOption();

    const pathSegments = slug.split('--');
    const lastFileId = pathSegments[3];
    const filename = pathSegments[4];
    const router = useRouter();
    // Always default to 'All' regardless of navigation path
    const [vulnerability, setVulnerability] = useState(All);

    const [ruleTitle, setRuleTitle] = useState(
        state.fileWise.ruleTitle ? state.fileWise.ruleTitle : '',
    );
    const [subTItle, setSubTitle] = useState(
        state.fileWise.subTitle ? state.fileWise.subTitle[0] : '',
    );
    const [activeTab, setActiveTab] = useState('Details');
    const [selectedSubruleId, setSelectedSubruleId] = useState(null);
    const [ruleId, setRuleId] = useState('');

    const isSpDevice = useIsSpDevice();
    const applicationID = pathSegments[0];
    const currentPage = pathSegments[1];
    const viewStatus = pathSegments[2];

    const {
        data: reportCodeViewData,
        isLoading: isLoadingCodeView,
        isError: isErrorCodeView,
        isSuccess: isSuccessCodeView,
    } = useQuery({
        queryKey: ['codeView', fileId, applicationID],
        queryFn: async () => {
            const response = await get(
                `${API_ENDPOINTS.USER_UPLOADS}/${applicationID}/file_content?file_id=${fileId}`,
                true,
            );
            return response?.data;
        },
    });

    const {
        data: specificReportDetailsData,
        isLoading: isLoadingSpecificReportDetails,
        isError: isErrorSpecificReportDetails,
        isSuccess: isSuccessSpecificReportDetails,
    } = useQuery({
        queryKey: [
            'specificReportDetailsAnalysis',
            applicationID,
            currentPage,
            viewStatus,
            vulnerability,
            lastFileId,
        ],
        queryFn: async () => {
            // console.log('Vulnerability:', vulnerability);
            // console.log('ViewStatus:', viewStatus);
            // console.log('Current Page:', currentPage);
            // console.log('Application ID:', applicationID);
            // console.log('Last File ID:', lastFileId);

            const severityParam =
                viewStatus === NoRisk || vulnerability === Satisfactory
                    ? '&severity=0'
                    : viewStatus === LowRisk || vulnerability === Low
                        ? '&severity=1'
                        : viewStatus === MediumRisk || vulnerability === Medium
                            ? '&severity=2'
                            : viewStatus === HighRisk || vulnerability === High
                                ? '&severity=3'
                                : vulnerability.toLowerCase() === 'critical'
                                    ? '&severity=4'
                                    : '&severity=3';

            // console.log('Severity Param:', severityParam);

            const response = await get(
                `${API_ENDPOINTS.USER_UPLOADS}/${applicationID}/file_wise?page=${currentPage}`,
                true,
                2,
            );
            return response?.data?.user_upload;
        },
    });
    const filterDataForSpecificReport = specificReportDetailsData?.analyzed_results?.filter(
        (item) => item?.file_id?.toString() === lastFileId,
    );

    const totalSubRules = filterDataForSpecificReport?.map((item) =>
        item?.rules?.flatMap((rule) => rule?.sub_rules?.filter((sub_rule) => sub_rule?.count > 0)),
    );

    const platform = specificReportDetailsData?.platform || '';

    const getFilteredSubRules = (rules) => {
        return rules
            .map((rule) => {
                // First filter subrules with count > 0
                let filteredSubRules = rule?.sub_rules?.filter((subRule) => subRule?.count > 0);

                // Then filter by vulnerability if not "All"
                if (vulnerability !== All) {
                    const selectedSeverity = vulnerability === Satisfactory
                        ? 0
                        : vulnerability === Low
                            ? 1
                            : vulnerability === Medium
                                ? 2
                                : vulnerability === High
                                    ? 3
                                    : vulnerability === Critical
                                        ? 4
                                        : null;

                    filteredSubRules = filteredSubRules.filter(subRule => parseInt(subRule.severity, 10) === selectedSeverity);
                }

                return {
                    ...rule,
                    sub_rules: filteredSubRules,
                };
            })
            .filter((rule) => rule?.sub_rules?.length > 0);
    };

    const filteredDataWithCounts = filterDataForSpecificReport
        ?.map((item) => ({
            ...item,
            rules: getFilteredSubRules(item?.rules),
        }))
        .filter((item) => item?.rules?.length > 0);

    const paths = [
        {name: 'Dashboard', url: '/user-account/dashboard'},
        {
            name: 'Analysis Report',
            url: `/user-account/dashboard/report-list/analysis-report/${applicationID}`,
        },
        {name: 'Specific Report', url: ''},
    ];

    const handleSelectedRule = (value) => {
        setRuleTitle(value);
        dispatch({
            type: 'SET_VULNERABILITY_STATUS',
            payload: {
                fileWise: {
                    ruleTitle: value,
                },
            },
        });
    };

    useEffect(() => {
        // Set the context value whenever vulnerability changes
        dispatch({
            type: 'SET_VULNERABILITY_STATUS',
            payload: {
                vulnerabilityStatusForFile: vulnerability,
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vulnerability]);

    // Also set the value on component mount
    useEffect(() => {
        dispatch({
            type: 'SET_VULNERABILITY_STATUS',
            payload: {
                vulnerabilityStatusForFile: All,
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubrule = (value) => {
        const subFileData = filteredDataWithCounts.map((item) =>
            item.rules.flatMap((rule) =>
                rule.sub_rules.filter((sub_rule) => {
                    if (sub_rule.subrule_id === value) {
                        setSubTitle(sub_rule);
                        return true;
                    }
                    return false;
                }),
            ),
        );

        dispatch({
            type: 'SET_VULNERABILITY_STATUS',
            payload: {
                fileWise: {
                    subTitle: subFileData[0],
                },
            },
        });
    };

    useEffect(() => {
        dispatch({
            type: 'SET_DATA',
            payload: {
                selectedOption: 'SPECIFIC',
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            type: 'SET_FILTER',
            payload: {
                filterStatus: viewStatus,
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewStatus]);

    return (
        <div className="specificDetails">
            <div className="specificDetails__header">
                <div className="specificDetails__header__content">
                    <Breadcrumb
                        header={slug?.split('--')[4]}
                        paths={paths}
                        backButtonURL={`/user-account/dashboard/report-list/analysis-report/${applicationID}`}
                    />
                </div>
                <div className="specificDetails__header__content__application">
                    <Text
                        color="neutral-400"
                        size="fs-12"
                        weight="regular"
                    >
                        Application name
                    </Text>
                    <div className="specificDetails__header__content__name">
                        {isLoadingSpecificReportDetails ? (
                            <Skeleton/>
                        ) : (
                            <Text
                                color="neutral-800"
                                size="fs-14"
                                weight="medium"
                            >
                                {specificReportDetailsData?.name}
                            </Text>
                        )}
                    </div>
                    <div className="specificDetails__header__content__details">
                        <div className="specificDetails__header__content__details__data">
                            <Text
                                color="neutral-400"
                                size="fs-12"
                                weight="regular"
                            >
                                File format:
                            </Text>
                            {isLoadingSpecificReportDetails ? (
                                <Skeleton/>
                            ) : (
                                <Text
                                    color="neutral-600"
                                    size="fs-12"
                                    weight="regular"
                                >
                                    .{slug?.split('--')[4]?.split('.')[1]}
                                </Text>
                            )}
                        </div>

                        <div className="specificDetails__header__content__details__data">
                            <Text
                                color="neutral-400"
                                size="fs-12"
                                weight="regular"
                            >
                                Time of scan:
                            </Text>

                            {isLoadingSpecificReportDetails ? (
                                <Skeleton/>
                            ) : (
                                <Text
                                    color="neutral-600"
                                    size="fs-12"
                                    weight="regular"
                                >
                                    {formatDate(specificReportDetailsData?.created_at)}
                                </Text>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="specificDetails__print-report">
                <div className="specificDetails__print-report__content">
                    <div className="specificDetails__print-report__content-options">
                        <Text
                            color="neutral-700"
                            size="fs-14"
                            weight="regular"
                        >
                            Showing{' '}
                            <span className="specificDetails__print-report__high-light">
                {totalSubRules && totalSubRules[0] && totalSubRules[0]?.length
                    ? totalSubRules[0]?.length
                    : 0}{' '}
              </span>
                            subrule{totalSubRules && totalSubRules[0] && totalSubRules[0]?.length > 1 && 's'}{' '}
                            containing
                        </Text>
                        <DropDown
                            type={'colored'}
                            data={vulnerabilityDropdownData}
                            value={vulnerability}
                            setValue={(val) => setVulnerability(val)}
                        />
                    </div>
                    <Text
                        color="neutral-400"
                        size="fs-14"
                        weight="regular"
                    >
                        {vulnerability !== 'Satisfactory' && 'vulnerabilities'}
                    </Text>
                </div>
                <div className="specificDetails__print-report__button"></div>
            </div>
            <div className="specificDetails__main-container">
                {isLoadingSpecificReportDetails ? (
                    <div className="specificDetails__loader">
                        <Loader size="large"/>
                    </div>
                ) : isErrorSpecificReportDetails ? (
                    <NoData title="Data fetching failed from server"/>
                ) : (
                    <>
                        <div className="specificDetails__container">
                            <div className="specificDetails__subrule-container">
                                {filteredDataWithCounts?.length > 0 &&
                                filteredDataWithCounts[0]?.rules?.length > 0 ? (
                                    <>
                                        {filteredDataWithCounts[0]?.rules?.map((rule, index_id) => (
                                            <div
                                                onClick={() => {
                                                    handleSelectedRule(rule?.description);
                                                }}
                                                key={index_id}
                                                className={`specificDetails__container__subrule ${state.fileWise.ruleTitle.toString() === rule?.description.toString() && 'specificDetails__container__subrule--isSelected'}`}
                                            >
                                                <div className="specificDetails__container__subrule__heading">
                                                    <Text
                                                        color="neutral-800"
                                                        size="fs-16"
                                                        weight="medium"
                                                    >
                                                        {rule?.description}
                                                    </Text>
                                                </div>
                                                <div
                                                    className="specificDetails__container__subrule__found__line specificDetails__container__subrule__found__line--grey"/>
                                                <div className="specificDetails__container__subrule__found">
                                                    <Text
                                                        color="neutral-600"
                                                        size="fs-14"
                                                        weight="regular"
                                                    >
                                                        SUBRULE FOUND:
                                                    </Text>
                                                    <span
                                                        className={`specificDetails__container__subrule__found__riskItem specificDetails__container__subrule__found__riskItem--${
                                                            vulnerability === 'Satisfactory'
                                                                ? 'iris-blue'
                                                                : vulnerability === Low
                                                                    ? 'green'
                                                                    : vulnerability === Medium
                                                                        ? 'orange'
                                                                        : vulnerability === High
                                                                            ? 'red'
                                                                            : vulnerability.toLowerCase() === 'critical'
                                                                                ? 'cornell-red'
                                                                                : 'red'
                                                        }`}
                                                    >
                            <span
                                className="specificDetails__container__subrule__found__content">{`${filteredDataWithCounts[0]?.rules[index_id]?.sub_rules?.length} `}</span>
                                                        {vulnerability === 'Satisfactory'
                                                            ? 'SATISFACTORY'
                                                            : vulnerability === Low
                                                                ? 'LOW'
                                                                : vulnerability === Medium
                                                                    ? 'MEDIUM'
                                                                    : vulnerability === High
                                                                        ? 'HIGH'
                                                                        : vulnerability.toLowerCase() === 'critical'
                                                                            ? 'CRITICAL'
                                                                            : ''}
                          </span>
                                                </div>
                                                <div className="specificDetails__container__subrule__found__line"/>
                                                <div className="specificDetails__container__subrule__main-data-content">
                                                    {rule?.sub_rules?.length > 0 &&
                                                        rule?.sub_rules?.map((sub, index) => (
                                                            <div
                                                                key={index}
                                                                onClick={() => {
                                                                    isSpDevice &&
                                                                    router.push(
                                                                        `/user-account/dashboard/specific-rule-sp/${applicationID}--${currentPage}--${viewStatus}--${lastFileId}-${sub.subrule_id}--${filename}--${rule.rule_id}--${rule.description}`,
                                                                    );
                                                                    handleSelectedRule(rule?.description);
                                                                    handleSubrule(sub?.subrule_id);
                                                                    setSelectedSubruleId(sub?.subrule_id);
                                                                    setRuleId(rule?.rule_id)
                                                                    setActiveTab('Details')

                                                                }}
                                                                className={`specificDetails__container__subrule__main-data-content__item ${subTItle?.description === sub?.description ? 'specificDetails__container__subrule__main-data-content__item--active' : ''}`}
                                                            >
                                                                <div
                                                                    className="specificDetails__container__subrule__main-data-content__item__image"/>
                                                                <Text
                                                                    color="primary-800"
                                                                    size="fs-14"
                                                                    weight="regular"
                                                                >
                                                                    {sub?.description}
                                                                </Text>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <NoData/>
                                )}
                            </div>
                            {totalSubRules &&
                                totalSubRules[0] &&
                                totalSubRules[0]?.length > 0 &&
                                ruleTitle &&
                                subTItle && (
                                  <SubRuleFileItem
                                    ruleTitle={ruleTitle}
                                    fileName={filename}
                                    vulnerableCodeData={[subTItle?.code_segments]}
                                    vulnerability={vulnerability}
                                    isErrorCodeView={isErrorCodeView}
                                    isLoadingCodeView={isLoadingCodeView}
                                    reportCodeViewData={reportCodeViewData}
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    selectedSubruleId={selectedSubruleId}
                                    platform={platform}
                                    ruleId={ruleId}
                                  />
                                )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
export default SpecificDetails;
