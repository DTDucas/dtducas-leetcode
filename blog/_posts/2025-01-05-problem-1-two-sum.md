---
layout: post
title: "Problem 1: Two Sum"
date: 2025-01-05 10:00:00 +0700
problem_id: 1
difficulty: Easy
solution_link: problems/01.cs
tags: [Array, Hash Table, Two Pointers]
author: DTDucas
---

## Problem Description

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

### Example 1

```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
```

### Example 2

```
Input: nums = [3,2,4], target = 6
Output: [1,2]
```

### Example 3

```
Input: nums = [3,3], target = 6
Output: [0,1]
```

## Approach

The key insight is to use a hash table (Dictionary in C#) to store the numbers we've seen so far along with their indices. For each number, we check if its complement (target - current number) exists in the hash table.

### Algorithm

1. Create a hash table to store number-to-index mapping
2. Iterate through the array
3. For each element, calculate its complement: `complement = target - nums[i]`
4. Check if the complement exists in the hash table
5. If yes, return the indices
6. If no, add the current number and its index to the hash table

## Solution

```csharp
public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        var map = new Dictionary<int, int>();
        for (int i = 0; i < nums.Length; i++) {
            int complement = target - nums[i];
            if (map.TryGetValue(complement, out int index)) {
                return new int[] { index, i };
            }
            map[nums[i]] = i;
        }
        return new int[0];
    }
}
```

## Complexity Analysis

- **Time Complexity**: O(n) - We traverse the list containing n elements only once. Each lookup in the hash table costs only O(1) time.

- **Space Complexity**: O(n) - The extra space required depends on the number of items stored in the hash table, which stores at most n elements.

## Alternative Approaches

### Brute Force Approach

The brute force approach would be to check every pair of numbers:

```csharp
public int[] TwoSum(int[] nums, int target) {
    for (int i = 0; i < nums.Length; i++) {
        for (int j = i + 1; j < nums.Length; j++) {
            if (nums[i] + nums[j] == target) {
                return new int[] { i, j };
            }
        }
    }
    return new int[0];
}
```

**Time Complexity**: O(n²)
**Space Complexity**: O(1)

### Two Pointers (Only works with sorted array)

If the array were sorted, we could use two pointers:

```csharp
public int[] TwoSum(int[] nums, int target) {
    // This approach requires the array to be sorted
    // and we need to track original indices
    var indexed = nums.Select((val, idx) => new { val, idx })
                     .OrderBy(x => x.val)
                     .ToArray();

    int left = 0, right = indexed.Length - 1;

    while (left < right) {
        int sum = indexed[left].val + indexed[right].val;
        if (sum == target) {
            return new int[] { indexed[left].idx, indexed[right].idx };
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }

    return new int[0];
}
```

## Key Takeaways

1. **Hash tables are powerful** for O(1) lookups when you need to find complements or pairs
2. **Trade space for time** - Using extra space (hash table) to achieve better time complexity
3. **One-pass solution** is possible by checking for the complement while building the hash table
4. **Consider edge cases** like duplicate numbers and ensure you don't use the same element twice

## Related Problems

- [15. 3Sum](https://leetcode.com/problems/3sum/)
- [18. 4Sum](https://leetcode.com/problems/4sum/)
- [167. Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)

---

This problem is a great introduction to hash table techniques and is frequently asked in coding interviews. The hash table approach demonstrates how we can optimize from O(n²) to O(n) by using additional space.
