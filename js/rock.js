var loader = require('webaudio-buffer-loader');
var wavyJones = require('./wavy-jones');

var audioContext = window.ctx;

loader('./sounds/hot-headed-woman.ogg', audioContext, function(err, steaks) {
  if (err) {
    return console.error(err);
  }
  var button = document.querySelector('.goodsman-demo');
  var bufferNode = audioContext.createBufferSource();

  var isPlaying = false;
  bufferNode.buffer = steaks;

  var scope = wavyJones(audioContext, 'wavyscope');
  scope.connect(audioContext.destination);

  bufferNode.connect(scope);
  button.addEventListener('click', function() {

    if (isPlaying) {
      bufferNode.stop();
      isPlaying = false;
    }
    else {
      bufferNode.start();
      isPlaying = true;
    }
  });
});
