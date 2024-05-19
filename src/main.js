(() => {

  class Nav {
    constructor() {
      this.$body = document.documentElement || document.body;
      this.$nav = document.querySelector('nav');
      this.$navLinks = this.$nav.querySelectorAll('a');
      this.$viewBox = document.querySelector('nav > div');
      this.$sections = document.querySelectorAll('section');
      this.windowHeight = window.innerHeight;
      this.sectionHeights = [];
      this.sumHeight = 0;
      this.viewBoxHeight = 0;
      this.isSmallScreen = document.body.clientWidth < 768;
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

  class Scene {
    constructor($stage) {
      this.$scene = $stage.querySelector('.scene');
      this.$tiles = $stage.querySelectorAll('.tile');
      this.$back = $stage.querySelector('.back');
    }

    setCurrentTile(index) {
      const $tile = this.$tiles[index];
      const translate = `translateZ(${$tile.dataset.translate})`;
      this.$scene.style.setProperty('transform',translate);
  
      let $prevTile = $tile;
      while($prevTile) {
        $prevTile.classList.remove('fade-tile');
        $prevTile = $prevTile.previousElementSibling;
      }
      let $nextTile = $tile.nextElementSibling;
      while($nextTile) {
        $nextTile.classList.add('fade-tile');
        $nextTile = $nextTile.nextElementSibling;
      }
  
      this.$scene.querySelector('.current').classList.remove('current');
      $tile.classList.add('current');
  
      if (index >= this.$tiles.length - 1) {
        this.$back.classList.add('hide');
      } else {
        this.$back.classList.remove('hide');
      }
    }

    init() {
      this.$tiles.forEach(($tile,index) => {
        $tile.addEventListener('click', () => {
          this.setCurrentTile(index);
        });
      });
    
      this.$back.addEventListener('click', () => {
        const $current = this.$scene.querySelector('.current');
        const index = [...$current.parentNode.children].indexOf($current);
        if (index < this.$tiles.length) {
          this.setCurrentTile(index);
        }
      });
    }
  }

  /* COLLAPSIBLE CONTAINERS */
  const $sectionToggles = document.querySelectorAll('button.section-toggle');

  $sectionToggles.forEach(($toggle) => {
    $toggle.addEventListener('click', (e) => {
      const $button = e.target;
      const collapsed = ($button.dataset.collapsed === 'true');
      const $inputs = e.target.closest('section').querySelectorAll('input[type="checkbox"].container-toggle');
      $inputs.forEach( ($input) => {
        $input.checked = !collapsed;
      });
      $button.dataset.collapsed = !collapsed;
    });
  });

  const $contents = document.querySelectorAll('.container-content');

  $contents.forEach(($content) => {
    $content.addEventListener('transitionend', (e) => {
      if (e.target === $content) {
        if (!nav.isSmallScreen) nav.setupNav();
      }
    });
  });

  /* DRAW CONTAINERS */
  const draw = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('draw');
      } else if (entry.target.getBoundingClientRect().top > 0) {
        entry.target.classList.remove('draw');
      }
    });
  };

  const $containers = document.querySelectorAll('.container');
  const observer = new IntersectionObserver(draw, {threshold:0.5});

  $containers.forEach(($container) => {
    observer.observe($container);
  });

  /* THEME TOGGLE */
  const $themeToggle = document.querySelector('.theme-toggle button');

  $themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
  });

  /* LOADING SCREEN */
  window.addEventListener('load', () => {
    document.querySelector('#overlay').classList.add('hide');
  });

  const nav = new Nav();
  nav.init();
  const scene = new Scene(document.querySelector('.stage'));
  scene.init();

})();