class Nav {
  constructor($container) {
    this.$body = document.documentElement || document.body;
    this.$nav = $container;
    this.$navLinks = this.$nav.querySelectorAll('a');
    this.$viewBox = document.querySelector('nav > div');
    this.$sections = document.querySelectorAll('section');
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
    let sum = 0;
    for (const [index, height] of this.sectionHeights.entries()) {
      sum += height;
      if (top < sum) {
        position = index * 0.25;
        if (top + this.windowHeight > sum) {
          position += (top + this.windowHeight - sum) / this.windowHeight * 0.25;
        }
        break;
      }
    }
    this.$body.style.setProperty('--scroll-position', `${position*-1}s`);
    this.$viewBox.style.top = `${(this.windowHeight - this.$viewBox.offsetHeight) * progress}px`;
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
  }
}