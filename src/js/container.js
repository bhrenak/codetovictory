function draw(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('draw');
    } else if (entry.target.getBoundingClientRect().top > 0) {
      entry.target.classList.remove('draw');
    }
  });
}

export function createContainer($element) {
  const $content = $element.querySelector('.container-content');
  const observer = new IntersectionObserver(draw, {threshold:0.5});
  observer.observe($element);
}