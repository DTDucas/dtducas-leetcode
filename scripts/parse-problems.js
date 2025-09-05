const fs = require('fs');
const path = require('path');

class ProblemParser {
  constructor() {
    this.problemsDir = path.join(__dirname, '../problems');
    this.outputDir = path.join(__dirname, '../website/public/data');
    this.blogDir = path.join(__dirname, '../blog/_posts');

    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Parse a single C# file to extract problem information
   */
  parseCSharpFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      let problemId = null;
      let title = null;
      let description = null;
      let author = null;
      let email = null;
      let github = null;
      let source = null;

      // Extract information from comments
      for (const line of lines) {
        const trimmed = line.trim();

        // Extract problem ID and title from first comment line
        if (trimmed.startsWith('//') && !problemId && !title) {
          const match = trimmed.match(/^\/\/\s*(\d+)\.\s*(.+)$/);
          if (match) {
            problemId = parseInt(match[1]);
            title = match[2].trim();
          }
        }

        // Extract description
        if (trimmed.startsWith('//') && !trimmed.includes('Author:') && !trimmed.includes('Email:') && !trimmed.includes('GitHub:') && !trimmed.includes('Source:') && problemId && title && !description) {
          const desc = trimmed.replace(/^\/\/\s*/, '');
          if (desc && !desc.match(/^\d+\./)) {
            description = desc;
          }
        }

        // Extract author info
        if (trimmed.includes('Author:')) {
          author = trimmed.replace(/^\/\/\s*Author:\s*/, '');
        }
        if (trimmed.includes('Email:')) {
          email = trimmed.replace(/^\/\/\s*Email:\s*/, '');
        }
        if (trimmed.includes('GitHub:')) {
          github = trimmed.replace(/^\/\/\s*GitHub:\s*/, '');
        }
        if (trimmed.includes('Source:')) {
          source = trimmed.replace(/^\/\/\s*Source:\s*/, '');
        }

        // Stop parsing comments when we hit code
        if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*')) {
          break;
        }
      }

      // Determine difficulty based on actual LeetCode difficulty
      const difficulty = this.getActualDifficulty(problemId);

      // Extract filename for solution link
      const fileName = path.basename(filePath);

