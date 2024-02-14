(() => {

  /* NAV */
  const $nav = document.querySelector('nav');
  const $navLinks = $nav.querySelectorAll('a');
  const $viewBox = document.querySelector('nav > div');
  const $body = document.documentElement || document.body;
  const $sections = document.querySelectorAll('section');

  let windowHeight = window.innerHeight;
  let sectionHeights = [];
  let sumHeight = 0;
  let viewBoxHeight = 0;
  let isSmallScreen = document.body.clientWidth < 768;

  const setState = () => {
    windowHeight = window.innerHeight;
    sectionHeights = [...$sections].map( $section => $section.offsetHeight );
    sumHeight = sectionHeights.reduce((a,b) => a + b);
    viewBoxHeight = `${windowHeight/sumHeight*100}vh`;
    isSmallScreen = document.body.clientWidth < 768;
  };
  const resizeNavLinks = () => {
    sectionHeights.forEach( (height, index) => {
      const h = `${height/sumHeight*100}vh`;
      $navLinks[index].style.height = h;
    });
  };
  const resetNavLinks = () => {
    $navLinks.forEach(($link) => {
      $link.style.height = 'auto';
    }); 
  };
  const resizeViewBox = () => {
    $viewBox.style.height = viewBoxHeight;
  };
  const updateViewBox = () => {
    const top = $body.scrollTop;
    const progress = top / (sumHeight-windowHeight);
    let position = 0;
    let sum = 0;
    for (const [index, height] of sectionHeights.entries()) {
      sum += height;
      if (top < sum) {
        position = index * 0.25;
        if (top + windowHeight > sum) {
          position += (top + windowHeight - sum) / windowHeight * 0.25;
        }
        break;
      }
    }
    $nav.style.setProperty('--scroll-position', `${position*-1}s`);
    $viewBox.style.top = `${(windowHeight-$viewBox.offsetHeight)*progress}px`;
  };
  const setupNav = () => {
    setState();
    resizeNavLinks();
    resizeViewBox();
    updateViewBox();
  };

  ['load','resize','orientationchange'].forEach( e => {
    window.addEventListener(e, () => {
      if (document.body.clientWidth < 768) {
        resetNavLinks();
      } else {
        setupNav();
      }
    });
  });
  document.addEventListener('scroll', () => {
    if (!isSmallScreen) updateViewBox();
  });

  /* MASONRY */
  const $masonry = document.querySelector('.masonry');
  const $codeSpans = $masonry.querySelectorAll('span:not(.keystone)');

  ['load','resize','orientationchange'].forEach( e => {
    window.addEventListener(e, () => {
      $masonry.classList.remove('active');
      $codeSpans.forEach(($span) => {
        $span.style.animation = 'none';
        $span.style.width = 'auto';
        $span.style.height = 'auto';
        $span.style.setProperty('--content-width', `${$span.offsetWidth}px`);
        $span.style.width = '0';
        $span.style.height = '0';
        $span.style.animation = '10s infinite masonry-grow-text';
      });
      $masonry.classList.add('active');
    });
  });

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

  const $containers = document.querySelectorAll('.container');

  $containers.forEach(($container) => {
    $container.addEventListener('transitionend', (e) => {
      if (e.target === $container) {
        if (!isSmallScreen) setupNav();
      }
    });
  });

  /* DRAW CONTAINERS */
  const options = {
    threshold: 0.5
  };
  
  const callback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('draw');
      } else if (entry.target.getBoundingClientRect().top > 0) {
        entry.target.classList.remove('draw');
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);

  $containers.forEach(($container) => {
    $container.classList.remove('draw');
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

})();