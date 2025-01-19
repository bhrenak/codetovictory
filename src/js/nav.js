export function createNav($element) {
  const $tabMarker = $element.querySelector('nav > div');
  const $sections = document.querySelectorAll('section');
  const sectionRatio = 1/$sections.length;

  $sections.forEach(($section,index) => {
    const observer = new IntersectionObserver( (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $tabMarker.style.setProperty('transform',`translateY(${sectionRatio * index * 100}vh)`);
          $tabMarker.style.setProperty('--active-color', `${index * sectionRatio * -1}s`);
        }
      });
    },{threshold:0.5});
    observer.observe($section);
  });
}