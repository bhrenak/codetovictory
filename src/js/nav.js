class Nav {
  constructor($container) {
    this.$nav = $container;
    this.$navTabs = this.$nav.querySelectorAll('a');
    this.$tabMarker = document.querySelector('nav > div');
    this.$sections = document.querySelectorAll('section');
    this.sectionRatio = 1/this.$sections.length;
  }

  setupNav() {
    this.$sections.forEach(($section,index) => {
      const observer = new IntersectionObserver( (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.$tabMarker.style.setProperty('transform',`translateY(${this.sectionRatio * index * 100}vh)`);
            this.$tabMarker.style.setProperty('--active-color', `${index * this.sectionRatio * -1}s`);
          }
        });
      },{threshold:0.5});
      observer.observe($section);
    });
  }

  init() {
    this.setupNav();
  }
}