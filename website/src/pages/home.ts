import { Footer } from '@/components/Footer/Footer';
import { Header } from '@/components/Header/Header';
import { config } from '@/config';
import '@/styles/global.scss';
import { Problem, ProblemStats } from '@/types';
import styles from './home.module.scss';

class HomePage {
  private header: Header;
  private footer: Footer;
  private problems: Problem[] = [];
  private stats: ProblemStats = { total: 0, easy: 0, medium: 0, hard: 0 };

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
      const response = await fetch(`${config.baseUrl}/src/data/problems.json`);
      if (response.ok) {
        this.problems = await response.json();
      }
      this.calculateStats();
    } catch (error) {
      this.problems = [];
    }
  }

  private calculateStats(): void {
    this.stats = {
      total: this.problems.length,
      easy: this.problems.filter(p => p.difficulty === 'Easy').length,
      medium: this.problems.filter(p => p.difficulty === 'Medium').length,
      hard: this.problems.filter(p => p.difficulty === 'Hard').length
    };
  }

  private render(): void {
    const main = document.getElementById('main-content');
    if (!main) return;

    main.innerHTML = `
      ${this.renderHero()}
      ${this.renderFeatures()}
      ${this.renderStats()}
      ${this.renderCTA()}
    `;

    main.classList.add('fade-in');
  }

  private renderHero(): string {
    return `
      <section class="${styles.hero}">
        <div class="container ${styles.container}">
          <h1 class="${styles.title}">
            Welcome to <span class="${styles.highlight}">DTDucas</span>
          </h1>
          <p class="${styles.subtitle}">
            Software Engineer & Problem Solver. Passionate about clean code, algorithms, and continuous learning.
            Explore my journey through programming challenges and technical insights.
          </p>
          <div class="${styles.cta}">
            <a href="/dtducas-leetcode/problems.html" class="${styles.button} ${styles.primary}">
              Explore Projects
            </a>
            <a href="/dtducas-leetcode/about.html" class="${styles.button} ${styles.secondary}">
              About Me
            </a>
          </div>
        </div>
      </section>
    `;
  }

  private renderFeatures(): string {
    return `
      <section class="${styles.features}">
        <div class="${styles.container}">
          <h2 class="${styles.sectionTitle}">What I Do</h2>
          <p class="${styles.sectionSubtitle}">
            Passionate about solving complex problems with elegant, efficient solutions
          </p>

          <div class="${styles.grid}">
            <div class="${styles.card}">
              <div class="${styles.icon}">💻</div>
              <h3 class="${styles.title}">Algorithm Solutions</h3>
              <p class="${styles.description}">
                Clean, optimized solutions to challenging algorithmic problems with detailed explanations and multiple approaches.
              </p>
              <a href="/dtducas-leetcode/problems.html" class="${styles.link}">
                View Solutions →
              </a>
            </div>

            <div class="${styles.card}">
              <div class="${styles.icon}">📝</div>
              <h3 class="${styles.title}">Technical Writing</h3>
              <p class="${styles.description}">
                In-depth blog posts explaining problem-solving techniques, complexity analysis, and programming insights.
              </p>
              <a href="/dtducas-leetcode/blog.html" class="${styles.link}">
                Read Blog →
              </a>
            </div>

            <div class="${styles.card}">
              <div class="${styles.icon}">🚀</div>
              <h3 class="${styles.title}">Continuous Learning</h3>
              <p class="${styles.description}">
                Documenting my journey of growth as a software engineer through challenging problems and new technologies.
              </p>
              <a href="/dtducas-leetcode/about.html" class="${styles.link}">
                About Me →
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  private renderStats(): string {
    return `
      <section class="${styles.stats}">
        <div class="${styles.container}">
          <div class="${styles.grid}">
            <div class="${styles.statCard}">
              <div class="${styles.number}">${this.stats.total}</div>
              <div class="${styles.label}">Problems Solved</div>
              <div class="${styles.sublabel}">Total Completed</div>
            </div>

            <div class="${styles.statCard}">
              <div class="${styles.number}">${this.stats.easy}</div>
              <div class="${styles.label}">Easy Level</div>
              <div class="${styles.sublabel}">Completed</div>
            </div>

            <div class="${styles.statCard}">
              <div class="${styles.number}">${this.stats.medium}</div>
              <div class="${styles.label}">Medium Level</div>
              <div class="${styles.sublabel}">Completed</div>
            </div>

            <div class="${styles.statCard}">
              <div class="${styles.number}">${this.stats.hard}</div>
              <div class="${styles.label}">Hard Level</div>
              <div class="${styles.sublabel}">Completed</div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  private renderRecentProblems(): string {
    const recentProblems = this.problems.slice(0, 3);

    return `
      <section class="${styles.recentProblems}">
        <div class="container">
          <div class="${styles.sectionHeader}">
            <h2 class="${styles.title}">Recent Solutions</h2>
            <p class="${styles.subtitle}">
              Latest problems I've tackled with detailed explanations and optimized code
            </p>
          </div>

          <div class="${styles.problemGrid}">
            ${recentProblems.map(problem => this.renderProblemCard(problem)).join('')}
          </div>
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

        <h3 class="${styles.title}">
          <a href="${problem.blogLink || '#'}">${problem.title}</a>
        </h3>

        <div class="${styles.meta}">
          <div class="${styles.tags}">
            ${problem.tags?.map(tag => `<span class="${styles.tag}">${tag}</span>`).join('') || ''}
          </div>
        </div>

        <div class="${styles.actions}">
          <a href="${problem.solutionLink}" class="${styles.link} ${styles.code}" target="_blank">
            View Code
          </a>
          ${problem.blogLink ? `
            <a href="${problem.blogLink}" class="${styles.link} ${styles.blog}">
              Read Solution
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }

  private renderCTA(): string {
    return `
      <section class="${styles.cta}">
        <div class="container">
          <h2 class="${styles.title}">Ready to Explore?</h2>
          <p class="${styles.subtitle}">
            Dive deeper into my solutions and learn about different approaches to solving algorithmic challenges.
          </p>
          <div class="${styles.buttons}">
            <a href="/dtducas-leetcode/problems.html" class="${styles.button} ${styles.primary}">
              Browse All Problems
            </a>
            <a href="/dtducas-leetcode/about.html" class="${styles.button} ${styles.secondary}">
              About My Journey
            </a>
          </div>
        </div>
      </section>
    `;
  }
}

// Initialize the page
new HomePage();
