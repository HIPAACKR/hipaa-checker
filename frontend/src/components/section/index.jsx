import './index.scss';

const Section = ({ children, id, isFullwidth = false, className }) => {
  return (
    <section
      className={`section ${className}`}
      id={id}
    >
      <div
        className={'section__container'}
        data-full-width={isFullwidth}
      >
        {children}
      </div>
    </section>
  );
};

export default Section;