// Author: Duong Tran Quang (aka DTDucas)
// Email: baymax.contact@gmail.com
// GitHub: https://github.com/DTDucas
// Source: https://github.com/DTDucas/dtducas-leetcode

public class Solution {
    public string LongestPalindrome(string s) {
        if (s.Length < 2) return s;

        int start = 0, maxLen = 1;

        for (int i = 0; i < s.Length; i++) {
            int len1 = ExpandAroundCenter(s, i, i);
            int len2 = ExpandAroundCenter(s, i, i + 1);

            int currentMax = Math.Max(len1, len2);
            if (currentMax > maxLen) {
                maxLen = currentMax;
                start = i - (currentMax - 1) / 2;
            }
        }

        return s.Substring(start, maxLen);
    }

    private int ExpandAroundCenter(string s, int left, int right) {
        while (left >= 0 && right < s.Length && s[left] == s[right]) {
            left--;
            right++;
        }
        return right - left - 1;
    }
}
