(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ctx = window.ctx;

var signal = ctx.createOscillator();
signal.type = 'sawtooth';
signal.frequency.value = 80;
signal.start();

var filter = ctx.createBiquadFilter();
signal.connect(filter);

var gain = ctx.createGain();
gain.gain.value = 0;
filter.connect(gain);
gain.connect(ctx.destination);



var isPlaying = false;
var div = document.querySelector('.wah');
function wah(event) {

  if (!isPlaying) {
    isPlaying = true;
    drawFreqData();
  }
  // turn on the sound
  gain.gain.value = 1;
  var divHeight = div.offsetHeight;
  var divWidth = div.offsetWidth;


  var minOscillatorFreq = 40;
  var maxOscillatorFreq = 600;
  var oscillatorRange = maxOscillatorFreq - minOscillatorFreq;
  var mappedOscillatorFrequency = ((oscillatorRange / divHeight) * event.offsetY) + minOscillatorFreq;
  signal.frequency.value = mappedOscillatorFrequency;


  var minFilterFreq = 100;
  var maxFilterFreq = 22000;
  var filterRange = maxFilterFreq - minFilterFreq;
  var mappedFrequency = ((filterRange / divWidth) * event.offsetX) + minFilterFreq;
  filter.frequency.value = mappedFrequency;
}
div.addEventListener('mousemove', wah);

// silence when mouse leaves
div.addEventListener('mouseleave', function() {
  gain.gain.value = 0;
  isPlaying = false;
});


var analyzer = ctx.createAnalyser();

var canvas = document.querySelector('canvas.wah').getContext('2d');

function drawFreqData() {
  var buffer = new Uint8Array(analyzer.frequencyBinCount);
  analyzer.getByteTimeDomainData(buffer);

  var barWidth = 500 / buffer.length;
  canvas.clearRect(0, 0, 500, 500);
  canvas.strokeStyle = 'blue';
  canvas.lineWidth = 2;
  canvas.beginPath();
  canvas.moveTo(0,0);
  for (var i = 0; i < buffer.length; i++) {
    var percentageHeight = buffer[i] / 256;
    var pixelHeight = percentageHeight * 500;
    var x = i * barWidth;
    canvas.lineTo(x, 500 - pixelHeight);
  }
  canvas.stroke();

  canvas.lineWidth = 2;
  canvas.strokeStyle = 'black';
  canvas.beginPath();
  canvas.moveTo(0, 250);
  canvas.lineTo(500, 250);
  canvas.stroke();

  if (isPlaying) {
    requestAnimationFrame(drawFreqData);
  }
}

gain.connect(analyzer);
drawFreqData();

},{}]},{},[1]);
