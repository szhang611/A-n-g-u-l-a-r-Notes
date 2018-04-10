// clear console logs
console.clear();


// calculate the running time.
console.time('division');
let x = 10;
let y = 20;
let result = x/y;

if(result === 2){
    console.log("Result : %d".result)
}else{
    console.log("Result : " + result);
}

console.timeEnd('division');



//Available in current version
//This code counts the score of remo , rj and
//default score which goes to none of them
console.count('default');
console.count('remo');
console.count('rj');
console.count('remo');
console.count('remo');
console.count('rj');
console.count();


