// Author: Duong Tran Quang (aka DTDucas)
// Email: baymax.contact@gmail.com
// GitHub: https://github.com/DTDucas
// Source: https://github.com/DTDucas/dtducas-leetcode

// 30. Substring with Concatenation of All Words
// You are given a string s and an array of strings words. All the strings of words are of the same length.

// A concatenated string is a string that exactly contains all the strings of any permutation of words concatenated.

// For example, if words = ["ab","cd","ef"], then "abcdef", "abefcd", "cdabef", "cdefab", "efabcd", and "efcdab" are all concatenated strings. "acdbef" is not a concatenated string because it is not the concatenation of any permutation of words.
// Return an array of the starting indices of all the concatenated substrings in s. You can return the answer in any order

public class Solution {
    public IList<int> FindSubstring(string s, string[] words) {
        var result = new List<int>();
        if (s.Length == 0 || words.Length == 0) return result;

        int wordLen = words[0].Length;
        int totalLen = wordLen * words.Length;
        if (s.Length < totalLen) return result;

        var wordCount = new Dictionary<string, int>();
        foreach (var word in words) {
            wordCount[word] = wordCount.GetValueOrDefault(word, 0) + 1;
        }

        for (int i = 0; i < wordLen; i++) {
            int left = i;
            int count = 0;
            var windowCount = new Dictionary<string, int>();

            for (int right = i; right <= s.Length - wordLen; right += wordLen) {
                string word = s.Substring(right, wordLen);

                if (wordCount.ContainsKey(word)) {
                    windowCount[word] = windowCount.GetValueOrDefault(word, 0) + 1;
                    count++;

                    while (windowCount[word] > wordCount[word]) {
                        string leftWord = s.Substring(left, wordLen);
                        windowCount[leftWord]--;
                        left += wordLen;
                        count--;
                    }

                    if (count == words.Length) {
                        result.Add(left);
                        string leftWord = s.Substring(left, wordLen);
                        windowCount[leftWord]--;
                        left += wordLen;
                        count--;
                    }
                } else {
                    windowCount.Clear();
                    count = 0;
                    left = right + wordLen;
                }
            }
        }

        return result;
    }
}
