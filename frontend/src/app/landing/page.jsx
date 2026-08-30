'use client';

import Image from 'next/image';

import ClientsSectiontwo from '@/components/clients-section2';
import Enterprise from '@/components/enterprise_part';
import Footer from '@/components/footer';
// import Pricing from '@/components/pricing';
import Header from '@/components/seo-header2';
import Choosestack from '@/components/stackpart';
import TestimonialsSectiontwo from '@/components/testimonials-section2';

// import './index.scss';

export default function LandingPage() {
  const menuItems = [
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
              Ship HIPAA-Compliant Healthcare Apps 10x Faster
            </h1>
            <p className="text-base md:text-lg mb-6">
              Automated vulnerability scanning for 8+ frameworks. <br />Fix HIPAA compliance issues before deployment - not after violations.

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
              className="underline text-1xl font-extrabold text-[#60c0df]">View Live Demo</a>

            </div>
            {/* User Rating */}
            <div className="flex items-center gap-3 mt-6">
              
              <div className="text-left">
                <div className="flex items-center text-yellow-400 text-2xl mb-1">
                  ★★★★★
                </div>
                <p className="text-white text-base">5,00+ Healthcare Apps Scanned <br />21,000+ Vulnerabilities Fixed</p>
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
      <section className="py-12 px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto text-center">
        
        <h2 className="text-4xl sm:text-5xl font-bold text-blue-950 mb-2">
          Why Developers Choose HIPAAChecker?
        </h2>
        
        <p className="text-gray-600 max-w-normal mx-auto text-base leading-relaxed mb-11">
          Enhance data security with robust PHI access controls. Ensure compliance with HIPAA regulations effortlessly.
        </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 ">
            {[
              { 
                title: 'Integrate in Minutes', 
                icon: 'integrate.png',
                description: 'Add to your CI/CD pipeline with one command `npm install @hipaachecker/scanner'

            
              },
            
              { 
                title: 'Real-Time Scanning', 
                icon: 'realtime.png',
                description: 'Catch vulnerabilities as you code, not during audits',
              
              },
              { 
                title: 'Framework-Specific Fixes', 
                icon: 'framework.png',
                description: 'Get exact code snippets to fix issues in your language',
                
              },
              { 
                title: 'Compliance Reports', 
                icon: 'report.png',
                description: 'Generate audit-ready documentation automatically',
                
              }
            ].map((item, idx) => (

              <div key={idx} className="flex flex-col items-center text-center px-4 py-6 transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg bg-white rounded-xl">
                <div className="w-100 h-100 mb-4">
                  <Image
                    src={`/images/common/${item.icon}`}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="object-contain w-100 h-100"
                  />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>     

      {/* Stacksection */}      
      <Choosestack/>    

      {/*  Healthcare Facilities Showcase */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-900 py-16  mt-10 mb-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between">
          {/* Left Text */}
          <h2 className="text-white text-3xl sm:text-4xl lg:text-6xl font-semibold text-center lg:text-left mb-8 lg:mb-0">
            Want to see how secure<br className="hidden sm:block" /> your app is?
          </h2>

          {/* Right Buttons */}
          <div className="flex flex-col space-y-4">
            <button className="bg-gradient-to-r from-blue-300 to-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 ease-in-out hover:from-blue-500 hover:to-blue-900 hover:scale-105 hover:shadow-xl"
            onClick={handleGetStartedClick}
            >
              Scan Your Android Apps - Free
            </button>
            <button className="bg-gradient-to-r from-blue-300 to-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 ease-in-out hover:from-blue-500 hover:to-blue-900 hover:scale-105 hover:shadow-xl"
            onClick={handleGetStartedClick}>
              Try Free Scan
            </button>
          </div>
        </div>
      </section>

       {/*  Watch Video */}
      <section className="py-16 px-6 text-center">
       
        <h2 className="text-5xl text-blue-950 font-bold mb-6">See HIPAAChecker in Action</h2>
        <p className="text-gray-500 max-w-xl mx-auto mb-6">
    In under a minute, you’ll understand exactly how we scan and secure your code, your apps, and your patient data.
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
        <p className="mt-6 text-sm text-gray-500 font-normal space-x-4">
            ✅ Upload app or code &nbsp;&nbsp;&nbsp;&nbsp;
            ✅ Get instant scan report &nbsp;&nbsp;&nbsp;&nbsp;
            ✅ Fix vulnerabilities with AI guidance
        </p>
      </section>
      
      {/*  What You Get with HIPAAChecker */}
      <section className="py-20 px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto text-center">
        
        <h2 className="text-4xl sm:text-5xl font-bold text-blue-950 mb-10">
          What You Get with HIPAAChecker?
        </h2>
        

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 ">
            {[
              { 
                title: 'HIPAA Safety Certification', 
                icon: 'safety.png',
                description: 'Full scan for app privacy & security risks, validated against HIPAA safeguards.'
            
              },
            
              { 
                title: 'Advanced Visualization', 
                icon: 'visualization.png',
                description: 'Track vulnerabilities by category, score, and HIPAA rule – instantly.',
              
              },
              { 
                title: 'On-Premise & Cloud Options', 
                icon: 'cloud.png',
                description: 'Scan in the cloud or install Docker for full enterprise data control.',
                
              },
              { 
                title: 'Easy Implementation', 
                icon: 'easy.png',
                description: 'Use plugins built for Android, iOS, Laravel, .NET, Express.js & more.',
                
              }
            ].map((item, idx) => (

              <div key={idx} className="flex flex-col items-center text-center px-4 py-6 transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg bg-white rounded-xl">
                <div className="w-100 h-100 mb-4">
                  <Image
                    src={`/images/common/${item.icon}`}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="object-contain w-100 h-100"
                  />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/*  Pricing */}
      {/* <Pricing /> */}

       {/*  Enterprise */}
      <Enterprise />     

      {/*  Clients */}
      <ClientsSectiontwo />

      {/*  Testimonials */}
      <TestimonialsSectiontwo />

      {/*  CTA */}
      
      <section className="bg-gradient-to-r from-blue-500 to-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between">
          
          {/* Left Text */}
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <h2 className="text-white text-3xl sm:text-4xl lg:text-6xl font-semibold text-left mb-3">
              Ready to Ship Compliant Code?
            </h2>
            <h2 className="text-white text-base sm:text-lg lg:text-xl font-normal text-left">
              Join 1,200+ developers building HIPAA-compliant healthcare apps
            </h2>
          </div>

          {/* Right Buttons */}
          <div className="w-full lg:w-auto flex flex-col space-y-4">
            <button
              className="bg-gradient-to-r from-blue-300 to-blue-600 text-white font-semibold px-12 py-4 rounded-lg transition duration-300 ease-in-out hover:from-blue-500 hover:to-blue-900 hover:scale-105 hover:shadow-xl"
              onClick={handleGetStartedClick}
            >
              Scan Your Android Apps - Free
            </button>
            <button
              className="bg-gradient-to-r from-blue-300 to-blue-600 text-white font-semibold px-12 py-4 rounded-lg transition duration-300 ease-in-out hover:from-blue-500 hover:to-blue-900 hover:scale-105 hover:shadow-xl"
              onClick={handleGetStartedClick}
            >
              Scan Your Source Code (B2B)
            </button>
          </div>

        </div>
      </section>

      {/*  Footer */}
      <Footer/>
      
    </main>
  </>
    
  );
}
