var Beats = require('beatsjs');
var load = require('webaudio-buffer-loader');
var wobble = require('./wobble');
var notes = require('notes-to-frequencies');

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
  //var bassWob = wobble(audioContext);


  function beatEmitter(beats) {
    //bassWob.src.frequency.setValueAtTime(notes('C1'), beats[0]);
    //bassWob.lfo.frequency.setValueAtTime(3, beats[0]);
    //wob.src.frequency.setValueAtTime(notes('G3'), beats[0]);
    //wob.src.frequency.setValueAtTime(notes('Eb3'), beats[4]);
    //wob.src.frequency.setValueAtTime(notes('F3'), beats[12]);
    //wob.src.frequency.setValueAtTime(notes('D3'), beats[14]);
    //wob.src.frequency.setValueAtTime(notes('C1'), beats[beats.length - 4]);
    wob.freqLfo.frequency.setValueAtTime(3, beats[0]);
    wob.src.frequency.setValueAtTime(notes('G#2'), beats[0]);
    wob.src.frequency.setValueAtTime(notes('G#3'), beats[2]);
    wob.src.frequency.setValueAtTime(notes('D5'), beats[4]);
    wob.src.frequency.exponentialRampToValueAtTime(notes('D4'), beats[8]);
    wob.src.frequency.setValueAtTime(notes('G#1'), beats[beats.length - 4]);

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
    //bassWob.src.start();
  });

  var stopButton = document.querySelector('.stop-the-wobble-beat');
  stopButton.addEventListener('click', function() {
    beats.stop();
    wob.src.stop();
    //bassWob.src.stop();
  });
});

var signal = audioContext.createOscillator();
signal.type = 'sawtooth';
signal.frequency.value = 80;
signal.start();

var filter = audioContext.createBiquadFilter();
signal.connect(filter);

var gain = audioContext.createGain();
gain.gain.value = 0;
filter.connect(gain);
gain.connect(audioContext.destination);



var div = document.querySelector('.beat-wah');
function wah(event) {
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
});
