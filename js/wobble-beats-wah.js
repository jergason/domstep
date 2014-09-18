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
  var bassWob = wobble(audioContext);

  var melody = audioContext.createOscillator();
  melody.type = 'triangle';
  var melodyGain = audioContext.createGain();
  melody.connect(melodyGain);
  melodyGain.connect(audioContext.destination);
  melodyGain.gain.value = 0.001;

  function beatEmitter(beatTimes) {
    // TODO: record wah track, play it back
    // a e d g
    //bassWob.src.frequency.setValueAtTime(notes('C1'), beats[0]);
    //bassWob.lfo.frequency.setValueAtTime(3, beats[0]);
    //wob.src.frequency.setValueAtTime(notes('G3'), beats[0]);
    //wob.src.frequency.setValueAtTime(notes('Eb3'), beats[4]);
    //wob.src.frequency.setValueAtTime(notes('F3'), beats[12]);
    //wob.src.frequency.setValueAtTime(notes('D3'), beats[14]);
    //wob.src.frequency.setValueAtTime(notes('C1'), beats[beats.length - 4]);

    melodyGain.gain.setValueAtTime(0.001, beatTimes[0]);
    melodyGain.gain.setValueAtTime(0.6, beatTimes[17]);
    melody.frequency.setValueAtTime(notes('A4'), beatTimes[17]);
    melody.frequency.setValueAtTime(notes('c5'), beatTimes[18]);
    melody.frequency.setValueAtTime(notes('a4'), beatTimes[19]);
    melody.frequency.setValueAtTime(notes('b4'), beatTimes[20]);
    melody.frequency.setValueAtTime(notes('a4'), beatTimes[21]);
    melody.frequency.setValueAtTime(notes('g4'), beatTimes[22]);
    melodyGain.gain.setValueAtTime(0.01, beatTimes[23]);

    melodyGain.gain.setValueAtTime(0.6, beatTimes[25]);
    melody.frequency.setValueAtTime(notes('A4'), beatTimes[25]);
    melody.frequency.setValueAtTime(notes('c5'), beatTimes[26]);
    melody.frequency.setValueAtTime(notes('a4'), beatTimes[27]);
    melody.frequency.setValueAtTime(notes('b4'), beatTimes[28]);
    melody.frequency.setValueAtTime(notes('g4'), beatTimes[29]);
    melody.frequency.setValueAtTime(notes('d5'), beatTimes[30]);
    melodyGain.gain.setValueAtTime(0.01, beatTimes[31]);

    var triplet = 1 / ((beats.secondsPerBeat() * 2) / 3);
    var sixteenth = (beats.secondsPerBeat() * 2)
    wob.freqLfo.frequency.setValueAtTime(triplet, beatTimes[0]);
    wob.lfo.frequency.setValueAtTime(triplet, beatTimes[0]);
    wob.src.frequency.setValueAtTime(notes('A2'), beatTimes[0]);
    wob.src.frequency.setValueAtTime(notes('E2'), beatTimes[4]);
    wob.src.frequency.setValueAtTime(notes('D2'), beatTimes[8]);
    wob.src.frequency.exponentialRampToValueAtTime(notes('G2'), beatTimes[12]);
    wob.src.frequency.setValueAtTime(notes('G1'), beatTimes[beatTimes.length - 3]);
  }

  var beats = new Beats(audioContext, instrumentsToBuffers, {beatEmitter: beatEmitter, bpm: 144});


  var textarea = document.querySelector('.wobble-beats');
  var button = document.querySelector('.drop-the-wobble-beat');
  var isPlaying = false;

  button.addEventListener('click', function() {
    console.log('click called!');
    var text = textarea.value;
    var track = beats.notation(text);
    beats.startPlaying(track);
    wob.src.start();
    melody.start();
  });

  var stopButton = document.querySelector('.stop-the-wobble-beat');
  stopButton.addEventListener('click', function() {
    beats.stop();
    wob.src.stop();
    melody.stop();
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
