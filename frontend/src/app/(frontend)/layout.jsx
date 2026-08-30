import Script from 'next/script';

import Footer from '@/components/footer';
import Header from '@/components/header';

import '@/design/styles/index.scss';
import './layout.scss';

export const metadata = {
  title: 'HIPAAChecker',
  description: 'Hipaa Checker application',
};

export default function FrontendLayout({ children }) {
  return (
    <>
      {/* Google Analytics - GA4 */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-BB46XEW6QE"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BB46XEW6QE');
        `}
      </Script>

      <div className={`frontendLayout`}>
        <div className='frontendLayout__header-section'>
          <Header />
        </div>

        <main className='frontendLayout__main'>{children}</main>

        <Footer />
      </div>
    </>
  );
}