      return {
        id: problemId,
        title: title,
        description: description,
        difficulty: difficulty,
        category: 'Problems',
        solutionLink: `problems/${fileName}`,
        blogLink: this.getBlogLink(problemId, title),
        tags: this.extractTags(content),
        completedAt: this.getFileDate(filePath),
        author: author,
        email: email,
        github: github,
        source: source
      };
    } catch (error) {
      console.error(`Error parsing file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Extract tags from code content
   */
  extractTags(content) {
    const tags = new Set();

    // Common data structures and algorithms
    const patterns = {
      'Array': /\[\]|Array|array/i,
      'Hash Table': /Dictionary|HashMap|HashSet/i,
      'Linked List': /ListNode|LinkedList/i,
      'Tree': /TreeNode|BinaryTree/i,
      'Graph': /Graph|DFS|BFS/i,
      'Dynamic Programming': /dp\[|memo|dynamic/i,
      'Two Pointers': /left.*right|two.*pointer/i,
      'Sliding Window': /sliding.*window|window/i,
      'Binary Search': /binary.*search|left.*right.*mid/i,
      'Backtracking': /backtrack|permut|combin/i,
      'Greedy': /greedy/i,
      'Divide and Conquer': /divide.*conquer|merge/i,
      'Heap': /PriorityQueue|Heap/i,
      'Stack': /Stack|stack/i,
      'Queue': /Queue|queue/i,
      'String': /string|String/i,
      'Math': /Math\.|mathematical/i
    };

    for (const [tag, pattern] of Object.entries(patterns)) {
      if (pattern.test(content)) {
        tags.add(tag);
      }
    }

    return Array.from(tags);
  }

  /**
   * Get blog link if blog post exists
   */
  getBlogLink(problemId, title) {
    if (!problemId || !title) return null;

    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const blogPath = path.join(this.blogDir, `*-problem-${problemId}-${slug}.md`);

    // Check if blog post exists (simplified check)
    try {
      const files = fs.readdirSync(this.blogDir);
      const blogFile = files.find(file =>
        file.includes(`problem-${problemId}-`) && file.endsWith('.md')
      );

      if (blogFile) {
        return `/blog/problem-${problemId}-${slug}/`;
      }
    } catch (error) {
      // Blog directory might not exist yet
    }

    return null;
  }

  /**
   * Get file creation/modification date
   */
  getFileDate(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.mtime.toISOString().split('T')[0];
    } catch (error) {
      return new Date().toISOString().split('T')[0];
    }
  }

  /**
   * Parse all C# files in the problems directory
   */
  parseAllProblems() {
    const problems = [];

    try {
      const files = fs.readdirSync(this.problemsDir);
      const csFiles = files.filter(file => file.endsWith('.cs'));

      for (const file of csFiles) {
        const filePath = path.join(this.problemsDir, file);
        const problem = this.parseCSharpFile(filePath);

        if (problem && problem.id && problem.title) {
          problems.push(problem);
        }
      }

      // Sort by problem ID
      problems.sort((a, b) => a.id - b.id);

      return problems;
    } catch (error) {
      console.error('Error reading problems directory:', error);
      return [];
    }
  }

  /**
   * Generate statistics from problems
   */
  generateStats(problems) {
    const stats = {
      total: problems.length,
      easy: problems.filter(p => p.difficulty === 'Easy').length,
      medium: problems.filter(p => p.difficulty === 'Medium').length,
      hard: problems.filter(p => p.difficulty === 'Hard').length,
      withBlog: problems.filter(p => p.blogLink).length,
      lastUpdated: new Date().toISOString()
    };

    return stats;
  }

  /**
   * Update README.md with problems table and statistics
   */
  updateReadme(problems) {
    const readmePath = path.join(__dirname, '../README.md');

    try {
      let readmeContent = fs.readFileSync(readmePath, 'utf8');
      const stats = this.generateStats(problems);

      // Generate statistics section
      let statsSection = '\n## 📊 Statistics\n\n';
      statsSection += `**Total Problems Solved:** ${stats.total}\n\n`;
      statsSection += '| Difficulty | Count | Percentage |\n';
      statsSection += '|------------|-------|------------|\n';
      statsSection += `| ![Easy](https://img.shields.io/badge/-Easy-green) | ${stats.easy} | ${((stats.easy / stats.total) * 100).toFixed(1)}% |\n`;
      statsSection += `| ![Medium](https://img.shields.io/badge/-Medium-orange) | ${stats.medium} | ${((stats.medium / stats.total) * 100).toFixed(1)}% |\n`;
      statsSection += `| ![Hard](https://img.shields.io/badge/-Hard-red) | ${stats.hard} | ${((stats.hard / stats.total) * 100).toFixed(1)}% |\n\n`;
      statsSection += `**Blog Posts:** ${stats.withBlog} problems have detailed explanations\n`;
      statsSection += `**Last Updated:** ${new Date().toLocaleDateString()}\n\n`;

      // Generate problems table
      let table = '## 📝 Problems Solved\n\n';
      table += '| # | Title | Difficulty | Solution | Blog Post |\n';
      table += '|---|-------|------------|----------|----------|\n';

      for (const problem of problems) {
        const solutionLink = `[C#](${problem.solutionLink})`;
        const blogLink = problem.blogLink ? `[📖 Read](${problem.blogLink})` : '-';
        const difficultyBadge = `![${problem.difficulty}](https://img.shields.io/badge/-${problem.difficulty}-${this.getDifficultyColor(problem.difficulty)})`;

        table += `| ${problem.id} | ${problem.title} | ${difficultyBadge} | ${solutionLink} | ${blogLink} |\n`;
      }

      table += '\n---\n';

      // Combine stats and table
      const fullContent = statsSection + table;

      // Replace or append content
      const contentRegex = /## 📊 Statistics[\s\S]*?(?=\n---\n|\n##|\n#|$)/;
      if (contentRegex.test(readmeContent)) {
        readmeContent = readmeContent.replace(contentRegex, fullContent.trim());
      } else {
        readmeContent += '\n' + fullContent;
      }

      fs.writeFileSync(readmePath, readmeContent);
    } catch (error) {
      console.error('Error updating README:', error);
    }
  }

  /**
   * Get actual difficulty based on LeetCode problem ID
   */
  getActualDifficulty(problemId) {
    // Actual LeetCode difficulty mapping
    const difficultyMap = {
      1: 'Easy',      // Two Sum
      2: 'Medium',    // Add Two Numbers
      3: 'Medium',    // Longest Substring Without Repeating Characters
      4: 'Hard',      // Median of Two Sorted Arrays
      5: 'Medium',    // Longest Palindromic Substring
      6: 'Medium',    // Zigzag Conversion
      7: 'Medium',    // Reverse Integer
      8: 'Medium',    // String to Integer (atoi)
      9: 'Easy',      // Palindrome Number
      10: 'Hard',     // Regular Expression Matching
      23: 'Hard',     // Merge k Sorted Lists
      25: 'Hard',     // Reverse Nodes in k-Group
      30: 'Hard',     // Substring with Concatenation of All Words
      32: 'Hard',     // Longest Valid Parentheses
      37: 'Hard',     // Sudoku Solver
      41: 'Hard',     // First Missing Positive
      42: 'Hard',     // Trapping Rain Water
      44: 'Hard',     // Wildcard Matching
      51: 'Hard',     // N-Queens
      52: 'Hard',     // N-Queens II
      60: 'Hard',     // Permutation Sequence
      65: 'Hard',     // Valid Number
      68: 'Hard',     // Text Justification
      76: 'Hard',     // Minimum Window Substring
      84: 'Hard',     // Largest Rectangle in Histogram
      85: 'Hard',     // Maximal Rectangle
      1001: 'Medium'  // Find Common Characters
    };

    return difficultyMap[problemId] || 'Medium'; // Default to Medium if not found
  }

  /**
   * Get difficulty color for badges
   */
  getDifficultyColor(difficulty) {
    const colors = {
      'Easy': 'green',
      'Medium': 'orange',
      'Hard': 'red'
    };
    return colors[difficulty] || 'blue';
  }

  /**
   * Save problems data as JSON
   */
  saveProblemsData(problems, stats) {
    try {
      // Save problems data
      const problemsPath = path.join(this.outputDir, 'problems.json');
      fs.writeFileSync(problemsPath, JSON.stringify(problems, null, 2));

      // Save stats data
      const statsPath = path.join(this.outputDir, 'stats.json');
      fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));

      console.log('✅ Problems data saved successfully');
      console.log(`📊 Total problems: ${stats.total}`);
      console.log(`📈 Easy: ${stats.easy}, Medium: ${stats.medium}, Hard: ${stats.hard}`);
      console.log(`📝 With blog posts: ${stats.withBlog}`);
    } catch (error) {
      console.error('Error saving problems data:', error);
    }
  }

  /**
   * Main execution function
   */
  run() {
    const problems = this.parseAllProblems();
    const stats = this.generateStats(problems);

    this.saveProblemsData(problems, stats);
    this.updateReadme(problems);
  }
}

// Run if called directly
if (require.main === module) {
  const parser = new ProblemParser();
  parser.run();
}

module.exports = ProblemParser;
