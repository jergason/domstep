var Beats = require('beatsjs');
var load = require('webaudio-buffer-loader');
var wobble = require('./wobble');

var audioContext = window.ctx;
var buffers = ['./sounds/hh.wav', './sounds/bd.wav', './sounds/sn.wav'];
load(buffers, audioContext, function(err, buffers) {
  if (err) {
    console.error('error loading buffers!');
    return console.error(err);
  }

  var instrumentsToBuffers = {
    hh: buffers[0],
    bd: buffers[1],
    sn: buffers[2]
  };

  var wob = wobble(audioContext);

  function beatEmitter(beats) {
    wob.src.frequency.setValueAtTime(100, beats[0]);
    wob.src.frequency.setValueAtTime(200, beats[2]);
    wob.src.frequency.setValueAtTime(600, beats[4]);
    wob.src.frequency.exponentialRampToValueAtTime(300, beats[8]);
    wob.src.frequency.setValueAtTime(50, beats[beats.length - 4]);

    wob.lfo.frequency.setValueAtTime(3, beats[0]);
    wob.freqLfo.frequency.setValueAtTime(3, beats[0]);
    wob.lfo.frequency.setValueAtTime(2, beats[beats.length - 4]);
    wob.freqLfo.frequency.setValueAtTime(2, beats[beats.length - 4]);
  }

  var beats = new Beats(audioContext, instrumentsToBuffers, {beatEmitter: beatEmitter});


  var textarea = document.querySelector('.wobble-beats');
  var button = document.querySelector('.drop-the-wobble-beat');
  var isPlaying = false;

  button.addEventListener('click', function() {
    var text = textarea.value;
    var track = beats.notation(text);
    beats.startPlaying(track);
    wob.src.start();
  });

  var stopButton = document.querySelector('.stop-the-wobble-beat');
  stopButton.addEventListener('click', function() {
    beats.stop();
    wob.src.stop();
  });
});
