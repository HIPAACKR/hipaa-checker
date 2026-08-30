import StartFree from '@/components/start-free';

import './layout.scss';

export default function DownloadLayout({ children }) {
  return (
    <>
      <main>{children}</main>
      <StartFree />
    </>
  );
}
