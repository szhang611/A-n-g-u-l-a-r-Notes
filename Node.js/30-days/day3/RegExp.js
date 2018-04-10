let regg = /ab*/;

let reg = new RegExp('ab*');

let str = 'abde';

let bool = str.match(reg);

reg.test(str);

console.log(bool);
