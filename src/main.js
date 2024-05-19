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

  /* SCENE */
  const $scene = document.querySelector('.scene');
  const $tiles = $scene.querySelectorAll('.tile');
  const $back = document.querySelector('.stage .back');

  const setCurrentTile = (index) => {
    const $tile = $tiles[index];
    const translate = `translateZ(${$tile.dataset.translate})`;
    $scene.style.setProperty('transform',translate);

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

    $scene.querySelector('.current').classList.remove('current');
    $tile.classList.add('current');

    if (index >= $tiles.length - 1) {
      $back.classList.add('hide');
    } else {
      $back.classList.remove('hide');
    }
  };

  $tiles.forEach(($tile,index) => {
    $tile.addEventListener('click', () => {
      setCurrentTile(index);
    });
  });

  $back.addEventListener('click', () => {
    const $current = $scene.querySelector('.current');
    const index = [...$current.parentNode.children].indexOf($current);
    if (index < $tiles.length) {
      setCurrentTile(index);
    }
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

  const $contents = document.querySelectorAll('.container-content');

  $contents.forEach(($content) => {
    $content.addEventListener('transitionend', (e) => {
      if (e.target === $content) {
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

  const $containers = document.querySelectorAll('.container');
  const observer = new IntersectionObserver(callback, options);

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

})();