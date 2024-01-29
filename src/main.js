(() => {

  /* NAV */
  const $navLinks = document.querySelectorAll('a');
  const $viewBox = document.querySelector('nav > div');
  const $sections = document.querySelectorAll('section');
  const $wrapper = document.querySelector('.wrapper');

  let windowHeight = window.innerHeight;
  let sectionHeights = [];
  let sumHeight = 0;
  let viewBoxHeight = 0;
  let isSmallScreen = document.body.clientWidth < 768;

  const setWindowHeight = () => {
    windowHeight = window.innerHeight;
  }
  const setSectionHeights = () => {
    sectionHeights = [...$sections].map( $section => $section.offsetHeight );
  };
  const setSumHeight = () => {
    sumHeight = sectionHeights.reduce((a,b) => a + b);
  };
  const setViewBoxHeight = () => {
    viewBoxHeight = `${windowHeight/sumHeight*100}vh`;
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
    const top = $wrapper.scrollTop;
    const progress = top/(sumHeight-windowHeight);
    let position = 0;
    let sum = 0;
    for (const [index, height] of sectionHeights.entries()) {
      sum += height;
      if (top < sum) {
        if (top + windowHeight < sum) {
          position = index * 0.25;
        } else {
          position = index * 0.25 + (top + windowHeight - sum) / windowHeight * 0.25;
        }
        break;
      }
    }
    document.documentElement.style.setProperty('--scroll-position', `${position*-1}s`);
    $viewBox.style.top = `${(windowHeight-$viewBox.offsetHeight)*progress}px`;
  };
  const setupNav = () => {
    setWindowHeight();
    setSectionHeights();
    setSumHeight();
    setViewBoxHeight();
    resizeNavLinks();
    resizeViewBox();
    updateViewBox();
  };

  ['load','resize','orientationchange'].forEach( e => {
    window.addEventListener(e, () => {
      isSmallScreen = document.body.clientWidth < 768;
      if (isSmallScreen) {
        resetNavLinks();
      } else {
        setupNav();
      }
      if (e === 'load') {
        console.log('hiding');
        document.querySelector('#overlay').classList.add('hide');
      }
    });
  });
  $wrapper.addEventListener('scroll', () => {
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
        $span.style.animation = '10s infinite grow-text';
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

  /* THEME TOGGLE */
  const $themeToggle = document.querySelector('.theme-toggle button');

  $themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
  });

})();