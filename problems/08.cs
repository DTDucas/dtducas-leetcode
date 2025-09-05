// Author: Duong Tran Quang (aka DTDucas)
// Email: baymax.contact@gmail.com
// GitHub: https://github.com/DTDucas
// Source: https://github.com/DTDucas/dtducas-leetcode

public class Solution
{
    public int MyAtoi(string s)
    {
        if (string.IsNullOrEmpty(s)) return 0;

        int i = 0, n = s.Length;
        const int maxDiv10 = int.MaxValue / 10;
        const int maxMod10 = int.MaxValue % 10;

        while (i < n && s[i] == ' ') i++;
        if (i == n) return 0;

        bool negative = false;
        if (s[i] == '-' || s[i] == '+')
        {
            negative = s[i] == '-';
            i++;
        }

        int result = 0;
        while (i < n && char.IsDigit(s[i]))
        {
            int digit = s[i] - '0';

            if (result > maxDiv10 || (result == maxDiv10 && digit > maxMod10))
                return negative ? int.MinValue : int.MaxValue;

            result = result * 10 + digit;
            i++;
        }

        return negative ? -result : result;
    }
}
