(() => {

  const hideLoadingScreen = () => {
    window.addEventListener('load', () => {
      document.querySelector('#overlay').classList.add('hide');
    });
  };

  const setupSectionToggling = () => {
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
  };

  /* SETUP COMPONENTS */
  hideLoadingScreen();
  setupSectionToggling();

  const theme = new Theme(document.querySelector('.theme-toggle button'));
  theme.init();
  
  const nav = new Nav(document.querySelector('nav'));
  nav.init();

  const gallery = new Gallery(document.querySelector('.stage'));
  gallery.init();

  const $containers = document.querySelectorAll('.container');
  $containers.forEach(($container) => {
    const container = new Container($container);
    container.init();
  });

})();