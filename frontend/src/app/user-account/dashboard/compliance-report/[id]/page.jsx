'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Download, Shield } from 'lucide-react';

import HipaaRiskChart from '@/components/risk-chart';
import RiskGauge from '@/components/risk-gauge';
import Skeleton from '@/components/skeleton-row';
import Text from '@/components/text';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import VerticalDivider from '@/components/vertical-divider';
import VulnerabilityDonut from '@/components/vulnerability-donut';
import { get } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';
import { formatDate } from '@/utils/helper';
import { generateComplianceReportPDF } from '@/utils/pdfGenerator';
import { useQuery } from '@tanstack/react-query';

import '../../report-list/analysis-report/[id]/index.scss';

const Index = ({ params }) => {
    const { id } = params;
    const [isPrinting, setIsPrinting] = useState(false);

    const {
        data: reportData,
        isLoading: isLoadingReport,
        isError: isErrorReport,
    } = useQuery({
        queryKey: ['complianceReport', id],
        queryFn: async () => {
            const response = await get(`${API_ENDPOINTS.USER_UPLOADS}/${id}/report`, true, 2);
            return response?.data?.user_upload;
        },
    });

    const handlePrintPDF = async () => {
        try {
            setIsPrinting(true);
            await generateComplianceReportPDF();
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.error('Failed to print page:', error);
            }
            alert('Failed to print page. Please try again.');
        } finally {
            setIsPrinting(false);
        }
    };
    // Helper function to get vulnerability category by name
    const getVulnerabilityByCategory = (riskBreakdown, categoryName) => {
        return riskBreakdown?.find(item => 
            item.risk_category?.toLowerCase().includes(categoryName.toLowerCase())
        ) || { total_risk_score: 0, cvss_risk_remaining: 0, cvss_risk_mitigation: 0 };
    };
    const router = useRouter();

    // Transform API data for vulnerability breakdown following analysis report logic
    const riskBreakDown = reportData?.hipaa_risk_scores?.risk_breakdown || [];
    const hipaaScore = reportData?.hipaa_risk_scores?.total_risk_score || 0;
    const totalRemainingRiskPercent = reportData?.hipaa_risk_scores?.cvss_risk_remaining && hipaaScore
        ? ((reportData.hipaa_risk_scores.cvss_risk_remaining / hipaaScore) * 100)
        : 0;

    // Calculate vulnerability data following the same logic as analysis report
    const vulnerabilityCategories = [
        { key: 'authorization', name: 'Insufficient Authorization', color: '#FF8F8F' },
        { key: 'data', name: 'Inadequate Data Security', color: '#FF6B6B' },
        { key: 'network', name: 'Insecure Network Communication', color: '#F14B4B' },
        { key: 'audit', name: 'Inconsistent Audit Trail', color: '#D6293D' }
    ];

    const vulnerabilityData = vulnerabilityCategories.map(category => {
        const categoryData = getVulnerabilityByCategory(riskBreakDown, category.key);
        
        // Calculate percentage similar to analysis report logic
        const percentage = categoryData.total_risk_score && hipaaScore && totalRemainingRiskPercent > 0
            ? (((categoryData.cvss_risk_remaining / hipaaScore) * 100) / totalRemainingRiskPercent) * 100
            : categoryData.total_risk_score && hipaaScore
            ? ((categoryData.total_risk_score / hipaaScore) * 100)
            : 0;
        
        return {
            label: categoryData.risk_category || category.name,
            percentage: Math.max(0, parseFloat(percentage.toFixed(2))),
            color: category.color,
            actualRiskScore: categoryData.total_risk_score || 0,
            riskRemaining: categoryData.cvss_risk_remaining || 0,
            riskMitigated: categoryData.cvss_risk_mitigation || 0
        };
    });

    // Ensure we have meaningful data - if all percentages are 0, use total_risk_score distribution
    const totalPercentage = vulnerabilityData.reduce((sum, item) => sum + item.percentage, 0);
    if (totalPercentage === 0 && hipaaScore > 0) {
        vulnerabilityData.forEach((item, index) => {
            if (item.actualRiskScore > 0) {
                item.percentage = parseFloat(((item.actualRiskScore / hipaaScore) * 100).toFixed(2));
            }
        });
    }

    // Transform API data for vulnerability assessment table
    const vulnerabilityTableData = reportData?.report?.rules
        ? reportData.report.rules.map((rule) => ({
            hipaaRef: rule.hipaa_policy_reference || 'N/A',
            policy: rule.hipaa_policy || rule.rule_name,
            ruleName: rule.rule_name,
            noRisk: rule.no_risk_count || 0,
            lowRisk: rule.low_risk_count || 0,
            mediumRisk: rule.medium_risk_count || 0,
            highRisk: rule.high_risk_count || 0,
            criticalRisk: 0, // API doesn't provide critical count, assuming 0
        }))
        : [];

    // Transform API data for HIPAA risk distribution
    const hipaaRiskData = reportData?.report?.rules
        ? reportData.report.rules.map((rule) => ({
            ruleId: rule.rule_id,
            ruleName: rule.rule_name,
            highRisk: rule.high_risk_count || 0,
            mediumRisk: rule.medium_risk_count || 0,
            lowRisk: rule.low_risk_count || 0,
            noRisk: rule.no_risk_count || 0,
        }))
        : [];

    // Calculate HIPAA risk score percentage
    const hipaaRiskScore = reportData?.hipaa_risk_scores
        ? ((reportData.hipaa_risk_scores.cvss_risk_remaining / reportData.hipaa_risk_scores.total_risk_score) * 100).toFixed(1)
        : 14.1;

    const RISK_CLASS_MAP = {
        low: 'risk--green',
        medium: 'risk--orange',
        high: 'risk--red',
        critical: 'risk--cornell-red',
        default: 'risk--gray',
    };

    const getRiskBadgeClass = (riskType, forTable = false) => {
        const baseClass = 'text-xs border-0';
        const tableClasses = 'text-white justify-center';

        const bg = RISK_CLASS_MAP[riskType] || RISK_CLASS_MAP.default;

        return `${bg} ${forTable ? tableClasses : baseClass}`;
    };


    return (
        <div className="min-h-screen">           
            <div className="flex items-center gap-2 cursor-pointer  print-hide"
                onClick={() => router.back()}
            >
            <Image
            src="/images/icons/circle-left-arrow.svg"
            width={20}
            height={20}
            alt="Back arrow"
            />
            <Text color="neutral-800" size="fs-14" weight="semi-bold">
            Back
            </Text>
            </div>
            <div id="compliance-report-content" className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white p-6 d-flex">
                    <div className="flex items-center justify-between">                       
                        <div className="flex items-center gap-3">                        
                            <div className='d-flex flex-cols'>
                                <h1 className="text-2xl font-bold">HIPAA Risk Assessment Report</h1>
                                <Text
                                    size={'fs-14'}
                                    color='neutral-500'
                                >
                                    A Comprehensive Review of Security and Privacy Safeguards
                                </Text>
                            </div>
                        </div>
                        <div className="flex gap-2 print-hide">                           
                            <Button 
                                size="sm" 
                                onClick={handlePrintPDF}
                                disabled={isPrinting}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                {isPrinting ? 'Opening Print Dialog...' : 'Print as PDF'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Report Information */}
                <div className="flex flex-row gap-5 items-stretch mt-4">
                    <Card className="w-1/2 flex flex-col lg:flex-row gap-1 justify-between align-center p-4">
                        <div className='w-1/2'>
                            <p className="text-sm font-semibold">Application Information</p>
                            <div className="space-y-1">
                                <div>
                                    <span className="text-xs text-gray-500">Application name:</span>
                                    {isLoadingReport ? (
                                        <Skeleton />
                                    ) : isErrorReport ? (
                                        <p className="text-sm text-red-500">Error loading data</p>
                                    ) : (
                                        <p className="text-sm font-normal">{reportData?.name || 'N/A'}</p>
                                    )}
                                </div>
                                <div className="flex gap-6">
                                    <div>
                                        <span className="text-xs text-gray-500">Platform type:</span>
                                        {isLoadingReport ? (
                                            <Skeleton />
                                        ) : (
                                            <p className="text-sm font-normal">{reportData?.platform?.toUpperCase() || 'N/A'}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div>
                                        <span className="text-xs text-gray-500">Time of scan:</span>
                                        {isLoadingReport ? (
                                            <Skeleton />
                                        ) : (
                                            <p className="text-sm font-normal">
                                                {reportData?.created_at ? formatDate(reportData.created_at) : 'N/A'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <VerticalDivider className="my-6" />


                        <div className='w-1/2'>
                            <p className="text-sm font-semibold">Company/User Information</p>
                            <div className="space-y-1">
                                <div>
                                    <span className="text-xs text-gray-500">Organization:</span>
                                    <p className="text-sm font-normal">HealthTech Solutions Inc.</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Contact:</span>
                                    <p className="font-sm font-normal">security@healthtech.com</p>
                                </div>
                            </div>
                        </div>

                    </Card>

                    {/* Textual Summary */}
                    <Card className="w-1/2 p-4">
                        <h2 className="text-xl font-semibold mb-4">Executive Summary</h2>
                        {isLoadingReport ? (
                            <div className="space-y-2">
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                            </div>
                        ) : isErrorReport ? (
                            <p className="text-red-500">Error loading report summary</p>
                        ) : (
                            <p className="text-sm text-gray-600 leading-relaxed">
                                The HIPAA risk assessment for the <strong>{reportData?.name || 'application'}</strong> reveals a{' '}
                                <strong>risk score of {hipaaRiskScore}%</strong>.
                                The assessment identified {reportData?.report?.rules?.length || 0} security controls across authentication, authorization, data security, audit trails,
                                network security, and encryption domains. The application&apos;s compliance with HIPAA Security Rule requirements
                                varies across different categories. Total severity counts include{' '}
                                {reportData?.severity_counts?.high_risk || 0} high risk,{' '}
                                {reportData?.severity_counts?.medium_risk || 0} medium risk, and{' '}
                                {reportData?.severity_counts?.low_risk || 0} low risk findings.
                                Recommended remediation actions focus on addressing the identified vulnerabilities to enhance overall compliance.
                            </p>
                        )}
                    </Card>
                </div>

                {/* Risk Score and Vulnerability Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className='analysisReport__card'>
                        <div className='analysisReport__scoreHead analysisReport__scoreHead--margin'>
                            <h3 className='analysisReport__title'>HIPAA Risk Score (%)</h3>
                        </div>
                        {/* <h3
                            className='text-xl font-semibold mb-4 text-left mt-4 ml-8'
                        >HIPAA Risk Score (%)</h3> */}
                        <div className='analysisReport__scoreContent'>
                            <div className='analysisReport__graph pt-4'>
                                <RiskGauge 
                                    score={parseFloat(hipaaRiskScore)} 
                                    label={
                                        parseFloat(hipaaRiskScore) <= 20 ? 'Low' :
                                        parseFloat(hipaaRiskScore) <= 45 ? 'Average' :
                                        parseFloat(hipaaRiskScore) <= 80 ? 'High' : 'Critical'
                                    }
                                    isLoading={isLoadingReport}
                                />
                            </div>
                            <div className='analysisReport__scoreItems'>
                                <span className='analysisReport__scoreItem analysisReport--cornell-red'>Critical</span>
                                <span className='analysisReport__scoreItem analysisReport--red'>High</span>
                                <span className='analysisReport__scoreItem analysisReport--orange'>Medium</span>
                                <span className='analysisReport__scoreItem analysisReport--green'>Low</span>
                            </div>
                        </div>
                    </div>

                    <div className='analysisReport__card'>
                        <div className='analysisReport__scoreHead analysisReport__scoreHead--margin'>
                            <h3 className='analysisReport__title'>Vulnerability Breakdown</h3>
                        </div>
                        <div className='analysisReport__graph'>
                            <VulnerabilityDonut data={vulnerabilityData} isLoading={isLoadingReport} />
                        </div>
                    </div>
                </div>

                {/* Vulnerability Table */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Vulnerability Assessment</h2>
                    {isLoadingReport ? (
                        <div className="space-y-2">
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                        </div>
                    ) : isErrorReport ? (
                        <p className="text-red-500">Error loading vulnerability data</p>
                    ) : (
                        <div>
                            <div className="overflow-x-auto">
                                {/* <table className="w-full border-collapse border-spacing-0"> */}
                                <table className="w-full border-separate border-spacing-0">
                                    <thead>
                                    <tr className="bg-[#f9fafb] border border-gray-200 rounded-t-lg rounded">
                                    {/* <tr className="border border-gray-200 bg-[#f9fafb]"></tr> */}
                                        <th className="text-left font-medium py-3 px-2 text-sm whitespace-nowrap text-[#101828] border-t border-l border-b rounded-tl-lg">HIPAA Reference</th>
                                        <th className="text-left font-medium py-3 px-2 text-sm whitespace-nowrap text-[#101828] border-t border-b">HIPAA Policy</th>
                                        <th className="text-left font-medium p-3 text-sm whitespace-nowrap w-[170px] max-w-[170px] text-[#101828] border-t border-b">Rule Name</th>
                                        <th className="text-center font-medium py-3 px-2 text-sm whitespace-nowrap text-[#101828] border-t border-b">No Risk</th>
                                        <th className="text-center font-medium py-3 px-2 text-sm whitespace-nowrap text-[#101828] border-t border-b">Low Risk</th>
                                        <th className="text-center font-medium py-3 px-2 text-sm whitespace-nowrap text-[#101828] border-t border-b">Medium Risk</th>
                                        <th className="text-center font-medium py-3 px-2 text-sm whitespace-nowrap text-[#101828] border-t border-b">High Risk</th>
                                        <th className="text-center font-medium py-3 px-2 text-sm whitespace-nowrap text-[#101828] border-t border-r border-b rounded-tr-lg">Critical Risk</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {vulnerabilityTableData.length > 0 ? vulnerabilityTableData.map((row, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className={`border-l border-b border-gray-200 py-3 px-2 text-sm text-tertiary-600 ${index === vulnerabilityTableData.length - 1 ? 'rounded-bl-lg' : ''}`}>{row.hipaaRef}</td>
                                            <td className="border-b border-gray-200 py-3 px-2 text-sm text-tertiary-600 max-w-xs" title={row.policy}>{row.policy}</td>
                                            <td className="border-b border-gray-200 py-3 px-2 text-sm text-tertiary-600" title={row.ruleName}>{row.ruleName}</td>
                                            <td className="border-b border-gray-200 py-3 px-2 text-center">
                                                <Badge className={`${getRiskBadgeClass('', true)} w-[50px] min-w-[50px] h-[22px] min-h-[22px]`} variant='custom'>{row.noRisk}</Badge>
                                            </td>
                                            <td className="border-b border-gray-200 py-3 px-2 text-center">
                                                <Badge className={`${getRiskBadgeClass('low', true)} w-[50px] min-w-[50px] h-[22px] min-h-[22px]`} variant='custom'>{row.lowRisk}</Badge>
                                            </td>
                                            <td className="border-b border-gray-200 py-3 px-2 text-center">
                                                <Badge className={`${getRiskBadgeClass('medium', true)} w-[50px] min-w-[50px] h-[22px] min-h-[22px]`} variant='custom'>{row.mediumRisk}</Badge>
                                            </td>
                                            <td className="border-b border-gray-200 py-3 px-2 text-center">
                                                <Badge className={`${getRiskBadgeClass('high', true)} w-[50px] min-w-[50px] h-[22px] min-h-[22px]`} variant='custom'>{row.highRisk}</Badge>
                                            </td>
                                            <td className={`border-r border-b border-gray-200 py-3 px-2 text-center ${index === vulnerabilityTableData.length - 1 ? 'rounded-br-lg' : ''}`}>
                                                <Badge className={`${getRiskBadgeClass('critical', true)} w-[50px] min-w-[50px] h-[22px] min-h-[22px]`} variant='custom'>{row.criticalRisk}</Badge>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="8" className="p-6 text-center text-gray-500">
                                                No vulnerability data available
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {/* HIPAA Risk Distribution */}
                            <div>
                                {isLoadingReport ? (
                                    <div className="space-y-2">
                                        <Skeleton />
                                        <Skeleton />
                                        <Skeleton />
                                    </div>
                                ) : isErrorReport ? (
                                    <p className="text-red-500">Error loading HIPAA risk data</p>
                                ) : (
                                    <div className="py-6">
                                        <HipaaRiskChart data={hipaaRiskData} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    {/* Remediation Plan */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Remediation Plan</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium mb-2">Immediate Actions (1-30 days)</h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <Badge className={getRiskBadgeClass('high')}>HIGH</Badge>
                                        <span className='text-tertiary-600'>Implement proper session timeout configuration (2-4 hours maximum)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Badge className={getRiskBadgeClass('medium')}>MED</Badge>
                                        <span className='text-tertiary-600'>Enhance password complexity requirements to meet HIPAA standards</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">Short-term Actions (1-3 months)</h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <Badge className={getRiskBadgeClass('high')}>HIGH</Badge>
                                        <span className='text-tertiary-600'>Implement end-to-end encryption for all temporary data storage</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Badge className={getRiskBadgeClass('medium')}>MED</Badge>
                                        <span className='text-tertiary-600'>Enhance audit logging to capture all data modification events</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">Long-term Actions (3-6 months)</h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <Badge className={getRiskBadgeClass('low')}>LOW</Badge>
                                        <span className='text-tertiary-600'>Implement comprehensive penetration testing program</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Badge className={getRiskBadgeClass('low')}>LOW</Badge>
                                        <span className='text-tertiary-600'>Establish regular security awareness training for all users</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Card>

                    {/* Disclaimer */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Disclaimer</h2>
                        <p className="text-sm text-tertiary-600 leading-relaxed">
                            This HIPAA risk assessment report is based on automated scanning and analysis tools and should be used as a
                            starting point for comprehensive HIPAA compliance evaluation. The findings presented here do not constitute
                            legal advice and should be reviewed by qualified security professionals and legal counsel familiar with HIPAA
                            requirements. Organizations are responsible for conducting thorough risk assessments, implementing appropriate
                            safeguards, and maintaining ongoing compliance with all applicable HIPAA Security and Privacy Rule requirements.
                            This assessment should be supplemented with manual security reviews, penetration testing, and regular compliance
                            audits as part of a comprehensive information security program.
                        </p>
                    </Card>
                </div>
                

                {/* Footer */}
                <Card className="p-6 bg-blue-500 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Shield className="h-6 w-6" />
                            <div>
                                <p className="font-semibold">Ubitrix</p>
                                <p className="text-sm opacity-90">HIPAA Compliance & Security Solutions</p>
                            </div>
                        </div>
                        <div className="text-right text-sm opacity-90">
                            <p>Report Generated: {new Date().toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}</p>
                            <p>© {new Date().getFullYear()} Ubitrix. All rights reserved.</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Index;