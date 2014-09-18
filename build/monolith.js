(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var notes = require('notes-to-frequencies');
var audioContext = window.ctx;

// LOL SO HACKY
function checkIfRevealLoaded() {
  if (!window.Reveal) {
    return setTimeout(checkIfRevealLoaded, 300);
  }

  window.Reveal.addEventListener('slidechanged', function(e) {
    if (e.indexh == 9) {
      alsoSprachZarathustra(audioContext);
    }
  });
}

// watch for when we change to our slide

function alsoSprachZarathustra(context) {
  var c5 = context.createOscillator();
  c5.type = 'sawtooth';
  c5.frequency.value = notes('C5');
  c5.connect(context.destination);

  var c5up = context.createOscillator();
  c5up.type = 'sawtooth';
  c5up.frequency.value = notes('C5');
  c5up.detune.value = 2;
  c5up.connect(context.destination);

  var c5down = context.createOscillator();
  c5down.type = 'sawtooth';
  c5down.frequency.value = notes('C5');
  c5down.detune.value = -2;
  c5down.connect(context.destination);

  c5.start();
  c5up.start();
  c5down.start();

  c5.frequency.setValueAtTime(notes('B4'), context.currentTime + 0.5);
  c5up.frequency.setValueAtTime(notes('B4'), context.currentTime + 0.5);
  c5down.frequency.setValueAtTime(notes('B4'), context.currentTime + 0.5);


  c5.stop(context.currentTime + 4);
  c5up.stop(context.currentTime + 4);
  c5down.stop(context.currentTime + 4);
}

checkIfRevealLoaded();

},{"notes-to-frequencies":2}],2:[function(require,module,exports){
var NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
/**
 * Returns the sharp equivalent of a given note. Ab becomes G#, etc.
 *
 *
 * @param note String note to convert to sharp.
 * @return {string} New sharp note.
 */
function sharp(note) {
    var numIndex = 0;

    // Note isn't flat to begin with
    if (note.indexOf('b') === -1) {
      return note;
    }

    note = note.replace('b', '#');

    // Get previous letter in alphabet.
    var newNote = String.fromCharCode(note[0].toUpperCase().charCodeAt(0) - 1);

    if (newNote === '@') {
      newNote = 'G';
    }

    // If new note is B, decrease the octave by 1.
    if (newNote === 'B') {
      numIndex = note.search(/\d/);
      if (numIndex > -1) {
        note = note.substring(0, numIndex) + (note[numIndex] - 1) + note.substring(numIndex + 1);
      }
    }

    newNote += note.substr(1);

    return newNote;
}

/**
 * Calculates the frequency of a given note.
 *
 * @param note String - Note to convert to frequency
 * @return Number Frequency of note
 */
function frequency(note) {
  if (!isValidNote(note)) {
    // always default to A4 if there isn't a note
    return 440;
  }

  var noteIndex = note.search(/\d/);
  var octave = parseInt(note.slice(-1));

  if (isNaN(octave)) {
    octave = 4;
  }

  note = sharp(note);
  var noteWithoutOctave = note;

  if (noteIndex > -1) {
    noteWithoutOctave = note.substr(0, noteIndex);
  }

  // what key on the piano this note represents
  var keyNumber = NOTES.indexOf(noteWithoutOctave.toUpperCase());
  keyNumber = keyNumber + (octave * 12);

  // how many keys above A4 (key #57)
  var floatFreq = parseFloat((440 * Math.pow(2, (keyNumber - 57) / 12)), 10);
  // round to the nearest 2 decimal places and return a Number, not a string
  return parseFloat(floatFreq.toFixed(2), 10);
}

var validNoteMatcher = /^[a-gA-G](#|b)?\d?$/;

function isValidNote(note) {
  if ((typeof note != 'string') || (note.length > 3)) {
    return false;
  }
  return validNoteMatcher.test(note);
}

module.exports = frequency;

},{}]},{},[1]);
