// Environment configuration
const isProduction = import.meta.env.PROD;

export const config = {
  // Base URLs
  baseUrl: '/dtducas-leetcode',

  // Site URLs
  siteUrl: isProduction
    ? 'https://dtducas.github.io/dtducas-leetcode'
    : 'http://localhost:3000/dtducas-leetcode',

  blogUrl: isProduction
    ? 'https://dtducas.github.io/dtducas-leetcode/blog'
    : 'http://localhost:4000/dtducas-leetcode/blog',

  // GitHub
  githubRepo: 'https://github.com/DTDucas/dtducas-leetcode',
  githubUser: 'DTDucas',

  // Contact
  email: 'baymax.contact@gmail.com',
  linkedin: 'https://linkedin.com/in/dtducas',

  // LeetCode
  leetcodeProfile: 'https://leetcode.com/dtducas',

  // API endpoints
  api: {
    problems: '/src/data/problems.json',
    stats: '/src/data/stats.json'
  },

  // Site metadata
  site: {
    title: 'DTDucas',
    description: 'Software Engineer & Problem Solver. Passionate about clean code, algorithms, and continuous learning.',
    author: 'Tran Quang Duong (DTDucas)',
    keywords: 'leetcode, algorithms, data structures, programming, c#, python, coding interview'
  }
};

// Helper functions
export const getAbsoluteUrl = (path: string): string => {
  if (path.startsWith('http')) return path;
  return `${config.siteUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const getBlogUrl = (path: string): string => {
  if (path.startsWith('http')) return path;
  return `${config.blogUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const getGitHubFileUrl = (filePath: string): string => {
  return `${config.githubRepo}/blob/main/${filePath}`;
};
