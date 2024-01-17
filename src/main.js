(() => {

  /* NAV */
  const $navLinks = document.querySelectorAll( 'a' );
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
  const moveViewBox = () => {
    const top = $wrapper.scrollTop/(sumHeight-windowHeight);
    $viewBox.style.top = `${(windowHeight-$viewBox.offsetHeight)*top}px`;
  };
  const setupNav = () => {
    setWindowHeight();
    setSectionHeights();
    setSumHeight();
    setViewBoxHeight();
    resizeNavLinks();
    resizeViewBox();
    moveViewBox();
  };

  ['load','resize','orientationchange'].forEach( e => {
    window.addEventListener(e, () => {
      isSmallScreen = document.body.clientWidth < 768;
      if (isSmallScreen) {
        resetNavLinks();
      } else {
        setupNav();
      }
    });
  });
  $wrapper.addEventListener('scroll', () => {
    if (!isSmallScreen) moveViewBox();
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