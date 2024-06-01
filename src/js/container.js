class Container {
  constructor($element) {
    this.$element = $element;
    this.$content = this.$element.querySelector('.container-content');
  }

  draw(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('draw');
      } else if (entry.target.getBoundingClientRect().top > 0) {
        entry.target.classList.remove('draw');
      }
    });
  }

  init() {
    const observer = new IntersectionObserver(this.draw, {threshold:0.5});
    observer.observe(this.$element);
  }
}