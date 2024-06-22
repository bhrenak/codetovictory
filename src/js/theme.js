class Theme {
  constructor($toggle) {
    this.theme = localStorage.getItem('ctv-theme');
    this.toggle = $toggle;
  }

  setTheme() {
    if (this.theme === 'light') {
      localStorage.setItem('ctv-theme','light');
      document.body.classList.remove('theme-dark');
    } else {
      localStorage.setItem('ctv-theme','dark');
      document.body.classList.add('theme-dark');
    }
  }

  toggleTheme() {
    this.theme = (this.theme === 'light') ? 'dark' : 'light';
    this.setTheme();
  }
  
  init() {
    this.setTheme();
    this.toggle.addEventListener('click', () => {
      this.toggleTheme();
    });
  };
}