var Boids = require('boids');
var ticker = require('ticker');

var canvas = document.querySelector('canvas.flocking');
var canvasContext = canvas.getContext('2d');
var button = document.querySelector('button.start-flocking');
var shouldAnimate = false;
var boids = new Boids({
  speedLimit: 2,
  accelerationLimit: 0.25,
  boids: 150
});

window.boids = boids;

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

button.addEventListener('click', function(event) {shouldAnimate = !shouldAnimate;});
