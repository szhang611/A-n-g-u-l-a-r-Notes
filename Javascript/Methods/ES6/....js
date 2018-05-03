console.log(...[1, 2, 3]);
// 1 2 3

console.log(1, ...[2, 3, 4], 5);
// 1 2 3 4 5

console.log([...document.querySelectorAll('div')]);
// [<div>, <div>, <div>]


// 函数的调用：
function add(x, y) {
    return x + y;
}

const numbers = [4, 38];
add(...numbers);    // 42


// 扩展运算符与正常的函数参数可以结合使用，非常灵活。

function f(v, w, x, y, z) { }
const args = [0, 1];
f(-1, ...args, 2, ...[3]);

// 扩展运算符后面还可以放置表达式。
const arr = [
    ...(x > 0 ? ['a'] : []),
    'b',
];

// 如果扩展运算符后面是一个空数组，则不产生任何效果。
let wewa = [...[], 1];
// [1]



// ES6的写法
function f(x, y, z) {
    // ...
}
let argsaa = [0, 1, 2];
f(...argsaa);




// ES5 的写法
Math.max.apply(null, [14, 3, 77])

// ES6 的写法
Math.max(...[14, 3, 77])

// 等同于
Math.max(14, 3, 77);
// 上面代码中，由于 JavaScript 不提供求数组最大元素的函数，
// 所以只能套用Math.max函数，将数组转为一个参数序列，然后求最大值。
// 有了扩展运算符以后，就可以直接用Math.max了。


// // // 另一个例子是通过push函数，将一个数组添加到另一个数组的尾部。

// ES5的 写法
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
Array.prototype.push.apply(arr1, arr2);

// ES6 的写法
let arr1 = [0, 1, 2];
let arr2 = [3, 4, 5];
arr1.push(...arr2);
// 上面代码的 ES5 写法中，push方法的参数不能是数组，所以只好通过apply方法变通使用push方法。有了扩展运算符，
// 就可以直接将数组传入push方法。


// 下面是另外一个例子。

// ES5
new (Date.bind.apply(Date, [null, 2015, 1, 1]))
// ES6
new Date(...[2015, 1, 1]);


// add