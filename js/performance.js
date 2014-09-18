/** @jsx React.DOM */
var Beats = require('beatsjs');
var load = require('webaudio-buffer-loader');
var notes = require('notes-to-frequencies');
var vocoder = require('vocoder');
var React = require('react');
var wobble = require('./wobble');


var Drone = require('./performance/drone');
var DrumTrack = require('./performance/drumtrack');
var Vocoder = require('./performance/vocoder');
var Flight = require('./performance/flight');
var Visualize = require('./performance/visualize');
var Synth = require('./performance/synthtrack');

var audioContext = window.ctx;

var Performance = React.createClass({
  componentDidMount: function() {
    var self = this;
    var soundsToLoad = [
      '/sounds/junky.ogg',
      '/sounds/Do_K1.wav',
      '/sounds/Hgh_H2.wav',
      '/sounds/Osc_Snr.wav',
      '/sounds/Wsh_Clp2.wav'
    ];
    load(soundsToLoad, this.props.ctx, function(err, sounds) {
      var instrumentsToBuffers = {
        bd: sounds[1],
        hh: sounds[2],
        sn: sounds[3],
        cp: sounds[4]
      }

      // make sure we have something for the vocoder
      window.ourBuffer = window.ourBuffer || sounds[3];

      var beats = new Beats(self.props.ctx, instrumentsToBuffers, {bpm: 144, beatEmitter: self.beatEmitter});
      self.setState({beats: beats, carrier: sounds[0]});
    });
  },

  getInitialState: function() {
    return {beatsFunctions: []};
  },

  getDrumTracks: function(ctx, beats) {
    var mellow = 'bd| bd -- -- -- -- -- -- -- | bd -- -- -- -- -- -- -- | bd -- -- -- -- -- -- -- | bd -- -- -- -- -- -- --';
    var faster = 'bd| bd -- -- -- bd -- -- -- | bd -- -- -- bd -- -- -- | bd -- -- -- bd -- -- -- | bd -- -- -- bd -- -- --';
    var fullOn = 'bd| bd -- bd -- bd -- bd -- | bd -- bd -- bd -- bd -- | bd bd bd bd bd bd bd bd | bd bd bd bd bd bd bd bd';
    var verse = '';
verse += 'bd| bd -- -- -- -- -- -- -- | bd -- bd -- -- -- -- -- | bd -- -- -- -- -- -- -- | bd -- bd -- -- -- -- -- |\n';
verse += 'sn| -- -- -- -- sn -- -- -- | -- -- -- -- sn -- -- -- | -- -- -- -- sn -- -- -- | -- -- -- -- sn -- -- -- |\n';
verse += 'hh| -- -- hh -- -- -- hh -- | -- -- hh -- -- -- hh -- | -- -- hh -- -- -- -- -- | -- -- -- hh -- -- -- hh |';

    var chorus = '';
chorus += 'bd| bd bb -- bd -- -- -- -- | bd bd -- -- -- -- -- -- | bd bd -- bd -- -- -- -- | bd -- -- -- -- -- -- -- |\n';
chorus += 'sn| -- -- -- -- sn -- -- -- | -- -- sn -- -- -- -- -- | -- -- -- -- sn -- -- -- | -- -- -- -- sn -- -- -- |\n';
chorus += 'hh| -- -- hh hh -- -- hh hh | -- -- hh hh -- -- hh hh | -- -- hh hh -- -- hh hh | -- -- hh hh -- -- -- -- |\n';
chorus += 'cp| -- -- -- -- -- -- -- -- | -- -- -- -- -- -- -- -- | -- -- -- -- -- -- -- -- | -- -- -- -- -- -- cp cp |';

    var drumTracks = [
      {name: 'verse', track: verse},
      {name: 'chorus', track: chorus},
      {name: 'mellow', track: mellow},
      {name: 'faster', track: faster},
      {name: 'fullOn', track: fullOn},
    ];

    return drumTracks.map(function(t) {
      return <DrumTrack beats={beats} ctx={ctx} name={t.name} key={t.name} track={t.track} />
    });
  },

  beatEmitter: function(beats) {
    this.state.beatsFunctions.forEach(function(f) {
      // LATE NIGHT MADNESS
      f.beatFunction.beatFunction(beats);
    });
  },

  addBeatsFunction: function(f) {
    var beatsFunctions = this.state.beatsFunctions;
    beatsFunctions.push(f);
    this.setState({beatsFunctions: beatsFunctions});
  },

  removeBeatsFunction: function(f) {
    var beatsFunctions = this.state.beatsFunctions;
    var indexToRemove;
    for (var i = 0; i < beatsFunctions.length; i++) {
      if (beatsFunctions[i].name == f.name) {
        indexToRemove = i;
        break;
      }
    }
    //
    if (indexToRemove == null) {
      console.log('didnt find function to remove, uhoh', f, beatsFunctions);
      return;
    }
    beatsFunctions.splice(indexToRemove, 1)
    console.log('beatsFunctions is',beatsFunctions);
    this.setState({beatsFunctions: beatsFunctions});
  },

  getSynths: function(ctx, beats) {

    var wob;
    function bassWobble(beatTimes) {
      if (wob) {
        wob.src.stop();
        wob = null;
      }
      wob = wobble(ctx);
      wob.src.start();
      var triplet = 1 / ((beats.secondsPerBeat() * 2) / 3);
      var sixteenth = (beats.secondsPerBeat() * 2)
      wob.freqLfo.frequency.setValueAtTime(triplet, beatTimes[0]);
      wob.lfo.frequency.setValueAtTime(triplet, beatTimes[0]);
      wob.src.frequency.setValueAtTime(notes('A2'), beatTimes[0]);
      wob.src.frequency.setValueAtTime(notes('E2'), beatTimes[4]);
      wob.src.frequency.setValueAtTime(notes('D2'), beatTimes[8]);
      wob.src.frequency.exponentialRampToValueAtTime(notes('G2'), beatTimes[12]);
      wob.src.frequency.setValueAtTime(notes('G1'), beatTimes[beatTimes.length - 3]);
      wob.src.stop(beatTimes[beatTimes.length-1]);
    }


    var buildupWob;
    function buildup(beatTimes) {
      if (buildupWob) {
        buildupWob = null;
      }

      buildupWob = wobble(ctx);
      buildupWob.src.start();

      buildupWob.src.frequency.setValueAtTime(notes('C1'), beatTimes[0]);
      buildupWob.src.frequency.exponentialRampToValueAtTime(notes('E1'), beatTimes[2]);
      buildupWob.src.frequency.exponentialRampToValueAtTime(notes('C1'), beatTimes[3]);
      buildupWob.finalGain.gain.setValueAtTime(0.1, beatTimes[0]);
      buildupWob.finalGain.gain.exponentialRampToValueAtTime(1, beatTimes[2]);
      buildupWob.finalGain.gain.exponentialRampToValueAtTime(0.1, beatTimes[3]);

      buildupWob.src.frequency.setValueAtTime(notes('C1'), beatTimes[7]);
      buildupWob.src.frequency.exponentialRampToValueAtTime(notes('E1'), beatTimes[9]);
      buildupWob.src.frequency.exponentialRampToValueAtTime(notes('C1'), beatTimes[10]);
      buildupWob.finalGain.gain.setValueAtTime(0.1, beatTimes[7]);
      buildupWob.finalGain.gain.exponentialRampToValueAtTime(1, beatTimes[9]);
      buildupWob.finalGain.gain.exponentialRampToValueAtTime(0.1, beatTimes[10]);

      buildupWob.src.frequency.setValueAtTime(notes('C1'), beatTimes[15]);
      buildupWob.src.frequency.exponentialRampToValueAtTime(notes('E1'), beatTimes[17]);
      buildupWob.src.frequency.exponentialRampToValueAtTime(notes('C1'), beatTimes[18]);
      buildupWob.finalGain.gain.setValueAtTime(0.1, beatTimes[15]);
      buildupWob.finalGain.gain.exponentialRampToValueAtTime(1, beatTimes[17]);
      buildupWob.finalGain.gain.exponentialRampToValueAtTime(0.1, beatTimes[18]);

      buildupWob.src.frequency.setValueAtTime(notes('C1'), beatTimes[22]);
      buildupWob.src.frequency.exponentialRampToValueAtTime(notes('E1'), beatTimes[24]);
      buildupWob.src.frequency.exponentialRampToValueAtTime(notes('C1'), beatTimes[25]);
      buildupWob.finalGain.gain.setValueAtTime(0.1, beatTimes[22]);
      buildupWob.finalGain.gain.exponentialRampToValueAtTime(1, beatTimes[24]);
      buildupWob.finalGain.gain.exponentialRampToValueAtTime(0.1, beatTimes[25]);

      buildupWob.lfo.stop();
      buildupWob.freqLfo.stop();
      buildupWob.src.stop(beatTimes[beatTimes.length -1]);
    }

    var melody, melodyGain;
    function melody(beatTimes) {
      if (melody && melodyGain) {
        melody = null;
        melodyGain = null;
      }
      melody = audioContext.createOscillator();
      melody.type = 'square';
      melodyGain = audioContext.createGain();
      melody.connect(melodyGain);
      melodyGain.connect(audioContext.destination);
      melody.start();

      melodyGain.gain.value = 0.4;
      melody.frequency.setValueAtTime(notes('A3'), beatTimes[0]);
      melody.frequency.setValueAtTime(notes('d#4'), beatTimes[2]);
      melody.frequency.setValueAtTime(notes('e4'), beatTimes[3] - ((beatTimes[3] - beatTimes[2]) / 2));

      melody.frequency.setValueAtTime(notes('c4'), beatTimes[5]);
      melody.frequency.setValueAtTime(notes('f#4'), beatTimes[7]);
      melody.frequency.setValueAtTime(notes('g4'), beatTimes[8] - ((beatTimes[3] - beatTimes[2]) / 2));
      melodyGain.gain.setValueAtTime(0.001, beatTimes[9]);
      melody.stop(beatTimes[beatTimes.length - 1]);
    }

    var arp, arpGain;
    function arp(beatTimes) {
      if (arp && arpGain) {
        arp = null;
        arpGain = null;
      }
      arp = audioContext.createOscillator();
      arp.type = 'triangle';
      arpGain = audioContext.createGain();
      arp.connect(arpGain);
      arpGain.connect(audioContext.destination);
      arp.start();
      arpGain.gain.value = 0.001;
      arpGain.gain.setValueAtTime(0.5, beatTimes[17]);
      arp.frequency.setValueAtTime(notes('A4'), beatTimes[17]);
      arp.frequency.setValueAtTime(notes('c5'), beatTimes[18]);
      arp.frequency.setValueAtTime(notes('a4'), beatTimes[19]);
      arp.frequency.setValueAtTime(notes('b4'), beatTimes[20]);
      arp.frequency.setValueAtTime(notes('a4'), beatTimes[21]);
      arp.frequency.setValueAtTime(notes('g4'), beatTimes[22]);
      arpGain.gain.setValueAtTime(0.001, beatTimes[23]);

      arpGain.gain.setValueAtTime(0.5, beatTimes[25]);
      arp.frequency.setValueAtTime(notes('A4'), beatTimes[25]);
      arp.frequency.setValueAtTime(notes('c5'), beatTimes[26]);
      arp.frequency.setValueAtTime(notes('a4'), beatTimes[27]);
      arp.frequency.setValueAtTime(notes('b4'), beatTimes[28]);
      arp.frequency.setValueAtTime(notes('g4'), beatTimes[29]);
      arp.frequency.setValueAtTime(notes('d5'), beatTimes[30]);
      arpGain.gain.setValueAtTime(0.001, beatTimes[31]);
      arp.stop(beatTimes[beatTimes.length -1]);
    }

    var synthObjs = [
      {name: 'bass', beatFunction: bassWobble},
      {name: 'buildup', beatFunction: buildup},
      {name: 'melody', beatFunction: melody},
      {name: 'arp', beatFunction: arp}
    ]

    var self = this;
    return synthObjs.map(function(s) {
      return <Synth key={s.name} name={s.name} beatFunction={s} ctx={ctx}
        onSelected={self.addBeatsFunction} onDeselected={self.removeBeatsFunction} />;
    });
  },

  render: function() {
    if (!this.state.beats) {
      return <div>
        <div className="extras">
          <Drone ctx={this.props.ctx} />
        </div>
        <div className="drums">
        </div>
        <div className="tracks">
        </div>
      </div>
    }

    var drumTracks = this.getDrumTracks(this.props.ctx, this.state.beats);
    var synths = this.getSynths(this.props.ctx, this.state.beats);

    return <div className="performanceContainer">
      <div className="extras instrument-container">
        <Flight ctx={this.props.ctx} onSelected={this.addBeatsFunction} onDeselected={this.removeBeatsFunction} />
        <Drone ctx={this.props.ctx} />
        <Vocoder ctx={this.props.ctx} carrier={this.state.carrier} note='A2' />
        <Vocoder ctx={this.props.ctx} carrier={this.state.carrier} note='E2' />
        <Vocoder ctx={this.props.ctx} carrier={this.state.carrier} note='G1' />
      </div>
      <div className="drums instrument-container">
        {drumTracks}
      </div>

      <div className="synths instrument-container">
        {synths}
      </div>

      <Visualize ctx={this.props.ctx} onSelected={this.addBeatsFunction} onDeselected={this.removeBeatsFunction} />
    </div>
  }
});

React.renderComponent(<Performance ctx={audioContext} />, document.querySelector('.performance'));
