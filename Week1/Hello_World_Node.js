//Hello World in Node.js

http=require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World Node Js\n');
}).listen(8080);

console.log('Server running at http://8080/');