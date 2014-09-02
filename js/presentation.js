// bootstrap some global things that we will need for all slides
window.ctx = new AudioContext();
document.onkeydown = function(e) {
  console.log('e is', e);
}
