// https://observablehq.com/@vasturiano/musical-hexagons@184
import define1 from "./e93997d5089d7165@2211.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Musical Hexagons

Contrary to the traditional piano keyboard, this is a fully relative, two-dimensional spatial arrangement of the chromatic notes.
Equivalent intervals are always equidistant to each other and the corresponding note is played by hovering over the keys with your mouse.
Use the selectors to specify the interval of adjacent notes in either dimension, and modify the tesselation pattern.
)});
  main.variable(observer("viewof horSemitones")).define("viewof horSemitones", ["select","getIntervalName"], function(select,getIntervalName){return(
select({
  title: "Horizontal Musical Interval",
  options: [...Array(13)].map((_, semitones) => ({ value: semitones, label: getIntervalName(semitones).long })),
  value: 2
})
)});
  main.variable(observer("horSemitones")).define("horSemitones", ["Generators", "viewof horSemitones"], (G, _) => G.input(_));
  main.variable(observer("viewof diagSemitones")).define("viewof diagSemitones", ["select","getIntervalName"], function(select,getIntervalName){return(
select({
  title: "Diagonal Musical Interval",
  options: [...Array(13)].map((_, semitones) => ({ value: semitones, label: getIntervalName(semitones).long })),
  value: 7
})
)});
  main.variable(observer("diagSemitones")).define("diagSemitones", ["Generators", "viewof diagSemitones"], (G, _) => G.input(_));
  main.variable(observer("svg")).define("svg", ["html","chartWidth","chartHeight"], function(html,chartWidth,chartHeight){return(
html`<svg width="${chartWidth}px" height="${chartHeight}px">
  <g id="interval-legend" transform="translate(${chartWidth},${chartHeight})">
</svg>`
)});
  main.variable(observer()).define(["hexR","d3","svg","chartWidth","chartHeight","centralFreq","nLevels","transitionTime","noteScale","audioCtx","MIDIUtils","getIntervalName","diagSemitones","horSemitones"], function(hexR,d3,svg,chartWidth,chartHeight,centralFreq,nLevels,transitionTime,noteScale,audioCtx,MIDIUtils,getIntervalName,diagSemitones,horSemitones)
{ // d3 digest
  const hexPath = getPolygonPath(hexR, 6, Math.PI / 2);
  let gain, oscillator;

  let hexs = d3.select(svg)
    .selectAll('.hex')
    .data(
      genHexList(hexR, [chartWidth / 2, (chartHeight) / 2], centralFreq, nLevels), 
      d => d.id
    );

  // Old hexs
  hexs.exit().transition().duration(transitionTime)
    // Shrink and fade-out
    .attr('transform', d => `translate(${d.x},${d.y}) scale(0)`)
    .style('opacity', 0)
    .remove();

  // New hexs
  const newHexs = hexs.enter().append('g')
    .attr('class', 'hex')
    .attr('transform', d => `translate(${d.x},${d.y}) scale(0)`) // Scale/fade-in new hexs
    .style('opacity', 0);

  newHexs.append('path')
    .attr('d', hexPath)
    .style('fill', d => noteScale(d.name.slice(0, -1)));

  newHexs.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '.35em')
    .text(d => d.name);

  newHexs
    .on('mouseenter', function(d) {
      d3.select(this).classed('highlight', true);

      gain = audioCtx.createGain();
      gain.connect(audioCtx.destination);
      oscillator = audioCtx.createOscillator();
      oscillator.connect(gain);

      //oscillator.type = 'sine'
      oscillator.frequency.value = d.freq;
      oscillator.start();
    })
    .on('mouseleave', function() {
      d3.select(this).classed('highlight', false);

      // Fade out
      if (gain) {
        gain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.25);
      }
      if (oscillator) {
        oscillator.stop(audioCtx.currentTime + 2);
      }
    })

  // Update all
  hexs.merge(newHexs).transition().duration(transitionTime)
    .attr('transform', d => `translate(${d.x},${d.y})`)
    .style('opacity', 1);

  updLegend();

  //

  function updLegend() {
    const centralNoteNumber = MIDIUtils.frequencyToNoteNumber(centralFreq);
    const hexR = 12;
    const hexPath = getPolygonPath(hexR, 6, Math.PI / 2);

    let legendHex = d3.select('#interval-legend')
      .selectAll('.legend-hex')
      .data(genHexList(hexR, [-hexR * 7, -hexR * 7], centralFreq, 4));

    // New hexs
    const newLegendHex = legendHex.enter()
      .append('g')
      .classed('legend-hex', true);

    newLegendHex.append('path').attr('d', hexPath);

    newLegendHex.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em');

    // Update
    legendHex = legendHex.merge(newLegendHex);

    legendHex
      .classed('central-hex', d => MIDIUtils.frequencyToNoteNumber(d.freq) === centralNoteNumber)
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .select('text')
      .text(d => {
        const intervalNum = MIDIUtils.frequencyToNoteNumber(d.freq) - centralNoteNumber
        return `${intervalNum < 0 ? '-' : ''}${getIntervalName(Math.abs(intervalNum)).short}`
      });
  }

  function genHexList(r, centerXy, centralFreq, levels) {
    levels += (levels % 2) ? 0 : 1; // Round up to nearest odd number
    
    const diagonalUpSemitones = diagSemitones;
    const diagonalDownSemitones = horSemitones - diagSemitones;
    const leftFreq = centralFreq * getIntervalRatio(-horSemitones * (levels - 1) / 2);
    const leftXy = centerXy;

    let noteCnt = {}; // Keep track of which notes are added to assign a unique ID to each

    leftXy[0] -= (levels - 1) * r; // Left side of the row

    // Central row
    let hexs = buildRow(r, leftXy, leftFreq, levels);

    d3.range(1, (levels - 1) / 2 + 1).forEach(i => {
      const offset = [i * r * 2 * Math.cos(Math.PI / 3), i * r * 2 * Math.sin(Math.PI / 3)];

      hexs.push(
        // Up-right
        ...buildRow(r, [leftXy[0] + offset[0], leftXy[1] - offset[1]], leftFreq * getIntervalRatio(i * diagonalUpSemitones), levels - i),
        // Down-right
        ...buildRow(r, [leftXy[0] + offset[0], leftXy[1] + offset[1]], leftFreq * getIntervalRatio(i * diagonalDownSemitones), levels - i)
      );
    });

    return hexs;

    //

    function buildRow(r, xy, freq, levels) {
      const hexs = [];
      const horizInterval = getIntervalRatio(horSemitones);

      let carryX = xy[0];
      let carryFreq = freq;

      while (levels) {
        const noteNum = MIDIUtils.frequencyToNoteNumber(carryFreq);

        if (noteNum>=12 && noteNum <= 126) { // Ignore notes below C0 (12) or above F#9 (126)
          const noteName = MIDIUtils.noteNumberToName(noteNum).replace(/-/, '');

          // Assign unique id (noteName + counter)
          if (!noteCnt.hasOwnProperty(noteName)) noteCnt[noteName] = 0;
          noteCnt[noteName]++;
          const id = `${noteName}-${noteCnt[noteName]}`;

          hexs.push({
            x: carryX,
            y: xy[1],
            freq: carryFreq,
            name: noteName,
            id: id
          });
        }

        carryX += r * 2;
        carryFreq *= horizInterval;
        levels--;
      }

      return hexs;
    }

    function getIntervalRatio(numSemitones) {
      // Equal temperament
      return Math.pow(2, numSemitones / 12);
    }
  }

  function getPolygonPath(r, nSides, startAngle) {
    let d = '';

    d3.range(nSides).map(side => {
      const angle = startAngle + 2 * Math.PI * side / nSides;
      return [r * Math.cos(angle), r * Math.sin(angle)];
    }).forEach(pt => {
      d += (d.length ? 'L' : 'M') + pt.join(',');
    });

    return d + 'Z';
  }
}
);
  main.variable(observer("audioCtx")).define("audioCtx", function(){return(
new (window.AudioContext || window.webkitAudioContext)()
)});
  main.variable(observer("getIntervalName")).define("getIntervalName", function(){return(
function getIntervalName(semitones) {
    const shortNames = ['', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', 'M7',
        'oct', 'b9', '9', 'b10', '10', '11', '#11', '12', 'b13', '13', 'b14', '14', '2-oct'],
        longNames = ['Unisson', 'Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Tritone',
        'Perfect 5th', 'Minor 6th', 'Major 6th', 'Minor 7th', 'Major 7th', 'Octave', 'Minor 9th', 'Major 9th',
        'Minor 10th', 'Major 10th', '11', '#11th', '12', 'Minor 13', 'Major 13', 'Minor 14', 'Major 14', 'Double Octave']

    return {
        short: shortNames[semitones],
        long: longNames[semitones]
    }
}
)});
  main.variable(observer("noteScale")).define("noteScale", ["d3","schemeCategory20c"], function(d3,schemeCategory20c){return(
d3.scaleOrdinal(schemeCategory20c)
    .domain(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])
)});
  main.variable(observer("schemeCategory20c")).define("schemeCategory20c", function(){return(
["#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#e6550d", "#fd8d3c", "#fdae6b", "#fdd0a2", "#31a354", "#74c476", "#a1d99b", "#c7e9c0", "#756bb1", "#9e9ac8", "#bcbddc", "#dadaeb", "#636363", "#969696", "#bdbdbd", "#d9d9d9"]
)});
  main.variable(observer()).define(["md"], function(md){return(
md`**Settings**`
)});
  main.variable(observer("chartWidth")).define("chartWidth", ["width"], function(width){return(
width
)});
  main.variable(observer("chartHeight")).define("chartHeight", ["hexR","nLevels"], function(hexR,nLevels){return(
hexR * nLevels * 1.75
)});
  main.variable(observer("hexR")).define("hexR", function(){return(
28
)});
  main.variable(observer("nLevels")).define("nLevels", function(){return(
13
)});
  main.variable(observer("centralFreq")).define("centralFreq", function(){return(
261.6
)});
  main.variable(observer("transitionTime")).define("transitionTime", function(){return(
900
)});
  main.variable(observer()).define(["md"], function(md){return(
md`**Style**`
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<style>
.hex path {
    stroke: darkslategrey;
    stroke-width: 0;
    opacity: 0.85;
}

.hex.highlight path {
    opacity: 1;
    stroke-width: 2;
}

.hex text, .legend-hex text {
    font-family: Sans-Serif;
    fill: #333;
    pointer-events: none;
}

.hex text {
    font-size: 14px;
}

.legend-hex text {
    font-size: 11px;
}

.legend-hex path {
    fill: #CCE;
}

.legend-hex.central-hex path {
    fill: rebeccapurple;
}
</style>`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`**Dependencies**`
)});
  main.variable(observer("MIDIUtils")).define("MIDIUtils", ["require"], function(require){return(
require('midiutils')
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3', 'd3-scale-chromatic')
)});
  const child1 = runtime.module(define1);
  main.import("select", child1);
  return main;
}
