var Boids = require('boids');
var ticker = require('ticker');
var Beats = require('beatsjs');
var load = require('webaudio-buffer-loader');

var canvas = document.querySelector('canvas.flocking-beats');
var canvasContext = canvas.getContext('2d');
var button = document.querySelector('button.start-flocking-beats');
var shouldAnimate = false;
var boids = new Boids({
  speedLimit: 3,
  accelerationLimit: 0.45,
  boids: 150
});
var audioContext = window.ctx;


function audioContextTimeToTimeoutTime(ctx, contextTime) {
  console.log('current time', ctx.currentTime, 'contextTime', contextTime);
  var deltaSeconds = Math.max(contextTime - ctx.currentTime, 0);
  console.log('deltaS', deltaSeconds);
  return deltaSeconds * 1000;
}

load(['./sounds/bd.wav', './sounds/sn.wav', './sounds/hh.wav'], audioContext, function(err, sounds) {
  var instrumentsToBuffers = {
    bd: sounds[0],
    sn: sounds[1],
    hh: sounds[2]
  };

  function beatEmitter(beatTimes) {
    console.log('beatTimes', beatTimes);
    var explodeTime = audioContextTimeToTimeoutTime(audioContext, beatTimes[0]);
    var collapseTime = audioContextTimeToTimeoutTime(audioContext, beatTimes[3]);

    setTimeout(function() {
      console.log('explodeTime is', explodeTime, 'currentTime', audioContext.currentTime);
      boids.cohesionForce = 0.1;
    }, explodeTime);

    setTimeout(function() {
      console.log('collapseTime is', explodeTime, 'currentTime', audioContext.currentTime);
      boids.cohesionForce = 0.9;
    }, collapseTime);
  }

  var beats = new Beats(audioContext, instrumentsToBuffers, {bpm: 144, beatEmitter: beatEmitter});

  ticker(window, 60).on('tick', function() {
    boids.tick()
    if (shouldAnimate) {
      draw();
    }
  })

  function draw() {
    var boidData = boids.boids;
    var halfHeight = canvas.height/2;
    var halfWidth = canvas.width/2;

    canvasContext.fillStyle = 'rgba(255,241,235,0.25)' // '#FFF1EB'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)

    canvasContext.fillStyle = '#543D5E'
    for (var i = 0, l = boidData.length, x, y; i < l; i += 1) {
      x = boidData[i][0]; y = boidData[i][1]
      // wrap around the screen
      boidData[i][0] = x > halfWidth ? -halfWidth : -x > halfWidth ? halfWidth : x
      boidData[i][1] = y > halfHeight ? -halfHeight : -y > halfHeight ? halfHeight : y
      canvasContext.fillRect(x + halfWidth, y + halfHeight, 2, 2)
    }
  }

  button.addEventListener('click', function(event) {
    shouldAnimate = !shouldAnimate;
    var trackString = '';

trackString += 'hh| -- -- -- -- -- -- -- -- |\n';
trackString += 'sn| -- -- -- -- sn -- -- -- |\n';
trackString += 'bd| bd bd -- -- -- -- -- -- |\n';
    var track = beats.notation(trackString);

    if (shouldAnimate) {
      beats.startPlaying(track);
    }
    else {
      beats.stop();
    }
  });
});
