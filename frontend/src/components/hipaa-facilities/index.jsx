export default function HIPAACheckerHero() {
    const facilities = [
        'Ambulatory Surgical Centers (ASCs)',
        'Community Mental Health Centers (CMHCs)',
        'Comprehensive Outpatient Rehabilitation Facilities (CORFs)',
        'End-Stage Renal Disease (ESRD) Facilities',
        'Federally Qualified Health Centers (FQHCs)',
        'Home Health Agencies (HHAs)',
        'Hospices and Hospitals',
        'Clinics, Rehabilitation Agencies, and Public Health Agencies as Providers of Outpatient Physical Therapy and Speech-Language Pathology Services (OPT/OSP)',
        'Portable X-Ray (PXR)',
        'Skilled Nursing Facilities (SNF)'
    ];

    return (
        <div className="relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-20 right-20 w-96 h-96 bg-white opacity-5 rounded-full"></div>
                {/*<div className="absolute bottom-20 left-20 w-64 h-64 bg-white opacity-3 rounded-full"></div>*/}
            </div>

            <div className="relative z-10 container mx-auto px-8 py-16">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="text-white">
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-12">
                            HIPAAChecker to Certify Software/<br />
                            Tools of These Healthcare Facilities
                        </h1>

                        <div className="space-y-4">
                            {facilities.map((facility, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0 mt-2"></div>
                                    <p className="text-lg font-medium leading-relaxed">{facility}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Content - Device Mockups */}
                    <div className="relative">
                        {/* Laptop Mockup */}
                        <div className="relative z-20">
                            <div className="bg-gray-800 rounded-t-2xl p-2">
                                <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                                    {/* Mobile Interface */}
                                    <div className="bg-gray-50 p-6 h-96">
                                        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold text-gray-800">Welcome, Shaved</h3>
                                                <div className="w-6 h-6 bg-blue-500 rounded"></div>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-4">Scan and check your results by HipaaChecker</p>
                                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm flex items-center">
                                                <span>Scan Now</span>
                                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                                <div className="text-xs text-gray-500 mb-1">Total Scanned</div>
                                                <div className="text-2xl font-bold">1</div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                                <div className="text-xs text-gray-500 mb-1">High Risk</div>
                                                <div className="text-2xl font-bold text-red-500">0%</div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                                <div className="text-xs text-gray-500 mb-1">Medium Risk</div>
                                                <div className="text-2xl font-bold text-yellow-500">0%</div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                                <div className="text-xs text-gray-500 mb-1">Low Risk</div>
                                                <div className="text-2xl font-bold text-green-500">0%</div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-lg p-3 shadow-sm">
                                            <div className="text-xs text-gray-500 mb-1">Satisfactory</div>
                                            <div className="text-2xl font-bold text-green-500">100%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Laptop base */}
                            <div className="bg-gray-700 h-6 rounded-b-2xl mx-auto w-full"></div>
                            <div className="bg-gray-600 h-2 rounded-full mx-auto w-32 mt-1"></div>
                        </div>

                        {/* Desktop Interface - Right side */}
                        <div className="absolute top-0 right-0 bg-white rounded-lg shadow-2xl p-6 w-80 h-96 transform translate-x-16 z-10">
                            <div className="space-y-4">
                                {/* Facility type buttons */}
                                <div className="flex flex-wrap gap-2">
                                    <button className="bg-blue-500 text-white px-3 py-2 rounded-full text-sm">ASCs</button>
                                    <button className="bg-blue-500 text-white px-3 py-2 rounded-full text-sm">SNF</button>
                                    <button className="bg-blue-500 text-white px-3 py-2 rounded-full text-sm">ESRD</button>
                                    <button className="bg-blue-500 text-white px-3 py-2 rounded-full text-sm">CMHCs</button>
                                    <button className="bg-blue-500 text-white px-3 py-2 rounded-full text-sm">FQHCs</button>
                                    <button className="bg-blue-500 text-white px-3 py-2 rounded-full text-sm">HHAs</button>
                                </div>

                                {/* Mobile device mockup */}
                                <div className="bg-gray-100 rounded-lg p-4 mx-auto w-32">
                                    <div className="space-y-2">
                                        <div className="h-2 bg-blue-400 rounded w-3/4"></div>
                                        <div className="h-2 bg-green-400 rounded w-1/2"></div>
                                        <div className="h-2 bg-yellow-400 rounded w-2/3"></div>
                                        <div className="h-2 bg-red-400 rounded w-1/3"></div>
                                    </div>
                                </div>

                                {/* Score section */}
                                <div className="text-center mt-8">
                                    <div className="text-sm text-gray-600 mb-2">Application Hipaa Score</div>
                                    <select className="border rounded p-2 w-full mb-4">
                                        <option>Dall</option>
                                    </select>

                                    {/* Circular score */}
                                    {/*<div className="relative w-32 h-32 mx-auto">*/}
                                    {/*    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">*/}
                                    {/*        <circle*/}
                                    {/*            cx="60"*/}
                                    {/*            cy="60"*/}
                                    {/*            r="50"*/}
                                    {/*            fill="none"*/}
                                    {/*            stroke="#e5e7eb"*/}
                                    {/*            strokeWidth="8"*/}
                                    {/*        />*/}
                                    {/*        <circle*/}
                                    {/*            cx="60"*/}
                                    {/*            cy="60"*/}
                                    {/*            r="50"*/}
                                    {/*            fill="none"*/}
                                    {/*            stroke="url(#gradient)"*/}
                                    {/*            strokeWidth="8"*/}
                                    {/*            strokeLinecap="round"*/}
                                    {/*            strokeDasharray={`${52 * 3.14159} ${(100 - 52) * 3.14159}`}*/}
                                    {/*        />*/}
                                    {/*        <defs>*/}
                                    {/*            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">*/}
                                    {/*                <stop offset="0%" stopColor="#ef4444" />*/}
                                    {/*                <stop offset="50%" stopColor="#eab308" />*/}
                                    {/*                <stop offset="100%" stopColor="#22c55e" />*/}
                                    {/*            </linearGradient>*/}
                                    {/*        </defs>*/}
                                    {/*    </svg>*/}
                                    {/*    <div className="absolute inset-0 flex items-center justify-center">*/}
                                    {/*        <div className="text-center">*/}
                                    {/*            <div className="text-2xl font-bold">52.0</div>*/}
                                    {/*            <div className="text-xs text-gray-500">Average</div>*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}

                                    {/* Legend */}
                                    {/*<div className="flex justify-center space-x-4 mt-4 text-xs">*/}
                                    {/*    <div className="flex items-center">*/}
                                    {/*        <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>*/}
                                    {/*        <span>Low</span>*/}
                                    {/*    </div>*/}
                                    {/*    <div className="flex items-center">*/}
                                    {/*        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>*/}
                                    {/*        <span>Average</span>*/}
                                    {/*    </div>*/}
                                    {/*    <div className="flex items-center">*/}
                                    {/*        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>*/}
                                    {/*        <span>Standard</span>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}