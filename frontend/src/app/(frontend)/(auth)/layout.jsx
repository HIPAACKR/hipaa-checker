import { authPageMetadata } from '@/data/seo-config';

export const metadata = authPageMetadata;

export default function AuthLayout({ children }) {
  return <>{children}</>;
}
