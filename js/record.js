var Recorder = require('recorderjs');
var audioContext = window.ctx;

/**
 * TODO: get user media
 * draw buffer to canvas
 * detect click and drag events on canvs
 * edit buffer
 * save somewhere once edited
 */

var recorder = null;

function drawBuffer(width, height, context, data) {
  var step = Math.ceil( data.length / width );
  var amp = height / 2;
  context.fillStyle = "silver";
  context.clearRect(0,0,width,height);
  for(var i=0; i < width; i++) {
    var min = 1.0;
    var max = -1.0;
    for (j=0; j<step; j++) {
      var datum = data[(i*step)+j];
      if (datum < min)
        min = datum;
      if (datum > max)
        max = datum;
    }
    context.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
  }
}



function gotBuffers( buffers ) {
  var canvas = document.querySelector('.clip-editor');
  drawBuffer(canvas.width, canvas.height, canvas.getContext('2d'), buffers[0]);
}

var isRecording = false;

function toggleRecording(e) {
  console.log('e is', e);
  if (isRecording) {
    console.log('stopping recording');
    // stop recording
    recorder.stop();
    recorder.getBuffer( gotBuffers );
    isRecording = false;
  } else {
    console.log('recording');
    // start recording
    if (!recorder)
      return;
    isRecording = true;
    recorder.clear();
    recorder.record();
  }
}

function gotStream(stream) {
  var inputPoint = audioContext.createGain();

  // Create an AudioNode from the stream.
  var realAudioInput = audioContext.createMediaStreamSource(stream);
  var audioInput = realAudioInput;
  audioInput.connect(inputPoint);


  var analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 2048;
  inputPoint.connect( analyserNode );

  recorder = new Recorder( inputPoint );

  var zeroGain = audioContext.createGain();
  zeroGain.gain.value = 0.0;
  inputPoint.connect( zeroGain );
  zeroGain.connect( audioContext.destination );
}

function initAudio() {
  if (!navigator.getUserMedia)
    navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  navigator.getUserMedia({audio:true}, gotStream, function(e) {
    alert('Error getting audio');
    console.log(e);
  });
}

window.addEventListener('load', initAudio);


var recordButton = document.querySelector('button.record');
recordButton.addEventListener('click', toggleRecording);
