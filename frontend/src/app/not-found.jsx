import Footer from '@/components/footer';
import Header from '@/components/header';
import NotFoundComponent from '@/components/not-found';

import './not-found.scss';

export default function NotFound() {
  return (
    <div className='notFoundPage'>
      <Header />
      <NotFoundComponent />
      <Footer />
    </div>
  );
}
