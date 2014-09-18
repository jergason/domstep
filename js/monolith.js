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
