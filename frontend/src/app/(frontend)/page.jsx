import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/button';
import CompliancePainPoints from '@/components/compliance-pain-points';
import ComplianceEngine from '@/components/complianceEngine';
import EnterpriseItems from '@/components/enterprise';
import GainWithHIPAAChecker from '@/components/gainwithhipaachecker';
import Products from '@/components/products';
import SafeguardsItems from '@/components/safeguards-items';
import Section from '@/components/section';
import StartFree from '@/components/start-free';
import Text from '@/components/text';
import TrustedBySection from '@/components/trustedBySection';
import { landingPageMetadata, landingPageStructuredData } from '@/data/seo-config';
import { landingPage } from '@/data/static-data';

import './style.scss';

export const metadata = landingPageMetadata;

const Home = ({}) => {
  const {
    hero,
    compliancePainPoints,
    safeguards,
    Enterprise,
    keyFeatures,
    solutions,
    facilities,
    product,
    TrustedBySection: trustedByData,
    gainWithHIPAAChecker,
  } = landingPage;

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(landingPageStructuredData) }}
      />
      <div className='home'>
        <div className='home__heroSection'>
          <div className='home__heroSection__container'>
            <div className='home__heroSection__content'>
              <h2 className="home__heroSection__title">
                <span>Automated </span>
                <span className="highlight">HIPAA</span>
                <br />
                <span>Compliance From </span>
                <br />
                <span>Day One</span>
              </h2>
              <Text
                size='fs-20'
                color='neutral-300'
              >
                {hero.description}
              </Text>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <div className="w-full">
                  <Link href="/sign-in" className="block w-full h-full">
                    <Button
                      size="xl"
                      className="w-full h-full flex justify-center items-center"
                      icon="arrowRightWhite"
                      iconPosition="after"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>

                <div className="w-full sm:col-span-2 grid grid-cols-2 gap-4 h-24 sm:h-auto">
                  <Link
                    href="https://play.google.com/store/apps/details?id=health.hipaachecker"
                    target="_blank"
                    className="block w-full h-full"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src="/images/common/play.png"
                        alt="Play Store"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </Link>

                  <Link
                    href="https://apps.apple.com/tj/app/hipaachecker/id6744546178"
                    target="_blank"
                    className="block w-full h-full"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src="/images/common/app_store.png"
                        alt="App Store"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Section className={'home__compliancePainPointsSection'}>
          <CompliancePainPoints data={compliancePainPoints}/>
        </Section>

        <Section className={'home__safeguardsSection'}>
          <div>
            <h2 className='text-3xl md:text-5xl text-[#1D2939] mb-7 text-center'>
              What are HIPAA <span className='font-bold '>Technical Safeguards</span>
            </h2>
          </div>
          <SafeguardsItems />
        </Section>   
        <Section className={'home__productSection'}>
          <div>
            <h2 className='text-3xl md:text-5xl text-[#1D2939]  mb-5 text-center'>
              Our <span className='font-bold '>Products</span>
            </h2>
          </div>
          <Text
            size='fs-24'
            color='neutral-500'
            align='center'
          >
            {product.description}
          </Text>
          <Products />
          </Section>

          <Section className={'home__EnterpriseSection'}>
          <div>
            <h2 className='text-3xl md:text-5xl text-white text-center'>
              <span className='font-bold '>Enterprise On-Premise </span><span className='font-thin '>Solution for HIPAA</span>
            </h2>
             <p>
              An on-premise deployment model designed to provide greater control, security, and alignment with HIPAA requirements.
            </p>
          </div>
          <EnterpriseItems />
        </Section>   
        <Section className={'home__gainSection'}>
          <GainWithHIPAAChecker data={gainWithHIPAAChecker} />
        </Section>
        <Section>
          <ComplianceEngine />
        </Section>
        <Section className={'home__trustedBySection'}>
          <TrustedBySection />
        </Section>
        <StartFree />
      </div>
    </>
  );
};

export default Home;