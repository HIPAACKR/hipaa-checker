import { useState } from 'react';

export default function ServicesComponent() {
    const [activeTab, setActiveTab] = useState('Safety Certified');

    const tabs = [
        'Safety Certified',
        'Key Components',
        'Advanced Visualization',
        'Implementation',
        'Security Details'
    ];

    const content = {
        'Safety Certified': {
            title: 'Safety Certified',
            description: 'The HIPAAChecker provides a complete solution to security measures and vulnerability scanning, fixing and certifying healthcare applications, software and tools according to HIPAA technical safeguards.',
            icons: ['scan', 'settings', 'shield']
        },
        'Key Components': {
            title: 'Key Components',
            description: 'Essential building blocks for HIPAA compliance including data encryption, access controls, audit logs, and risk assessment frameworks designed to protect patient health information.',
            icons: ['components', 'lock', 'list']
        },
        'Advanced Visualization': {
            title: 'Advanced Visualization',
            description: 'Interactive dashboards and reporting tools that provide real-time insights into your security posture, compliance status, and vulnerability assessments with detailed analytics.',
            icons: ['chart', 'dashboard', 'analytics']
        },
        'Implementation': {
            title: 'Implementation',
            description: 'Step-by-step guidance and automated tools for implementing HIPAA compliance measures across your organization, including training resources and best practices.',
            icons: ['deploy', 'guide', 'workflow']
        },
        'Security Details': {
            title: 'Security Details',
            description: 'Comprehensive security measures including end-to-end encryption, multi-factor authentication, secure data transmission, and advanced threat detection capabilities.',
            icons: ['security', 'encryption', 'protection']
        }
    };

    const renderIcon = (iconType) => {
        const iconProps = 'w-12 h-12 text-white';

        switch(iconType) {
            case 'scan':
                return (
                    <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                );
            case 'settings':
                return (
                    <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            case 'shield':
                return (
                    <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return (
                    <div className={`${iconProps} bg-white bg-opacity-20 rounded-lg flex items-center justify-center`}>
                        <span className="text-lg font-bold">{iconType.charAt(0).toUpperCase()}</span>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/*<div className="mb-8">*/}
            {/*    <p className="text-gray-600 text-sm font-medium mb-2">Services</p>*/}
            {/*    <h1 className="text-4xl font-bold text-gray-900">What Are We Providing?</h1>*/}
            {/*</div>*/}

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Tab Navigation */}
                <div className="flex flex-wrap border-b border-gray-200">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                                activeTab === tab
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } ${index === 0 ? 'rounded-tl-lg' : ''}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                {content[activeTab].title}
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {content[activeTab].description}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-8 flex justify-center items-center">
                            <div className="flex space-x-6">
                                {content[activeTab].icons.map((icon, index) => (
                                    <div key={index} className="transform hover:scale-110 transition-transform duration-200">
                                        {renderIcon(icon)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}