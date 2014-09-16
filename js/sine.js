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
