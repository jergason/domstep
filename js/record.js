/** @jsx React.DOM */
var Recorder = require('recorderjs');
var React = require('react');

// for React dev tools
window.React = React;
var Track = require('./record/track');
var audioContext = window.ctx;

function initAudio(cb) {
  if (!navigator.getUserMedia)
    navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  navigator.getUserMedia({audio:true}, cb, function(e) {
    alert('Error getting audio');
    console.log(e);
  });
}

var App = React.createClass({

  getInitialState: function() {
    return {recording: false};
  },

  componentDidMount: function() {
    initAudio(this.gotStream);
  },

  gotStream: function(stream) {
    var inputPoint = this.props.audioContext.createGain();

    // Create an AudioNode from the stream.
    var realAudioInput = this.props.audioContext.createMediaStreamSource(stream);
    var audioInput = realAudioInput;
    audioInput.connect(inputPoint);


    var analyserNode = this.props.audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect(analyserNode);

    this.recorder = new Recorder(inputPoint);

    var zeroGain = audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect(zeroGain);
    zeroGain.connect(audioContext.destination);
  },

  toggleRecording: function(e) {
    var shouldRecord = !this.state.recording;
    var self = this;
    if (shouldRecord) {
      this.recorder.clear();
      this.recorder.record();
      // TODO: record
    }
    else {
      this.recorder.stop();
      this.recorder.getBuffer(function(buf) {
        console.log('got a buffer, it is', buf);
        self.setState({buffer: buf});
      });
    }
    this.setState({recording: !this.state.recording});
  },

  // called when the track trims the buffer. give us back the trimmed version
  // so we can DO WHAT WE WILL WITH IT
  handleTrimmedBuffer: function(trimmedBuffer) {
    var webAudioBuffer = hydrateAudioBuffer(trimmedBuffer, this.props.audioContext);
    this.setState({trimmedBuffer: webAudioBuffer});
  },

  playSelection: function() {
    var buffer = this.state.trimmedBuffer;

    var bufferNode = this.props.audioContext.createBufferSource();
    bufferNode.buffer = buffer;
    bufferNode.connect(this.props.audioContext.destination);
    bufferNode.start();
  },

  render: function() {
    var buttonText = (this.state.recording ? 'Stop Recording' : 'Record');

    var playSelection;

    if (this.state.trimmedBuffer) {
      playSelection = <button onClick={this.playSelection}>Play Selection</button>;
    }

    return (
      <div>
        <Track buffer={this.state.buffer} onTrimmed={this.handleTrimmedBuffer} />
        <button onClick={this.toggleRecording}>{buttonText}</button>
        {playSelection}
      </div>
    )
  }
});

console.log('rendering component into ', document.querySelector('.join-our-band'));
React.renderComponent(<App audioContext={window.ctx}/>, document.querySelector('.join-our-band'));

/**
 * take an audiobuffer, a start time and an end time in seconds, and return a
 * new audiobuffer clipped to those times.
 */
function clipBuffer(buffer, startTime, endTime, context) {
  var startOffset = Math.round(buffer.sampleRate * startTime);
  var endOffset = Math.round(buffer.startTime * endTime);
  var newBuffer = context.createBuffer(2, endOffset - startOffset, context.sampleRate);
  newBuffer.getChannelData(0).set(buffer.getChannelData(0).subarray(startOffset, endOffset));
  newBuffer.getChannelData(1).set(buffer.getChannelData(1).subarray(startOffset, endOffset));

  return newBuffer;
}

/*
 * Take raw arrays of PCM data and turn them in to an AudioBuffer
 * in the Web Audio API context.
 */
function hydrateAudioBuffer(buffers, context) {
  var newBuffer = context.createBuffer(2, buffers[0].length, context.sampleRate);
  newBuffer.getChannelData(0).set(buffers[0]);
  newBuffer.getChannelData(1).set(buffers[1]);
  return newBuffer;
}
