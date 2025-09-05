import { config, getBlogUrl } from '@/config';
import styles from './Header.module.scss';

export class Header {
  private element: HTMLElement;
  private mobileMenuOpen = false;

  constructor() {
    this.element = this.createElement();
    this.bindEvents();
  }

  private createElement(): HTMLElement {
    const header = document.createElement('header');
    header.className = styles.header;

    const blogUrl = getBlogUrl('/');

    header.innerHTML = `
      <div class="${styles.container}">
        <a href="${config.baseUrl}/" class="${styles.logo}">
          <div class="${styles.icon}">DT</div>
          <span class="${styles.text}">${config.site.title}</span>
        </a>

        <nav class="${styles.nav}">
          <a href="${config.baseUrl}/" class="${styles.navLink}" data-page="home">Home</a>
          <a href="${config.baseUrl}/problems.html" class="${styles.navLink}" data-page="problems">Projects</a>
          <a href="${config.baseUrl}/about.html" class="${styles.navLink}" data-page="about">About</a>
          <a href="${blogUrl}" class="${styles.navLink}" data-page="blog" target="_blank">Blog</a>
        </nav>

        <div class="${styles.actions}">
          <button class="${styles.themeToggle}" id="theme-toggle" aria-label="Toggle theme">
            <svg class="${styles.icon}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          </button>

          <button class="${styles.mobileMenuButton}" id="mobile-menu-toggle" aria-label="Toggle mobile menu">
            <svg class="${styles.icon}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="${styles.mobileMenu}" id="mobile-menu">
        <a href="${config.baseUrl}/" class="${styles.mobileNavLink}" data-page="home">Home</a>
        <a href="${config.baseUrl}/problems.html" class="${styles.mobileNavLink}" data-page="problems">Projects</a>
        <a href="${config.baseUrl}/about.html" class="${styles.mobileNavLink}" data-page="about">About</a>
        <a href="${blogUrl}" class="${styles.mobileNavLink}" data-page="blog" target="_blank">Blog</a>
      </div>
    `;

    return header;
  }

  private bindEvents(): void {
    const themeToggle = this.element.querySelector('#theme-toggle');
    themeToggle?.addEventListener('click', this.toggleTheme.bind(this));

    const mobileMenuToggle = this.element.querySelector('#mobile-menu-toggle');
    mobileMenuToggle?.addEventListener('click', this.toggleMobileMenu.bind(this));

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!this.element.contains(target) && this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    });

    this.element.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[data-page]') as HTMLAnchorElement;

      if (link && this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    });

    this.setActiveNavItem();
  }

  private toggleTheme(): void {
    const body = document.body;
    const isDark = body.classList.contains('dark');

    if (isDark) {
      body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }

    this.updateThemeIcon(!isDark);
  }

  private updateThemeIcon(isDark: boolean): void {
    const themeToggle = this.element.querySelector('#theme-toggle svg');
    if (themeToggle) {
      if (isDark) {
        themeToggle.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        `;
      } else {
        themeToggle.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        `;
      }
    }
  }

  private toggleMobileMenu(): void {
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  private openMobileMenu(): void {
    const mobileMenu = this.element.querySelector('#mobile-menu');
    mobileMenu?.classList.add(styles.open);
    this.mobileMenuOpen = true;
  }

  private closeMobileMenu(): void {
    const mobileMenu = this.element.querySelector('#mobile-menu');
    mobileMenu?.classList.remove(styles.open);
    this.mobileMenuOpen = false;
  }

  private setActiveNavItem(): void {
    const currentPath = window.location.pathname;
    const navLinks = this.element.querySelectorAll('[data-page]');

    navLinks.forEach(link => {
      const linkElement = link as HTMLAnchorElement;
      const page = linkElement.dataset.page;

      linkElement.classList.remove(styles.active);

      if (
        (page === 'home' && (currentPath === '/' || currentPath.includes('/index.html'))) ||
        (page === 'problems' && currentPath.includes('problems')) ||
        (page === 'about' && currentPath.includes('about')) ||
        (page === 'blog' && currentPath.includes('blog'))
      ) {
        linkElement.classList.add(styles.active);
      }
    });
  }

  public initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    if (shouldUseDark) {
      document.body.classList.add('dark');
    }

    this.updateThemeIcon(shouldUseDark);
  }

  public render(): HTMLElement {
    return this.element;
  }
}
