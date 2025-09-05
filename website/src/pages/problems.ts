import { Footer } from '@/components/Footer/Footer';
import { Header } from '@/components/Header/Header';
import '@/styles/global.scss';
import { Problem } from '@/types';
import styles from './problems.module.scss';

class ProblemsPage {
  private header: Header;
  private footer: Footer;
  private problems: Problem[] = [];
  private filteredProblems: Problem[] = [];
  private currentFilter = 'all';

  constructor() {
    this.header = new Header();
    this.footer = new Footer();
    this.init();
  }

  private async init(): Promise<void> {
    this.setupLayout();
    this.header.initializeTheme();
    await this.loadProblems();
    this.render();
    this.bindEvents();
  }

  private setupLayout(): void {
    const app = document.getElementById('app');
    if (!app) return;

    // Clear existing content
    app.innerHTML = '';

    // Add header
    app.appendChild(this.header.render());

    // Add main content container
    const main = document.createElement('main');
    main.id = 'main-content';
    app.appendChild(main);

    // Add footer
    app.appendChild(this.footer.render());
  }

  private async loadProblems(): Promise<void> {
    try {
      const response = await fetch('/src/data/problems.json');
      if (response.ok) {
        this.problems = await response.json();
      }
      this.filteredProblems = [...this.problems];
    } catch (error) {
      this.problems = [];
      this.filteredProblems = [];
    }
  }

  private render(): void {
    const main = document.getElementById('main-content');
    if (!main) return;

    main.innerHTML = `
      ${this.renderHero()}
      ${this.renderFilters()}
      ${this.renderProblems()}
    `;

    main.classList.add('fade-in');
  }

  private renderHero(): string {
    const stats = {
      total: this.problems.length,
      easy: this.problems.filter(p => p.difficulty === 'Easy').length,
      medium: this.problems.filter(p => p.difficulty === 'Medium').length,
      hard: this.problems.filter(p => p.difficulty === 'Hard').length
    };

    return `
      <section class="${styles.hero}">
        <div class="${styles.container}">
          <h1 class="${styles.title}">LeetCode Projects</h1>
          <p class="${styles.subtitle}">
            My journey through algorithmic challenges with clean, optimized solutions
          </p>

          <div class="${styles.stats}">
            <div class="${styles.stat}">
              <span class="${styles.number}">${stats.total}</span>
              <span class="${styles.label}">Total</span>
            </div>
            <div class="${styles.stat}">
              <span class="${styles.number}">${stats.easy}</span>
              <span class="${styles.label}">Easy</span>
            </div>
            <div class="${styles.stat}">
              <span class="${styles.number}">${stats.medium}</span>
              <span class="${styles.label}">Medium</span>
            </div>
            <div class="${styles.stat}">
              <span class="${styles.number}">${stats.hard}</span>
              <span class="${styles.label}">Hard</span>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  private renderFilters(): string {
    return `
      <section class="${styles.filters}">
        <div class="${styles.container}">
          <div class="${styles.filterButtons}">
            <button class="${styles.filterButton} ${this.currentFilter === 'all' ? styles.active : ''}" data-filter="all">
              All Problems
            </button>
            <button class="${styles.filterButton} ${this.currentFilter === 'easy' ? styles.active : ''}" data-filter="easy">
              Easy
            </button>
            <button class="${styles.filterButton} ${this.currentFilter === 'medium' ? styles.active : ''}" data-filter="medium">
              Medium
            </button>
            <button class="${styles.filterButton} ${this.currentFilter === 'hard' ? styles.active : ''}" data-filter="hard">
              Hard
            </button>
          </div>
        </div>
      </section>
    `;
  }

  private renderProblems(): string {
    return `
      <section class="${styles.problems}">
        <div class="${styles.container}">
          <div class="${styles.grid}" id="problems-grid">
            ${this.filteredProblems.map(problem => this.renderProblemCard(problem)).join('')}
          </div>

          ${this.filteredProblems.length === 0 ? `
            <div class="${styles.noProblems}">
              <h3>No problems found</h3>
              <p>Try adjusting your filters or check back later for new solutions!</p>
            </div>
          ` : ''}
        </div>
      </section>
    `;
  }

  private renderProblemCard(problem: Problem): string {
    return `
      <div class="${styles.problemCard}">
        <div class="${styles.header}">
          <span class="${styles.problemNumber}">Problem ${problem.id}</span>
          <span class="difficulty ${problem.difficulty.toLowerCase()}">${problem.difficulty}</span>
        </div>

        <h3 class="${styles.title}">${problem.title}</h3>

        <div class="${styles.tags}">
          ${problem.tags?.map(tag => `<span class="${styles.tag}">${tag}</span>`).join('') || ''}
        </div>

        <div class="${styles.meta}">
          <span class="${styles.date}">Completed: ${new Date(problem.completedAt || '').toLocaleDateString()}</span>
        </div>

        <div class="${styles.actions}">
          <a href="${problem.solutionLink}" class="${styles.button} ${styles.code}" target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="16,18 22,12 16,6"></polyline>
              <polyline points="8,6 2,12 8,18"></polyline>
            </svg>
            View Code
          </a>

          ${problem.blogLink ? `
            <a href="${problem.blogLink}" class="${styles.button} ${styles.blog}">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              Read Solution
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    // Filter buttons
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        const filter = target.dataset.filter;
        if (filter) {
          this.filterProblems(filter);
        }
      });
    });
  }

  private filterProblems(filter: string): void {
    this.currentFilter = filter;

    if (filter === 'all') {
      this.filteredProblems = [...this.problems];
    } else {
      this.filteredProblems = this.problems.filter(p =>
        p.difficulty.toLowerCase() === filter.toLowerCase()
      );
    }

    // Update filter buttons
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
      button.classList.remove(styles.active);
      if (button.getAttribute('data-filter') === filter) {
        button.classList.add(styles.active);
      }
    });

    // Update problems grid
    const grid = document.getElementById('problems-grid');
    if (grid) {
      grid.innerHTML = this.filteredProblems.map(problem => this.renderProblemCard(problem)).join('');
    }
  }
}

// Initialize the page
new ProblemsPage();
