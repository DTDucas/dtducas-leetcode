const fs = require('fs');
const path = require('path');

class ProblemParser {
  constructor() {
    this.problemsDir = path.join(__dirname, '../problems');
    this.outputDir = path.join(__dirname, '../website/public/data');
    this.blogDir = path.join(__dirname, '../blog/_posts');

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async parseCSharpFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath);

      const problemId = this.extractIdFromFilename(fileName);
      if (!problemId) {
        console.log(`⚠️  Skipping ${fileName}: Invalid filename format`);
        return null;
      }

      const apiData = await this.fetchFromLeetCodeAPI(problemId);
      if (!apiData) {
        console.log(`❌ Failed to fetch data for problem ${problemId}`);
        return null;
      }

      return {
        id: problemId,
        title: apiData.title,
        description: apiData.description,
        difficulty: apiData.difficulty,
        category: 'Problems',
        solutionLink: `problems/${fileName}`,
        blogLink: this.getBlogLink(problemId, apiData.title),
        tags: apiData.tags || this.extractTags(content),
        completedAt: this.getFileDate(filePath)
      };
    } catch (error) {
      console.error(`Error parsing file ${filePath}:`, error);
      return null;
    }
  }

  extractIdFromFilename(fileName) {
    const match = fileName.match(/^(\d+)\.cs$/);
    return match ? parseInt(match[1]) : null;
  }

  async fetchFromLeetCodeAPI(problemId) {
    try {
      const response = await fetch('https://leetcode.com/api/problems/all/', {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const problem = data.stat_status_pairs?.find(item =>
        item.stat.frontend_question_id === problemId
      );

      if (!problem) {
        throw new Error(`Problem ${problemId} not found`);
      }

      return {
        title: problem.stat.question__title,
        difficulty: problem.difficulty.level === 1 ? 'Easy' :
                   problem.difficulty.level === 2 ? 'Medium' : 'Hard',
        description: `LeetCode Problem ${problemId}: ${problem.stat.question__title}`,
        tags: []
      };
    } catch (error) {
      console.log(`⚠️  API fetch failed for problem ${problemId}: ${error.message}`);
      return null;
    }
  }

  cleanDescription(htmlContent) {
    if (!htmlContent) return '';
    return htmlContent
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .trim()
      .substring(0, 200) + '...';
  }

  extractTags(content) {
    const tags = new Set();
    const patterns = {
      'Array': /\[\]|Array|array/i,
      'Hash Table': /Dictionary|HashMap|HashSet/i,
      'Linked List': /ListNode|LinkedList/i,
      'Tree': /TreeNode|BinaryTree/i,
      'Dynamic Programming': /dp\[|memo|dynamic/i,
      'Two Pointers': /left.*right|two.*pointer/i,
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

  getBlogLink(problemId, title) {
    if (!problemId || !title) return null;

    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    try {
      const files = fs.readdirSync(this.blogDir);
      const blogFile = files.find(file =>
        file.includes(`problem-${problemId}-`) && file.endsWith('.md')
      );

      return blogFile ? `/blog/problem-${problemId}-${slug}/` : null;
    } catch (error) {
      return null;
    }
  }

  getFileDate(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.mtime.toISOString().split('T')[0];
    } catch (error) {
      return new Date().toISOString().split('T')[0];
    }
  }

  async parseAllProblems() {
    const problems = [];

    try {
      const files = fs.readdirSync(this.problemsDir);
      const csFiles = files.filter(file => file.endsWith('.cs'));

      console.log(`🔍 Found ${csFiles.length} C# files to parse...`);

      for (const file of csFiles) {
        const filePath = path.join(this.problemsDir, file);
        const problem = await this.parseCSharpFile(filePath);

        if (problem) {
          problems.push(problem);
          console.log(`✅ Parsed: ${problem.id}. ${problem.title}`);
        }
      }

      problems.sort((a, b) => a.id - b.id);
      console.log(`🎉 Successfully parsed ${problems.length} problems!`);
      return problems;
    } catch (error) {
      console.error('Error reading problems directory:', error);
      return [];
    }
  }

  generateStats(problems) {
    return {
      total: problems.length,
      easy: problems.filter(p => p.difficulty === 'Easy').length,
      medium: problems.filter(p => p.difficulty === 'Medium').length,
      hard: problems.filter(p => p.difficulty === 'Hard').length,
      withBlog: problems.filter(p => p.blogLink).length,
      lastUpdated: new Date().toISOString()
    };
  }

  updateReadme(problems) {
    const readmePath = path.join(__dirname, '../README.md');

    try {
      let readmeContent = fs.readFileSync(readmePath, 'utf8');
      const stats = this.generateStats(problems);

      let statsSection = '\n## 📊 Statistics\n\n';
      statsSection += `**Total Problems Solved:** ${stats.total}\n\n`;
      statsSection += '| Difficulty | Count | Percentage |\n';
      statsSection += '|------------|-------|------------|\n';
      statsSection += `| ![Easy](https://img.shields.io/badge/-Easy-green) | ${stats.easy} | ${((stats.easy / stats.total) * 100).toFixed(1)}% |\n`;
      statsSection += `| ![Medium](https://img.shields.io/badge/-Medium-orange) | ${stats.medium} | ${((stats.medium / stats.total) * 100).toFixed(1)}% |\n`;
      statsSection += `| ![Hard](https://img.shields.io/badge/-Hard-red) | ${stats.hard} | ${((stats.hard / stats.total) * 100).toFixed(1)}% |\n\n`;
      statsSection += `**Blog Posts:** ${stats.withBlog} problems have detailed explanations\n`;
      statsSection += `**Last Updated:** ${new Date().toLocaleDateString()}\n\n`;

      let table = '## 📝 Problems Solved\n\n';
      table += '| # | Title | Difficulty | Solution | Blog Post |\n';
      table += '|---|-------|------------|----------|----------|\n';

      for (const problem of problems) {
        const solutionLink = `[C#](${problem.solutionLink})`;
        const blogLink = problem.blogLink ? `[📖 Read](${problem.blogLink})` : '-';
        const difficultyColor = problem.difficulty === 'Easy' ? 'green' :
                               problem.difficulty === 'Medium' ? 'orange' : 'red';
        const difficultyBadge = `![${problem.difficulty}](https://img.shields.io/badge/-${problem.difficulty}-${difficultyColor})`;

        table += `| ${problem.id} | ${problem.title} | ${difficultyBadge} | ${solutionLink} | ${blogLink} |\n`;
      }

      table += '\n---\n';

      const fullContent = statsSection + table;
      const contentRegex = /## 📊 Statistics[\s\S]*$/;

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

  saveProblemsData(problems, stats) {
    try {
      const problemsPath = path.join(this.outputDir, 'problems.json');
      fs.writeFileSync(problemsPath, JSON.stringify(problems, null, 2));

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

  async run() {
    console.log('🚀 Starting LeetCode problems parser...\n');

    const problems = await this.parseAllProblems();
    const stats = this.generateStats(problems);

    this.saveProblemsData(problems, stats);
    this.updateReadme(problems);

    console.log('\n🎯 Parser completed successfully!');
  }
}

if (require.main === module) {
  const parser = new ProblemParser();
  parser.run().catch(error => {
    console.error('❌ Parser failed:', error);
    process.exit(1);
  });
}

module.exports = ProblemParser;
