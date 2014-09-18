/** @jsx React.DOM */
var React = require('react');
var ReactAddons = require('react/addons');

var SynthTrack = React.createClass({
  getInitialState: function() {
    return {selected: false};
  },

  toggleSelected: function() {
    var selected = !this.state.selected;

    if (selected) {
      this.props.onSelected({name: this.props.name, beatFunction: this.props.beatFunction});
    }
    else {
      this.props.onDeselected({name: this.props.name, beatFunction: this.props.beatFunction});
    }

    this.setState({selected: selected});
  },

  render: function() {
    var cx = ReactAddons.addons.classSet;
    var classes = cx({
      selected: this.state.selected,
      'synth': true
    });

    return <div className={classes} onClick={this.toggleSelected}>
      {this.props.name}
    </div>
  }
});

module.exports = SynthTrack;
