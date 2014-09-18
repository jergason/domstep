/** @jsx React.DOM */
var React = require('React');
var ReactAddons = require('react/addons');

var DrumTrack = React.createClass({
  getInitialState: function() {
    return {selected: false};
  },

  onClick: function() {
    var selected = !this.state.selected;

    if (!selected) {
      this.props.beats.stop();
    }
    else {
      var track = this.props.beats.notation(this.props.track);
      this.props.beats.startPlaying(track);
    }

    this.setState({selected: selected});
  },

  unselect: function() {
    this.setState({selected: false});
  },

  render: function() {
    var cx = ReactAddons.addons.classSet;
    var classes = cx({
      'instrument': true,
      selected: this.state.selected
    })
    return <div className={classes} onClick={this.onClick}>
      {this.props.name}
    </div>
  }
});

module.exports = DrumTrack;
