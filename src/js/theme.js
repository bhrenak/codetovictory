function setTheme(theme) {
  if (theme === 'dark') {
    localStorage.setItem('ctv-theme','dark');
    document.body.classList.add('theme-dark');
    document.body.classList.remove('theme-light');
  } else {
    localStorage.setItem('ctv-theme','light');
    document.body.classList.add('theme-light');
    document.body.classList.remove('theme-dark');
  }
}

function toggleTheme() {
  let theme = localStorage.getItem('ctv-theme');
  theme = (theme === 'dark') ? 'light' : 'dark';
  setTheme(theme);
}

export function createTheme($toggle) {
  const theme = localStorage.getItem('ctv-theme');
  setTheme(theme);
  $toggle.addEventListener('click', toggleTheme);
}