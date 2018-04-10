//here error.message property is set to the string provided.
const err = new Error('This is an error message');

console.log(err.message) ;         // 'This is an error message'
console.error(err.message);
//Output will be :
//This is an error message







//Invalid Snippet
//An asynchronous operation which will generate error
try {
    async_method('invalid_arguments_generate_error', (err, data) => {
        if (err) {
            throw err;
        }
    });
} catch (err) {
    console.error(err);
}

