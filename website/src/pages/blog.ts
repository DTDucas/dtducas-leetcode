import { Footer } from '@/components/Footer/Footer';
import { Header } from '@/components/Header/Header';
import '@/styles/global.scss';
import { BlogPost } from '@/types';
import styles from './blog.module.scss';

class BlogPage {
  private header: Header;
  private footer: Footer;
  private posts: BlogPost[] = [];

  constructor() {
    this.header = new Header();
    this.footer = new Footer();
    this.init();
  }

  private async init(): Promise<void> {
    this.setupLayout();
    this.header.initializeTheme();
    await this.loadPosts();
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

  private async loadPosts(): Promise<void> {
    try {
      const response = await fetch('/src/data/problems.json');
      if (response.ok) {
        const problems = await response.json();
        this.posts = problems
          .filter((p: any) => p.blogLink)
          .map((p: any) => ({
            id: p.id,
            title: p.title,
            date: p.completedAt,
            excerpt: p.description || `Solution for ${p.title}`,
            url: p.blogLink,
            difficulty: p.difficulty
          }));
      }
    } catch (error) {
      this.posts = [];
    }
  }

  private render(): void {
    const main = document.getElementById('main-content');
    if (!main) return;

    main.innerHTML = `
      ${this.renderHero()}
      ${this.renderPosts()}
    `;

    main.classList.add('fade-in');
  }

  private renderHero(): string {
    return `
      <section class="${styles.hero}">
        <div class="${styles.container}">
          <h1 class="${styles.title}">Technical Blog</h1>
          <p class="${styles.subtitle}">
            In-depth explanations of algorithms, data structures, and problem-solving techniques
          </p>
        </div>
      </section>
    `;
  }

  private renderPosts(): string {
    return `
      <section class="${styles.posts}">
        <div class="${styles.container}">
          <div class="${styles.grid}">
            ${this.posts.map(post => this.renderPostCard(post)).join('')}
          </div>

          ${this.posts.length === 0 ? `
            <div class="${styles.noPosts}">
              <h3>No blog posts yet</h3>
              <p>Check back soon for detailed algorithm explanations and solutions!</p>
              <a href="/" class="${styles.backButton}">← Back to Home</a>
            </div>
          ` : ''}
        </div>
      </section>
    `;
  }

  private renderPostCard(post: BlogPost): string {
    return `
      <article class="${styles.postCard}">
        <div class="${styles.postMeta}">
          <time>${new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</time>
          <span class="difficulty ${post.difficulty.toLowerCase()}">${post.difficulty}</span>
        </div>

        <h2 class="${styles.postTitle}">
          <a href="${post.url}">${post.title}</a>
        </h2>

        <p class="${styles.postExcerpt}">${post.excerpt}</p>

        <div class="${styles.postActions}">
          <a href="${post.url}" class="${styles.readMore}">Read More →</a>
        </div>
      </article>
    `;
  }
}

// Initialize the page
new BlogPage();
