var fs = require("fs");

// fs.mkdir("./Node.js/files",function() {
//     console.log("success!");
// })

// fs.rmdir("files",function(){

// })


// 默认是在根目录下。
// fs.writeFile("./Node.js/files/fs_data.txt","write file content!",function(){
//     console.log("write successfully!!");
// })

// function 是err 在data之前。
fs.readFile("./Node.js/fs/files/fs_data.txt",function(err, data){
    console.log(data);
})

