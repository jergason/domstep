(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function kickOutTheJams(context) {
  var gain = context.createGain();
  var finalGain = context.createGain();
  var wob = context.createOscillator();
  var src = context.createOscillator();


  src.frequency.value = 60;
  src.type = 'sawtooth';
  src.connect(gain);


  // activate the wob
  var res = oscillateFilter(context, gain);

  res.filter.connect(finalGain);

  finalGain.gain.value = 0.5;
  finalGain.connect(context.destination);

  wob.frequency.value = 3;
  wob.connect(gain.gain);
  wob.start(0);

  return {
    lfo: res.filterLfo,
    freqLfo: wob,
    src: src,
    wob: wob,
    finalGain: finalGain
  };
}

//setTimeout(function() {
  //kickOutTheJams(beats.ctx);
//}, 3 *  1000);

function oscillateFilter(ctx, src) {
  var filterLfo = ctx.createOscillator();
  filterLfo.frequency.value = 3;
  filterLfo.start(0);

  var filterAmp = ctx.createGain();

  // control the range of frequencies we sweep through
  filterAmp.gain.value = 1000;
  filterLfo.connect(filterAmp);

  var filter = ctx.createBiquadFilter();
  filterAmp.connect(filter.frequency);
  src.connect(filter);

  return {filter: filter, filterLfo: filterLfo};
}

module.exports = kickOutTheJams;

},{}]},{},[1]);
