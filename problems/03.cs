// 3. Longest Substring Without Repeating Characters
// Given a string s, find the length of the longest substring without duplicate characters.

public class Solution {
    public int LengthOfLongestSubstring(string s) {
        var charIndex = new Dictionary<char, int>();
        int maxLength = 0;
        int left = 0;
        for (int right = 0; right < s.Length; right++) {
            if (charIndex.ContainsKey(s[right]) && charIndex[s[right]] >= left) {
                left = charIndex[s[right]] + 1;
            }
            charIndex[s[right]] = right;
            maxLength = Math.Max(maxLength, right - left + 1);
        }
        return maxLength;
    }
}
