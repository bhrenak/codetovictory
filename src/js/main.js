import {createTheme, createNav, createGallery, createContainer, createToggle} from "/modules.min.js";

(() => {
  // Setup features
  createTheme(document.querySelector('.theme-toggle button'));
  createNav(document.querySelector('nav'));
  createGallery(document.querySelector('.stage'));
  document.querySelectorAll('.container').forEach(($container) => {
    createContainer($container);
  });
  document.querySelectorAll('.section-toggle').forEach(($toggle) => {
    createToggle($toggle);
  });

  // Hide loading screen
  window.addEventListener('load', () => {
    document.querySelector('#overlay').classList.add('hide');
  });
})();