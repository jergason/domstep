var Beats = require('beatsjs');
var load = require('webaudio-buffer-loader');

var button = document.querySelector('button.start-dancing-beats');
var audioContext = window.ctx;
var shouldDance = false;


function audioContextTimeToTimeoutTime(ctx, contextTime) {
  console.log('current time', ctx.currentTime, 'contextTime', contextTime);
  var deltaSeconds = Math.max(contextTime - ctx.currentTime, 0);
  console.log('deltaS', deltaSeconds);
  return deltaSeconds * 1000;
}

load(['/sounds/bd.wav', '/sounds/sn.wav', '/sounds/hh.wav'], audioContext, function(err, sounds) {
  var instrumentsToBuffers = {
    bd: sounds[0],
    sn: sounds[1],
    hh: sounds[2]
  };

  var socket;


  function beatEmitter(beatTimes) {
    console.log('beatTimes', beatTimes);
    var explodeTime = audioContextTimeToTimeoutTime(audioContext, beatTimes[0]);

    setTimeout(function() {
      console.log('explodeTime is', explodeTime, 'currentTime', audioContext.currentTime);
      socket.emit('beat');
    }, explodeTime);
  }

  var beats = new Beats(audioContext, instrumentsToBuffers, {bpm: 144, beatEmitter: beatEmitter});

  button.addEventListener('click', function(event) {
    shouldDance = !shouldDance;
    var trackString = '';

trackString += 'hh| -- -- -- -- -- -- -- -- |\n';
trackString += 'sn| -- -- -- -- sn -- -- -- |\n';
trackString += 'bd| bd bd -- -- -- -- -- -- |\n';
    var track = beats.notation(trackString);

    if (shouldDance) {
      socket = io('http://localhost');
      socket.emit('takeoff');
      beats.startPlaying(track);
    }
    else {
      beats.stop();
      socket.emit('land');
      socket.disconnect();
    }
  });
});
