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
let users = [];

// listen for messages
listener.sockets.on('connection', function(socket) {
  clientsNum++;
  users.push(process.env.COMPUTERNAME);
 
  socket.on('mouse',function(data) {

    socket.emit('backend_mouse', data );
    socket.broadcast.emit('backend_mouse', data );

  });


  socket.on('disconnect', function() {
    clientsNum--;


    for (let i = 0; i < users.length; i++) {
      if(users[i] === process.env.COMPUTERNAME) {
        users.splice(i,1);
      }
    }

    socket.emit('stats', clientsNum);

  });

  setInterval(function() {
    socket.emit('stats', { active : clientsNum, users :  users });
  },200);


})
