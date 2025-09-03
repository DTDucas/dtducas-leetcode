// Author: Duong Tran Quang (aka DTDucas)
// Email: baymax.contact@gmail.com
// GitHub: https://github.com/DTDucas
// Source: https://github.com/DTDucas/dtducas-leetcode

public class Solution {
    public int Reverse(int x) {
        int result = 0;
        const int maxDiv10 = int.MaxValue / 10;
        const int minDiv10 = int.MinValue / 10;

        while (x != 0) {
            int digit = x % 10;
            x /= 10;

            if (result > maxDiv10 || result < minDiv10 ||
                (result == maxDiv10 && digit > 7) ||
                (result == minDiv10 && digit < -8)) {
                return 0;
            }

            result = (result << 3) + (result << 1) + digit;
        }

        return result;
    }
}
