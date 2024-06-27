class Nav {
  constructor($container) {
    this.$body = document.documentElement || document.body;
    this.$nav = $container;
    this.$navLinks = this.$nav.querySelectorAll('a');
    this.$viewBox = document.querySelector('nav > div');
    this.$sections = document.querySelectorAll('section');
    this.measureState();
  }

  measureState() {
    this.windowHeight = window.innerHeight;
    this.sectionHeights = [...this.$sections].map( $section => $section.offsetHeight );
    this.sumHeight = this.sectionHeights.reduce((a,b) => a + b);
    this.viewBoxHeight = `${this.windowHeight/this.sumHeight*100}vh`;
    this.isSmallScreen = document.body.clientWidth < 768;
  }

  resizeNavLinks() {
    this.sectionHeights.forEach( (height, index) => {
      const h = `${height/this.sumHeight*100}vh`;
      this.$navLinks[index].style.height = h;
    });
  }
  
  resetNavLinks() {
    this.$navLinks.forEach(($link) => {
      $link.style.height = 'auto';
    }); 
  }
  
  resizeViewBox() {
    this.$viewBox.style.height = this.viewBoxHeight;
  }
  
  updateViewBox() {
    const top = this.$body.scrollTop;
    const progress = top / (this.sumHeight - this.windowHeight);
    let position = 0;
    let above = 0;
    for (const [index, height] of this.sectionHeights.entries()) {
      above += height;
      if (top < above && top + this.windowHeight > above) {
        position = index * 0.25;
        position += (top + this.windowHeight - above) / this.windowHeight * 0.25;
        break;
      }
    }
    requestAnimationFrame(() => {
      this.$viewBox.style.setProperty('--active-color', `${position*-1}s`);
      this.$viewBox.style.setProperty('--scroll-translate', `translateY(${(this.windowHeight - this.$viewBox.offsetHeight) * progress}px)`);
    });
  }

  setupNav() {
    this.measureState();
    this.resizeNavLinks();
    this.resizeViewBox();
    this.updateViewBox();
  }

  init() {
    ['load','resize','orientationchange'].forEach( e => {
      window.addEventListener(e, () => {
        if (document.body.clientWidth < 768) {
          this.resetNavLinks();
        } else {
          this.setupNav();
        }
      });
    });
    document.addEventListener('scroll', () => {
      if (!this.isSmallScreen) this.updateViewBox();
    });
    const observer = new ResizeObserver( () => { 
      if (document.body.clientWidth >= 768) {
        this.setupNav();
      }
    });
    observer.observe(document.body);
  }
}