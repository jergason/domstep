var ctx = window.ctx;

var signal = ctx.createOscillator();
signal.type = 'sawtooth';
signal.frequency.value = 80;
signal.start();

var filter = ctx.createBiquadFilter();
signal.connect(filter);

var gain = ctx.createGain();
gain.gain.value = 0;
filter.connect(gain);
gain.connect(ctx.destination);



var div = document.querySelector('.wah');
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
