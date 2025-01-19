class Theme {
  constructor($toggle) {
    this.theme = localStorage.getItem('ctv-theme');
    this.toggle = $toggle;
  }

  setTheme() {
    if (this.theme === 'dark') {
      localStorage.setItem('ctv-theme','dark');
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    } else {
      localStorage.setItem('ctv-theme','light');
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    }
  }

  toggleTheme() {
    this.theme = (this.theme === 'dark') ? 'light' : 'dark';
    this.setTheme();
  }
  
  init() {
    this.setTheme();
    this.toggle.addEventListener('click', () => {
      this.toggleTheme();
    });
  };
}