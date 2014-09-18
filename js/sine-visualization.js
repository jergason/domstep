var audioContext = window.ctx;
var isPlaying = false;

var oscillator = audioContext.createOscillator();
oscillator.frequency.value = 300;

oscillator.connect(audioContext.destination);

var analyzer = audioContext.createAnalyser();

var canvas = document.querySelector('canvas.sinwave').getContext('2d');

function drawFreqData() {
  var buffer = new Uint8Array(analyzer.frequencyBinCount);
  analyzer.getByteTimeDomainData(buffer);

  var barWidth = 500 / buffer.length;
  canvas.clearRect(0, 0, 500, 500);
  canvas.strokeStyle = 'blue';
  canvas.lineWidth = 2;
  canvas.beginPath();
  canvas.moveTo(0,0);
  for (var i = 0; i < buffer.length; i++) {
    var percentageHeight = buffer[i] / 256;
    var pixelHeight = percentageHeight * 500;
    var x = i * barWidth;
    canvas.lineTo(x, 500 - pixelHeight);
  }
  canvas.stroke();

  canvas.lineWidth = 2;
  canvas.strokeStyle = 'black';
  canvas.beginPath();
  canvas.moveTo(0, 250);
  canvas.lineTo(500, 250);
  canvas.stroke();

  if (isPlaying) {
    requestAnimationFrame(drawFreqData);
  }
}

oscillator.connect(analyzer);


var sineButton = document.querySelector('.sin-viz-demo');
var sineInput = document.querySelector('.sinwave-range');

sineInput.addEventListener('input', function(e) {
  console.log('sineInput.value is', sineInput.value);
  console.log('event is', e);
  oscillator.frequency.value = sineInput.valueAsNumber;
});

sineButton.addEventListener('click', function() {
  if (isPlaying) {
    oscillator.stop();
    isPlaying = false;
  }
  else {
    oscillator.start();
    isPlaying = true;
    requestAnimationFrame(drawFreqData);
  }
});


