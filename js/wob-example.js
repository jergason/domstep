var audioContext = window.ctx;

var startButton = document.querySelector('.wob-it-up');
var stopButton = document.querySelector('.stop-wob-it-up');

var carrier = audioContext.createOscillator();
carrier.frequency.value = 300;

var gain = audioContext.createGain();
carrier.connect(gain);
gain.connect(audioContext.destination);

var wob = audioContext.createOscillator();
wob.frequency.value = 3;

// connect to the audioparam, not the node itself
wob.connect(gain.gain);
wob.start();

function startWob() {
  carrier.start();
}

function stopWob() {
  carrier.stop();
}

startButton.addEventListener('click', startWob);
stopButton.addEventListener('click', stopWob);
