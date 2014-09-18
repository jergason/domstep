/** @jsx React.DOM */
var React = require('react');
var Boids = require('boids');
var ticker = require('ticker');

function audioContextTimeToTimeoutTime(ctx, contextTime) {
  var deltaSeconds = Math.max(contextTime - ctx.currentTime, 0);
  return deltaSeconds * 1000;
}

var FlockingVisualization = React.createClass({
  getDefaultProps: function() {
    return {width: 500, height: 500};
  },

  getInitialState: function() {
    return {selected: false};
  },

  componentDidMount: function() {
    // start the boids ticking
    var boids = new Boids({speedLimit: 3, accelerationLimit: 0.45, boids: 150});
    var self = this;

    this.boids = boids;
    var canvas = this.getDOMNode().querySelector('canvas').getContext('2d');
    ticker(window, 60).on('tick', function() {
      if (self.state.selected) {
        boids.tick();
        self.draw(boids, canvas);
      }
    });
  },

  draw: function(boids, canvasContext) {
    var boidData = boids.boids;
    var halfHeight = this.props.height/2;
    var halfWidth = this.props.width/2;

    canvasContext.fillStyle = 'rgba(255,241,235,0.25)' // '#FFF1EB'
    canvasContext.fillRect(0, 0, this.props.width, this.props.height)

    canvasContext.fillStyle = '#543D5E'
    for (var i = 0, l = boidData.length, x, y; i < l; i += 1) {
      x = boidData[i][0]; y = boidData[i][1]
      // wrap around the screen
      boidData[i][0] = x > halfWidth ? -halfWidth : -x > halfWidth ? halfWidth : x
      boidData[i][1] = y > halfHeight ? -halfHeight : -y > halfHeight ? halfHeight : y
      canvasContext.fillRect(x + halfWidth, y + halfHeight, 2, 2)
    }
  },

  toggleSelected: function() {
    var selected = !this.state.selected;

    if (selected) {
      this.props.onSelected({name: 'visualization', beatFunction: {name: 'visualization', beatFunction: this.beatEmitter.bind(this)}});
    }
    else {
      this.props.onDeselected({name: 'visualization', beatFunction: {name: 'visualization', beatFunction: this.beatEmitter.bind(this)}});
    }

    this.setState({selected: selected});
  },

  beatEmitter: function(beatTimes) {
    var self = this;
    var explodeTime = audioContextTimeToTimeoutTime(this.props.ctx, beatTimes[0]);
    var collapseTime = audioContextTimeToTimeoutTime(this.props.ctx, beatTimes[3]);

    setTimeout(function() {
      self.boids.cohesionForce = 0.1;
    }, explodeTime);

    setTimeout(function() {
      self.boids.cohesionForce = 0.9;
    }, collapseTime);
  },

  render: function() {
    return <div className="visualization">
      <canvas width={this.props.width} height={this.props.height}></canvas>
      <br />
      <button onClick={this.toggleSelected}>Toggle Visualization</button>
    </div>
  }
});

module.exports = FlockingVisualization;
