'use client';

import Image from 'next/image';

const TrustedBySection = () => {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-16 px-6 md:px-20 mb-[30px] md:mb-[80px] rounded-[20px]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        <div>
          <h2 className="text-3xl md:text-4xl mb-6">
            Trusted by <span className="font-bold ">Digital Health Organizations</span>
          </h2>
          <div/>
          <div className="border-l-4 border-white pl-6 text-lg leading-relaxed text-gray-300">
            “HIPAAChecker provides a transparent approach to identifying security vulnerabilities, helping ensure our data handling practices align with HIPAA requirements.”
          </div>
         <p className="mt-2 text-white">
          <span className="text-sm font-normal">Ben Goodmann</span>
          <br />
          <span className="font-bold">CEO, 4A Security & Compliance</span>
        </p>

        </div>

        
        <div className="flex justify-center md:justify-end">
          <Image
            src="/images/common/trusted.png"
            alt="HIPAA Score Dashboard"
            width={500}
            height={400}
            className="rounded-lg"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;