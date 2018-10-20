const fs = require('fs');
const http = require('http');
const io = require('socket.io');
const nStatic = require('node-static');

let fileServer = new nStatic.Server('./');
fileServer.cache = false;

const port = process.env.PORT || 8080;

//create server
let server = http.createServer(function(req, res) {
  fileServer.serve(req, res);
})

// listen on port 3001
server.listen(port);

// socket.io listener
let listener = io.listen(server);

let clientsNum = 0;

// listen for messages
listener.sockets.on('connection', function(socket) {
  clientsNum++;
 
  socket.on('mouse',function(data) {
    listener.emit('backend_mouse', data );
  });

  socket.on('msg', function(data) {
    socket.broadcast.emit('backend_msg', data);
  })


  socket.on('disconnect', function() {
    clientsNum--;
    listener.emit('stats', clientsNum);
  });

  setInterval(function() {
    listener.emit('stats', { active : clientsNum });
  },200);


})
