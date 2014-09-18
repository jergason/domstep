/** @jsx React.DOM */
var notes = require('notes-to-frequencies');
var React = require('react');

function drone(pitch, ctx) {
  var nodes = {};
  nodes.source = ctx.createOscillator();
  nodes.source.type = 3;
  nodes.filter = ctx.createBiquadFilter();
  nodes.volume = ctx.createGain();
  nodes.filter.type = 2; //0 is a low pass filter
  nodes.volume.gain.value = 5;
  var i = 0;
  setInterval(function() {
    i += ((Math.PI * 2) / 30);
    nodes.filter.frequency = (((Math.sin(i) / 2) + 1) * 400);
  }, 32);
  nodes.source.connect(nodes.filter);
  nodes.filter.connect(nodes.volume);

  nodes.volume.connect(ctx.destination);

  //pitch val
  nodes.source.frequency.value = pitch;
  //frequency val
  nodes.filter.frequency.value = 100;
  nodes.source.start();
  return nodes
}

var Drone = React.createClass({
  getInitialState: function() {
    return {droning: false, drones: []};
  },
  toggleDrone: function() {
    console.log('ctx is', this.props.ctx);
    var droning = !this.state.droning;
    var drones = [];
    if (droning) {
      drones = [drone(82, this.props.ctx), drone(82 + 0.13, this.props.ctx)];
    }
    else {
      this.state.drones.forEach(function(d) {d.source.stop();});
      drones = [];
    }
    this.setState({droning: droning, drones: drones});
  },

  render: function() {
    return <div className={"drone"}>
      <button className={"hurp durp"} onClick={this.toggleDrone}>Toggle Drone</button>
    </div>
  }
});

module.exports = Drone;
