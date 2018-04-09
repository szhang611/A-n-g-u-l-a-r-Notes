const http = require('http');
const fs = require('fs');

http.createServer(function (req, res) {
    console.log("Port Number : 3000");
    // change the MIME type from 'text/plain' to 'text/html'
    res.writeHead(200, {'Content-Type': 'text/html'});
    //reading the content file
    fs.readFile('30-days/day1/index.html', (err, data) => {
        //checking for errors
        if (err)
            throw err;
        console.log("Operation Success");
        //sending the response
        res.end(data);
    });
}).listen(3000);