'use client';

import './index.scss';

const TestimonialsSectiontwo = () => {
  const testimonials = [
    {
      id: 1,
      rating: 5,
      headline: 'Great App and Amazing Support!',
      text: 'HIPAAChecker caught 23 vulnerabilities before our compliance audit. Saved us 6 weeks of manual code review.',
      author: {
        name: 'Sarah Chen',
        position:' Lead Developer',
        organization: '@ HealthTech Startup',

      }
    },
    {
      id: 2,
      rating: 5,
      headline: 'Brilliant!',
      text: 'Outstanding support and comprehensive HIPAA compliance features. Our audit preparation time was reduced by 80% using HIPAAChecker',
      author: {
        name: 'Mike Rodriguez',
        position:' DevOps Engineer',
        organization: '@ MedSecure Solutions'

      }
    },
    {
      id: 3,
      rating: 5,
      headline: 'Amazing Option for Saving.',
      text: 'The automated scanning and detailed reporting features make HIPAA compliance straightforward. Highly recommend for any healthcare software.',
      author: {
        name: 'Dr. James Park', 
        position:'CTO ',
        organization: '@ Telehealth Platform'
      }
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`testimonialsSection__star ${i < rating ? 'testimonialsSection__star--filled' : ''}`}
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    ));
  };

  return (
    <section className="testimonialsSection">
      <div className="testimonialsSection__container">
        <p className="text-large text-gray-500 mb-2">What’s Our Clients Said About Us</p>
        <h2 className="testimonialsSection__title">DEVELOPER TESTIMONIALS</h2>

        <div className="testimonialsSection__grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonialsSection__card">
              <div className="testimonialsSection__quoteIcon">
                <span className="quote-mark">❞</span>
              </div>

              <div className="testimonialsSection__rating">
                {renderStars(testimonial.rating)}
              </div>

              <h3 className="testimonialsSection__headline">{testimonial.headline}</h3>
              

              <p className="testimonialsSection__text">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="testimonialsSection__authorName">
                {testimonial.author.name},{testimonial.author.position}
              </div>
                <div className="testimonialsSection__authorOrganization">
                    {testimonial.author.organization}
              
            </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSectiontwo;
