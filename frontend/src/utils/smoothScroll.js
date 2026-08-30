const smoothScroll = (event, link) => {
  event.preventDefault();
  const target = document.querySelector(link);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};

export default smoothScroll;
