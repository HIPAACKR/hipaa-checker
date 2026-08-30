import { pricingPageMetadata } from '@/data/seo-config';

import PricingClient from './PricingClient';

export const metadata = pricingPageMetadata;

function Pricing() {
  return <PricingClient />;
}

export default Pricing;
