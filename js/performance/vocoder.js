/** @jsx React.DOM */
var vocoder = require('vocoder');
var React = require('react');
var ReactAddons = require('react/addons');
var notes = require('notes-to-frequencies');

var Vocoder = React.createClass({
  getInitialState: function() {
    return {selected: false};
  },

  vocode: function() {
    var res = vocoder(this.props.ctx, this.props.carrier, window.ourBuffer);
    res.oscillatorNode.frequency.value = notes(this.props.note);
  },

  onMouseDown: function() {
    this.vocode();
    this.setState({selected: true});
  },

  onMouseLeave: function() {
    this.setState({selected: false});
  },

  render: function() {
    var cx = ReactAddons.addons.classSet;
    var classes = cx({
      'vocoder': true,
      'slected': this.state.selected
    });
    return <div className={classes} onMouseDown={this.onMouseDown}
      onMouseUp={this.onMouseLeave} onMouseLeave={this.onMouseUp}>
      {this.props.note}
    </div>
  }
});

module.exports = Vocoder;
