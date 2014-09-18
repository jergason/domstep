(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var audioContext = window.ctx;
var isPlaying = false;

var oscillator = audioContext.createOscillator();
oscillator.frequency.value = 300;

oscillator.connect(audioContext.destination);

var sineButton = document.querySelector('.sine-demo');
sineButton.addEventListener('click', function() {
  if (isPlaying) {
    oscillator.stop();
    isPlaying = false;
  }
  else {
    oscillator.start();
    isPlaying = true;
  }
});
// talk about value more
// talk about sawtooth waves
// learn more about the biquad filter
// talk about the analyser node?

},{}]},{},[1]);
