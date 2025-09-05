import { Footer } from '@/components/Footer/Footer';
import { Header } from '@/components/Header/Header';
import '@/styles/global.scss';
import styles from './about.module.scss';

class AboutPage {
  private header: Header;
  private footer: Footer;

  constructor() {
    this.header = new Header();
    this.footer = new Footer();
    this.init();
  }

  private async init(): Promise<void> {
    this.setupLayout();
    this.header.initializeTheme();
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

  private render(): void {
    const main = document.getElementById('main-content');
    if (!main) return;

    main.innerHTML = `
      ${this.renderHero()}
      ${this.renderAbout()}
      ${this.renderSkills()}
      ${this.renderFocus()}
      ${this.renderContact()}
    `;

    main.classList.add('fade-in');
  }

  private renderHero(): string {
    return `
      <section class="${styles.hero}">
        <div class="${styles.container}">
          <div class="${styles.profile}">
            <img src="https://raw.githubusercontent.com/DTDucas/Resources/main/image-profile/logo-dtducas.svg"
                 alt="DTDucas Logo" class="${styles.logo}" />
            <img src="https://raw.githubusercontent.com/DTDucas/Resources/main/image-profile/meow.svg"
                 alt="Animated Doodle" class="${styles.doodle}" />
          </div>

          <h1 class="${styles.title}">
            Hey there! 👋 I'm <span class="${styles.highlight}">Tran Quang Duong - DTDucas</span>
          </h1>

          <h2 class="${styles.subtitle}">
            🚀 Construction Tech Innovator | Full-Stack Developer | AI Enthusiast
          </h2>

          <div class="${styles.badges}">
            <a href="https://www.linkedin.com/in/dtducas/" target="_blank" rel="noopener noreferrer">
              <img src="https://img.shields.io/static/v1?message=LinkedIn&logo=linkedin&label=&color=0077B5&logoColor=white&labelColor=&style=for-the-badge" alt="LinkedIn" />
            </a>
            <a href="mailto:baymax.contact@gmail.com" target="_blank">
              <img src="https://img.shields.io/static/v1?message=Gmail&logo=gmail&label=baymax.contact@gmail.com&color=D14836&logoColor=white&labelColor=&style=for-the-badge" alt="Gmail" />
            </a>
          </div>
        </div>
      </section>
    `;
  }

  private renderAbout(): string {
    return `
      <section class="${styles.about}">
        <div class="${styles.container}">
          <h2 class="${styles.sectionTitle}">👨‍💻 About Me</h2>

          <div class="${styles.content}">
            <p>
              I'm a passionate technologist from Vietnam, specializing in construction automation and AI applications.
            </p>

            <div class="${styles.details}">
              <div class="${styles.detail}">
                <span class="${styles.icon}">🏗️</span>
                <div>
                  <strong>Currently working as:</strong> Construction Tech Developer & BIM Automation Specialist
                </div>
              </div>

              <div class="${styles.detail}">
                <span class="${styles.icon}">📚</span>
                <div>
                  <strong>Currently learning:</strong> Advanced AI training techniques & AWS Cloud technologies (preparing for SAA certification)
                </div>
              </div>

              <div class="${styles.detail}">
                <span class="${styles.icon}">🔭</span>
                <div>
                  <strong>Focus areas:</strong> Pointcloud technology, construction automation, and full-stack web development
                </div>
              </div>

              <div class="${styles.detail}">
                <span class="${styles.icon}">🤝</span>
                <div>
                  <strong>Open to collaborate on:</strong> Construction software, pointcloud applications, web development, and AI automation projects
                </div>
              </div>

              <div class="${styles.detail}">
                <span class="${styles.icon}">⚡</span>
                <div>
                  <strong>Fun fact:</strong> Always experimenting with new technologies to create community-beneficial solutions
                </div>
              </div>

              <div class="${styles.detail}">
                <span class="${styles.icon}">💬</span>
                <div>
                  <strong>Ask me about:</strong> BIM automation, pointcloud processing, web development, or any programming topics!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  private renderSkills(): string {
    const skills = [
      { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
      { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
      { name: 'C#', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
      { name: '.NET', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original-wordmark.svg' },
      { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
      { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-line-wordmark.svg' },
      { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original-wordmark.svg' },
      { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
      { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
      { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' }
    ];

    return `
      <section class="${styles.skills}">
        <div class="${styles.container}">
          <h2 class="${styles.sectionTitle}">🛠 Languages and Tools</h2>

          <div class="${styles.skillsGrid}">
            ${skills.map(skill => `
              <div class="${styles.skillCard}">
                <img src="${skill.icon}" alt="${skill.name}" class="${styles.skillIcon}" />
                <span class="${styles.skillName}">${skill.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  private renderFocus(): string {
    return `
      <section class="${styles.focus}">
        <div class="${styles.container}">
          <h2 class="${styles.sectionTitle}">🎯 Current Focus</h2>

          <div class="${styles.focusGrid}">
            <div class="${styles.focusCard}">
              <div class="${styles.focusIcon}">🏗️</div>
              <h3>Construction Tech</h3>
              <p>BIM automation addins, plugins, and AI solutions</p>
            </div>

            <div class="${styles.focusCard}">
              <div class="${styles.focusIcon}">🔍</div>
              <h3>Pointcloud Technology</h3>
              <p>Processing algorithms and 3D data analysis</p>
            </div>

            <div class="${styles.focusCard}">
              <div class="${styles.focusIcon}">🌐</div>
              <h3>Web Development</h3>
              <p>Full-stack applications and modern web technologies</p>
            </div>

            <div class="${styles.focusCard}">
              <div class="${styles.focusIcon}">🤖</div>
              <h3>Automation</h3>
              <p>Social media tools, data crawling, and workflow optimization</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  private renderContact(): string {
    return `
      <section class="${styles.contact}">
        <div class="${styles.container}">
          <h2 class="${styles.sectionTitle}">💫 Let's Connect and Build Something Amazing Together!</h2>
          <p class="${styles.quote}">
            <em>"Technology is best when it brings people together and solves real-world problems."</em>
          </p>

          <div class="${styles.contactActions}">
            <a href="mailto:baymax.contact@gmail.com" class="${styles.contactButton} ${styles.primary}">
              Get In Touch
            </a>
            <a href="https://github.com/DTDucas" class="${styles.contactButton} ${styles.secondary}" target="_blank" rel="noopener noreferrer">
              View GitHub
            </a>
          </div>
        </div>
      </section>
    `;
  }
}

// Initialize the page
new AboutPage();
