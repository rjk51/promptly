export const solutions = {
    "1": {
      javascript: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];
      
      if (map.has(complement)) {
        return [map.get(complement), i];
      }
      
      map.set(nums[i], i);
    }
    
    return [];
  };`,
      python: `def twoSum(nums, target):
      num_map = {}
      
      for i, num in enumerate(nums):
          complement = target - num
          
          if complement in num_map:
              return [num_map[complement], i]
          
          num_map[num] = i
      
      return []`,
    },
    "2": {
      javascript: `function isPalindrome(x) {
    if (x < 0) return false;
    
    // Convert to string and check if it's equal to its reverse
    const str = x.toString();
    const reversed = str.split('').reverse().join('');
    
    return str === reversed;
  };`,
      python: `def isPalindrome(x):
      if x < 0:
          return False
      
      # Convert to string and check if it's equal to its reverse
      return str(x) == str(x)[::-1]`,
    },
  }
  