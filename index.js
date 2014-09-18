var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var drone = require('ar-drone').createClient();

app.use(express.static(__dirname));

io.on('connect', function(socket) {
  console.log('connect!');
  var timeoutSet = false;
  var isAscending = false;

  socket.on('takeoff', function() {
    console.log('takeoff!');
    drone.takeoff();

    if (!timeoutSet) {
      timeoutSet = true;
      // let it get high enough before we start to dance
      setTimeout(function() {
        socket.on('beat', function() {
          console.log('got beat');
          isAscending ? drone.down(0.3) : drone.up(0.3);
          isAscending = !isAscending;
        });
      }, 5000);
    }
  });

  socket.on('land', function() {
    console.log('land!');
    drone.land();
  });


  socket.on('disconnect', function() {
    console.log('disconnect!');
    drone.land();
  });
});

server.listen(3000);
