/** @jsx React.DOM */
var React = require('react');

// what is the canvas state?
// it stores where it is selected
// it transforms the selections into
var Track = React.createClass({
  getDefaultProps: function() {
    return {width: 500, height: 100};
  },
  componentDidMount: function() {
    // TODO: draw buffers in dom
    if (!this.props.buffer) {
      return;
    }
    this.drawBuffer();
  },

  drawBuffer: function(buffer) {
    buffer = buffer || this.props.buffer;

    var canvasContext = this.getDOMNode().getContext('2d');
    this._drawBuffer(buffer[0], canvasContext, this.props.width, this.props.height);
  },

  componentWillReceiveProps: function(nextProps) {
    function isNewBuffer(propsBuffer, newBuffer) {
      // if we don't have an old buffer but we do have a new one, state has
      // changed
      if (!propsBuffer && newBuffer) {
        return true;
      }
      return (propsBuffer && propsBuffer[0].length != newBuffer[0].length);
    }
    if (nextProps.buffer && isNewBuffer(this.props.buffer, nextProps.buffer)) {
      this.drawBuffer(nextProps.buffer);
    }
  },

  _drawBuffer: function(data, context, width, height) {
    var step = Math.ceil( data.length / width );
    var amp = height / 2;
    context.fillStyle = "silver";
    context.globalAlpha = 1;
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
  },
  getLocalX: function(e) {
    var domNode = this.getDOMNode();
    var localX = e.pageX - domNode.offsetLeft;
    return localX;
  },

  mouseDown: function(e) {
    this.clearSelection();
    this.setState({isDragging: true, selectionStart: this.getLocalX(e)});
  },

  mouseUp: function(e) {
    if (!this.state.isDragging) {
      return;
    }

    var selectionEnd = this.getLocalX(e);
    var selectionWidth = selectionEnd - this.state.selectionStart;
    var trimmedBuffer = trimBuffer(this.state.selectionStart, selectionEnd, this.props.buffer);

    // draw selection, notify parents that it was selected
    this.drawSelection(this.state.selectionStart, selectionWidth);
    this.props.onTrimmed(trimmedBuffer);

    this.setState({
      isDragging: false
      //trimmedBuffer: trimmedBuffer
    });
  },

  drawSelection: function(selectionStart, selectionWidth) {
    var canvasContext = this.getDOMNode().getContext('2d');
    canvasContext.globalAlpha = 0.2;
    canvasContext.fillRect(selectionStart, 0, selectionWidth, this.props.height);
  },

  clearSelection: function() {
    this.drawBuffer();
  },

  render: function() {
    return <canvas onMouseDown={this.mouseDown} onMouseUp={this.mouseUp}
      className="track-editor" width={this.props.width}
      height={this.props.height}>
      </canvas>
  }
});

function trimBuffer(startOffset, endOffset, buffer) {
  var startTime = xToTime(startOffset, buffer, 500);
  var endTime = xToTime(endOffset, buffer, 500);

  return clipBuffer(buffer, startTime, endTime);
}

function xToTime(x, buffer, width) {
  var len = buffer[0].length;
  // 44 kHz
  var bufferTimeLength = len / 44000;
  var secondsPerPixel = bufferTimeLength / width;

  return x * secondsPerPixel;
}

function clipBuffer(buffer, startTime, endTime) {
  var startOffset = Math.round(44000 * startTime);
  var endOffset = Math.round(44000 * endTime);
  var newBuffer = [];
  newBuffer[0] = new Float32Array(buffer[0].subarray(startOffset, endOffset));
  newBuffer[1] = new Float32Array(buffer[1].subarray(startOffset, endOffset));
  return newBuffer;
}

module.exports = Track;
