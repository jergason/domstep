var loader = require('webaudio-buffer-loader');

var audioContext = window.ctx;

loader('/sounds/hot-headed-woman.ogg', audioContext, function(err, steaks) {
  if (err) {
    return console.error(err);
  }
  var button = document.querySelector('.play-goodsman');
  var bufferNode = audioContext.createBufferSource();

  var isPlaying = false;
  bufferNode.buffer = steaks;
  bufferNode.connect(audioContext.destination);
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
