/** @jsx React.DOM */
var React = require('react');
var ReactAddons = require('react/addons');

function audioContextTimeToTimeoutTime(ctx, contextTime) {
  var deltaSeconds = Math.max(contextTime - ctx.currentTime, 0);
  return deltaSeconds * 1000;
}

var Flight = React.createClass({
  componentDidMount: function() {
    this.socket = window.io('http://localhost');
  },

  getInitialState: function() {
    return {selected: false};
  },

  beatEmitter: function(beats) {
    var self = this;
    var beatTime = audioContextTimeToTimeoutTime(this.props.ctx, beats[0]);
    setTimeout(function() {
      self.socket.emit('beat');
    }, beatTime);
  },

  toggleSelected: function() {
    var selected = !this.state.selected;

    if (selected) {
      this.socket.emit('takeoff');
      this.props.onSelected({name: 'flight', beatFunction: this.beatEmitter});
    }
    else {
      this.socket.emit('land');
      this.props.onDeselected({name: 'flight', beatFunction: this.beatEmitter});
    }

    this.setState({selected: selected});
  },

  render: function() {
    var cx = ReactAddons.addons.classSet;
    var classes = cx({
      selected: this.state.selected,
      'flight': true
    });

    var flightText = (this.state.selected ? 'Land' : 'Take Flight');
    return <div className={classes} onClick={this.toggleSelected}>
      {flightText}
    </div>
  }
});

module.exports = Flight;
