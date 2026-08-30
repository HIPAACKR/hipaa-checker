'use client';

import Image from 'next/image';

import ClientsSection from '@/components/clients-section';
import Footer from '@/components/footer';
import OurProducts from '@/components/our-products';
import Header from '@/components/seo-header';
import ServicesComponent from '@/components/service-tab';
import TestimonialsSection from '@/components/testimonials-section';
import { Button } from '@/components/ui/index.jsx';

// import './index.scss';

export default function LandingPage() {
  const menuItems = [
    { name: 'Home', href: '/home', slug: 'home' },
    { name: 'Overview', href: '#overview', slug: 'overview' },
    { name: 'Features', href: '#features', slug: 'features' },
    // { name: 'Pricing', href: '#pricing', slug: 'pricing' },
    { name: 'FAQ', href: '#faq', slug: 'faq' },
  ];

  const dropdownMenus = {
    products: {
      name: 'Products',
      slug: 'products',
      subMenuParent: 'product-details',
      items: [
        { name: 'All Products', href: '/products', slug: 'products' },
      ]
    },
    manual: {
      name: 'Manual',
      activeParams: ['developer-guideline', 'user-guideline'],
      items: [
        { name: 'Developer Guideline', href: '/developer-guideline', slug: 'developer-guideline' },
        { name: 'User Guideline', href: '/user-guideline', slug: 'user-guideline' }
      ]
    }
  };

  const appConfig = {
    appLink: 'https://hipaachecker.health/sign-in',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=health.hipaachecker',
    buttonText: 'Get started'
  };
  const handleGetStartedClick = () => {
    // Redirect to the sign-in page
    window.location.href = '/sign-in';
  };

  
  return (
    <>
      <Header 
        menu={menuItems} 
        dropdownMenus={dropdownMenus} 
        appConfig={appConfig} 
      />
      <main>
      {/*  Hero Section */}
      <section className="relative h-[700px] overflow-hidden" style={{
        clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)'
      }}>
        {/* Hand Image (Bottom Layer) */}
        <div
          className="absolute inset-0 z-0 bg-no-repeat bg-cover "
          style={{
            backgroundImage: "url('/images/common/bg-1.jpg')",
            backgroundPosition: '20% center'
          }}
        />

        {/* Blue Overlay (Top Layer) */}
        <div
          className="absolute inset-0 z-10 bg-no-repeat bg-cover bg-center opacity-80"
          style={{
            backgroundImage: "url('/images/common/overlay.jpg')",
          }}
        />
        {/* Overlay Content */}
        <div className="relative z-20 flex flex-col md:flex-row items-center justify-between h-full max-w-7xl mx-auto px-6">
          {/* Left Text */}
          <div className="text-white max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Leading the Revolution: <br /> <span className="text-[#ffffff]">HIPAA Certification Technology</span>
            </h1>
            <p className="text-base md:text-lg mb-6">
              Certify your healthcare applications and software/tools in compliance with the Health Insurance Portability and Accountability Act of 1996 (HIPAA)
            </p>
            <div className="flex gap-4 flex-wrap mb-4">
              <button className="bg-[#00BFFF] hover:bg-[#009acd] text-white px-4 py-2 rounded-full font-semibold"
                onClick={handleGetStartedClick}
              >
                Get Started - It’s Free
              </button>
              <a href="https://play.google.com/store/apps/details?id=health.hipaachecker&hl=en"
              target="_blank"
              rel="noopener noreferrer">
                
                <Image src="/images/common/plays.png" alt="Google Play" width={176} height={44} className="h-11 rounded-full " 
                style={{ aspectRatio: '4 / 1' }}/>
              </a>
            </div>
            <div className="text-sm">
              <span>Wondering how it works? </span>
              <a href="https://www.youtube.com/watch?v=tyL_1bIa_xI" 
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-1xl font-extrabold text-[#60c0df]">Watch a video</a>

            </div>
            {/* User Rating */}
            <div className="flex items-center gap-3 mt-6">
              <div className="flex -space-x-2">
                {/* Profile images */}
                <Image src="https://randomuser.me/api/portraits/women/65.jpg" width={48} height={48} className="w-12 h-12 rounded-full border-2 border-white object-cover" alt="User 1" />
                <Image src="https://randomuser.me/api/portraits/men/32.jpg" width={48} height={48} className="w-12 h-12 rounded-full border-2 border-white object-cover" alt="User 2" />
                <Image src="https://randomuser.me/api/portraits/women/45.jpg" width={48} height={48} className="w-12 h-12 rounded-full border-2 border-white object-cover" alt="User 3" />
                <Image src="https://randomuser.me/api/portraits/men/51.jpg" width={48} height={48} className="w-12 h-12 rounded-full border-2 border-white object-cover" alt="User 4" />
                
                <div className="w-12 h-12 rounded-full bg-[#00BFFF] text-white flex items-center justify-center text-4xl font-thin border-2 border-white">+</div>
              </div>
              <div className="text-left">
                <div className="flex items-center text-yellow-400 text-xl mb-1">
                  ★★★★★
                </div>
                <p className="text-white text-base">Best Customer Rating</p>
              </div>
            </div>
          </div>

          {/* Right Mockup */}
 
        <div className="relative mt-10 md:mt-0 max-w-[700px] mx-auto">
          {/* Dash image on top */}
          <Image
            src="/images/common/dash.jpg"
            alt="Phone UI"
            width={220}
            height={400}
            className="relative z-30 w-[180px] md:w-[220px] drop-shadow-xl rounded-lg"
          />

          {/* YouTube iframe behind and offset */}
          <iframe
            className="absolute top-[50%] left-[48%] w-[550px] h-[338px] -translate-y-1/2 rounded-xl shadow-lg  z-10 hidden md:block"
            src="https://www.youtube.com/embed/KaL4IJ2OAaM"
            title="YouTube video player"
            // frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        </div>
      </section>





      {/*  HIPAA Safeguards */}
      <section className="py-20 px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-600 font-normal tracking-wide uppercase mb-2">
          Safeguards
        </p>
        
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
          What Are HIPAA Technical Safeguards
        </h2>
        
        <p className="text-gray-600 max-w-normal mx-auto text-base leading-relaxed mb-11">
          Enhance data security with robust PHI access controls. Ensure compliance with HIPAA regulations effortlessly.
        </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              { 
                title: 'Access Control', 
                icon: 'access.png',
                description: 'Ensure only authorized users have access to protected health information through unique user identification, access procedures.',
                url: 'access-control'
              },
              { 
                title: 'Integrity', 
                icon: 'integrity.png',
                description: 'Protect electronic protected health information from improper alteration or destruction, ensuring data remains complete.',
                url: 'integrity'
              },
              { 
                title: 'Transmission Security', 
                icon: 'transmission.png',
                description: 'Implement measures to guard against unauthorized access to electronic protected health information that is being transmitted.',
                url: 'transmission-security'
              },
              { 
                title: 'Audit Controls', 
                icon: 'audit.png',
                description: 'Implement hardware, software, and procedural mechanisms to record and examine access to information systems.',
                url: 'audit-controls'
              },
              { 
                title: 'Person or Entity Authentication', 
                icon: 'person.png',
                description: 'Verify that a person or entity seeking access to electronic protected health information is who they claim to be.',
                url: 'authentication'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-left group hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white w-16 h-16 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors duration-300">
                    <Image 
                      src={`/images/common/${item.icon}`} 
                      alt={item.title} 
                      width={32} 
                      height={32} 
                      className="w-11 h-11 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-3 text-gray-800">{item.title}</h4>
                    <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
                  </div>
                </div>
                
                <div>
                  <a
                    href={`/features?search=${item.url}`}
                    className="inline-flex items-center text-sm text-blue-600 font-medium hover:underline transition duration-200"
                  >
                    Read More
                    <svg
                      className="ml-1 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Google Play Badge */}
          <div className="text-center mt-16">
            <a
              href="https://play.google.com/store/apps/details?id=health.hipaachecker&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gray-50 rounded-lg px-10 py-7 border border-gray-300 shadow-lg hover:bg-gray-100 transition-colors duration-300"
            >
              <Image 
                src="/images/common/ico6.png" 
                alt="Get it on Google Play" 
                width={200} 
                height={36}
                className="h-9 w-30"
              />
            </a>
          </div>
        </div>
      </section>


      {/*  Watch Video */}
      <section className="py-16 px-6 text-center">
        <p className="text-sm text-gray-500 mb-2">How it works ?</p>
        <h2 className="text-4xl font-bold mb-6">How it Works, Watch Video !</h2>
        <p className="text-gray-500 max-w-xl mx-auto mb-6">
    Certify your healthcare applications and software/tools in compliance with the Health Insurance Portability and Accountability Act of 1996 (HIPAA)
        </p>
        <div className="max-w-3xl mx-auto shadow-lg rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="400"
            src="https://www.youtube.com/embed/tyL_1bIa_xI"
            title="How It Works"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/*  Tabbed Section Placeholder */}
      <section className="py-16 px-6 text-center bg-white">
        <h2 className="text-3xl font-bold mb-8">What Are We Providing?</h2>
          <ServicesComponent/>
      </section>

      {/*  Healthcare Facilities Showcase */}
      <section className="bg-gradient-to-r from-blue-700 via-purple-600 to-blue-400 text-white py-20" style={{clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)'}}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-white">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-12">
                HIPAAChecker to Certify Software/<br />
                Tools of These Healthcare Facilities
              </h2>

              <div className="space-y-4">
                {[
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
                ].map((facility, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0 mt-2"></div>
                    <p className="text-lg font-medium leading-relaxed">{facility}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Device Mockups */}
            <div className="relative flex items-center justify-center">
              {/* Mobile Mockup - Left side */}
              <div className="relative z-20 mr-[-50px]">
                <Image
                  src="/images/common/dash.jpg"
                  alt="Mobile showing HIPAAChecker app"
                  width={200}
                  height={400}
                  className="w-auto h-auto drop-shadow-2xl rounded-2xl"
                />
              </div>

              {/* Laptop Mockup - Right side */}
              <div className="relative z-10">
                <Image
                  src="/images/common/laptop.png"
                  alt="Laptop showing HIPAAChecker dashboard"
                  width={700}
                  height={500}
                  className="w-900 h-800 max-w-full rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*  Products Section */}
      <section className="py-20 px-6 bg-white text-center">
          <OurProducts/>
      </section>

      {/*  Clients */}
      <ClientsSection />

      {/*  Testimonials */}
      <TestimonialsSection />

      {/*  CTA */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-400 rounded-2xl p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Text content on the left */}
              <div className="text-white lg:text-left text-center">
                <h2 className="text-2xl lg:text-3xl font-bold leading-tight">
                  Certify and Protect Your Apps with HIPAAChecker
                </h2>
              </div>

              <div className="flex-shrink-0">
                
                <Button 
                onClick={handleGetStartedClick}
                className="bg-cyan-400 hover:bg-cyan-300 text-gray-800 font-semibold px-6 py-3 rounded-full text-base transition-all duration-300 shadow-lg hover:shadow-xl border-0">
                  Start for Free
                </Button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/*  Footer */}
      <Footer/>
      
    </main>
  </>
    
  );
}
