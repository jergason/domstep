var Beats = require('beatsjs');
var load = require('webaudio-buffer-loader');

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

  var beats = new Beats(audioContext, instrumentsToBuffers);

  var textarea = document.querySelector('.beats');
  var button = document.querySelector('.drop-the-beat');
  var isPlaying = false;

  button.addEventListener('click', function() {
    var text = textarea.value;
    var track = beats.notation(text);
    beats.startPlaying(track);
  });

  var stopButton = document.querySelector('.stop-the-beat');
  stopButton.addEventListener('click', function() {
    beats.stop();
  });
});
