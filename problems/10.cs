// 10. Regular Expression Matching
// Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where:
// '.' Matches any single character.​​​​
// '*' Matches zero or more of the preceding element.
// The matching should cover the entire input string (not partial).

public class Solution {
    public bool IsMatch(string s, string p) {
        int m = s.Length, n = p.Length;
        bool[,] dp = new bool[m + 1, n + 1];

        dp[0, 0] = true;
        for (int j = 2; j <= n; j += 2) {
            if (p[j - 1] == '*') {
                dp[0, j] = dp[0, j - 2];
            }
        }

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (p[j - 1] == '*') {
                    dp[i, j] = dp[i, j - 2] ||
                               (IsCharMatch(s[i - 1], p[j - 2]) && dp[i - 1, j]);
                } else {
                    dp[i, j] = IsCharMatch(s[i - 1], p[j - 1]) && dp[i - 1, j - 1];
                }
            }
        }

        return dp[m, n];
    }

    private bool IsCharMatch(char s, char p) {
        return p == '.' || s == p;
    }
}
