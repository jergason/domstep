(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var audioContext = window.ctx;

var startButton = document.querySelector('.wob-it-up');
var stopButton = document.querySelector('.stop-wob-it-up');

var carrier = audioContext.createOscillator();
carrier.frequency.value = 300;

var gain = audioContext.createGain();
carrier.connect(gain);
gain.connect(audioContext.destination);

var wob = audioContext.createOscillator();
wob.frequency.value = 3;

// connect to the audioparam, not the node itself
wob.connect(gain.gain);
wob.start();

function startWob() {
  carrier.start();
}

function stopWob() {
  carrier.stop();
}

startButton.addEventListener('click', startWob);
stopButton.addEventListener('click', stopWob);

},{}]},{},[1]);
