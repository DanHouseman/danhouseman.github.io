"use strict";

angular.module("App", []).controller("Controller", ["$scope", function ($scope) {

  // The different wave types that the oscillator supports.
  // By putting them on the scope we can ask Angular to
  // render a drop down for us.
  $scope.oscTypes = ["sine", "triangle", "sawtooth", "square"];
  $scope.oscType = $scope.oscTypes[0];
  $scope.octaves = 5;
  $scope.duration = 0.9;
  $scope.triggerPause = 0.09;

  var context = new (window.AudioContext || window.webkitAudioContext)();

  var frequencies = [];
  function calcFrequencies() {
    // A4 440 - A5 880
    // Go one octave up: multiply frequency by two.
    // There are twelve tones in an octave.
    // The difference between each note is twelve
    // root of two.
    var f = 65.4064; // C2 Deep C
    for (var i = 0; i < 12 * 8; i++) {
      frequencies.push(f);
      f *= Math.pow(2, 1 / 12);
    }
  }
  calcFrequencies();

  function Tone(index, destination) {
    this.index = index;
    this.destination = destination;
    this.duration = parseFloat($scope.duration);
  }
  Tone.prototype.play = function (time) {
    // Create a new oscillator each time
    var osc = context.createOscillator();
    osc.type = $scope.oscType;
    osc.frequency.value = frequencies[this.index];

    var gain = context.createGain();
    // Does not work in Edge
    //osc.connect(gain).connect(this.destination);
    osc.connect(gain);
    gain.connect(this.destination);
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + this.duration);
    osc.start(time);
    osc.stop(time + this.duration);
  };

  var tones = [];
  function createChord(indexes, octaves) {
    tones = [];
    for (var i = 0; i < octaves; i++) {
      indexes.forEach(function (index) {
        var tone = new Tone(index + 12 * i, context.destination);
        tones.push(tone);
      });
    }
  }

  $scope.chords = {
    "C Minor": [0, 3, 7],
    "C Major": [0, 4, 7],
    "C Dominant": [0, 4, 7, 10],
    "C Dim": [0, 3, 6],
    "C Maj7": [0, 4, 7, 11],
    "C Min7": [0, 3, 7, 10],
    "C Sus2": [0, 2, 7],
    "C Sus4": [0, 5, 7],
    "D Minor": [2, 5, 9],
    "D Major": [2, 6, 9],
    "E Minor": [4, 7, 11],
    "E Major": [4, 8, 11],
    "F Minor": [6, 9, 13],
    "F Major": [6, 10, 13]
  };

  function play() {
    var delay = $scope.triggerPause;
    var now = context.currentTime;

    tones.forEach(function (tone, i) {
      return tone.play(now + i * delay);
    });
    var space = tones.length * delay;
    if ($scope.down) {
      tones.reverse().forEach(function (tone, i) {
        return tone.play(now + i * delay + space);
      });
    }
  }

  $scope.play = function (chordName) {
    var chord = $scope.chords[chordName];
    createChord(chord, $scope.octaves);
    play();
  };
}]);