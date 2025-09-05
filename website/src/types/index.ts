export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  solutionLink: string;
  blogLink?: string;
  tags?: string[];
  completedAt?: string;
}

export interface ProblemStats {
  total: number;
  easy: number;
  medium: number;
  hard: number;
}

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  url: string;
  difficulty: string;
}
