var audioContext = window.ctx;
var isPlaying = false;

window.oscillator = audioContext.createOscillator();
oscillator.frequency = 300;

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
