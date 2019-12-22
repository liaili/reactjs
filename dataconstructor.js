// function demo() {
//   // return false
//   var age = 12;
//   var name = 'lie';
  
// } 

// // function solution(array) {
// //  var j = 0;
// //  for(var i = 0; i < array.length; i++) {
// //    if (array[i] !== 0) {
// //      array[j] = array[i];
// //      if (i !== j) {
// //        array[i] = 0;
// //      }
// //      j++;
// //    }
// //  }
// // }

// // solution 1
// function getMaxArea(height) {
//   var length = height.length;
//   var max = 0;
//   for(var i = 0; i < length; i++) {
//     for(var j = i + 1; j < length; j++) {
//       var area = (j - i) * Math.min(height[i], height[j]);
//       max = Math.max(max, area);
//     }
//   }
//   return max;
// }

// // solution 2
// function getMaxArea(height) {
//   var length = height.length;
//   var max = 0;
//   for(var i = 0, j = length - 1; i < j;) {
//     var minHeight = height[i] < height[j] ? height[i ++] : height[j --];
//     var area = (j - i + 1) * minHeight;
//     max = Math.max(max, area);
//   }
//   return max;
// }

// // solution one
// function climbStairs(n) {
//   var memo = [];
//   return climb_Stairs(n);s

//   function climb_Stairs(m) {
//     if (m <= 3) { return m; }
//     if (memo[m]) {
//       return memo[m];
//     }
//     memo[m] = climb_Stairs(m - 2) + climb_Stairs(m - 1);
//     return memo[m];
//   }
// }
// // solution two
// function climbStairs2(n) {
//   if (n <= 2) { return n }

//   var arr = [];
//   arr[1] = 1;
//   arr[2] = 2;
//   for(var i = 3; i <= n; i++) {
//     arr[i] = arr[i - 1] + arr[i - 2];
//   }
//   return arr[n];
// }

function threeSum(nums) {
  var sums = [];
  if (nums.length < 3) {
    return sums;
  }
  nums.sort(function(a, b) { return a - b; })
  var len = nums.length;
  for(var i = 0; i < len; i++) {
    if (nums[i] > 0) { break; }
    if (i > 0 && nums[i] === nums[i-1]) { continue; }
    var j = i + 1;
    var k = len - 1;
    while(j < k) {
      var sum = nums[i] + nums[j] + nums[k];
      if (sum < 0) {
        j++;
      }else if (sum > 0) {
        k--;
      } else {
        sums.push([nums[i], nums[j], nums[k]]);
        while(j < k && nums[j] === nums[j+1]) j++;
        while(j < k && nums[k] === nums[k-1]) k--;
        j++;
        k--; 
      }
    }
  }
  return sums;
}

var arr = [-1,0,1,2,-1,-4];
var threeSumArr = threeSum(arr);
console.log(threeSumArr);