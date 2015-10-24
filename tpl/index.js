/**
 * jsdoc2diagram
 *
 * copied from http://bl.ocks.org/d3noob/8329404
 */

/*global d3*/

'use strict';

var treeData = {};
var margin = {top: 20, right: 50, bottom: 20, left: 50};
var width = 400 - margin.right - margin.left;
var height = 500 - margin.top - margin.bottom;
var duration = 0;
var tree = d3.layout.tree().size([height, width]);

var diagonal = d3.svg.diagonal()
  .projection(function(d) {
    return [d.y, d.x];
  });

var svg = d3.select('body').append('svg')
  .attr('id', 'diagram')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function update(source) {
  // Compute the new tree layout.
  var i = 0;
  var nodes = tree.nodes(treeData).reverse();
  var links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) {
    d.y = d.depth * 180;
  });

  // Update the nodes…
  var node = svg.selectAll('g.node')
    .data(nodes, function(d) {
      return d.id || (d.id = ++i);
    });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr('transform', function(d) {
      return 'translate(' + source.y0 + ',' + source.x0 + ')';
    })
    .on('click', click);

  nodeEnter.append('text')
    .text(function(d) {
      return d.shortName + (d.type === 'function' ? '()' : '');
    })
    .attr('x', function(d) {
      return d.children || d._children ? -10 : 10;
    })
    .attr('dy', '.35em')
    .attr('text-anchor', function(d) {
      return d.children || d._children ? 'end' : 'start';
    })
    .style('fill-opacity', 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
    .duration(duration)
    .attr('transform', function(d) {
      return 'translate(' + d.y + ',' + d.x + ')';
    });

  nodeUpdate.select('circle')
    .attr('r', 4.5);

  var allTextNodes = nodeEnter.select('text');
  allTextNodes.each(function(d, index) {
    var textNodeParent = d3.select(allTextNodes[0][index].parentNode);
    if (d.type.match(/(root|class|function)/)) {
      textNodeParent.append('circle')
        .attr('r', 5)
        .attr('class', d.type);
    } else {
      textNodeParent.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('x', -5)
        .attr('y', -5)
        .attr('class', d.type);
    }
  });

  nodeUpdate.select('text')
    .style('fill-opacity', 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr('transform', function(d) {
      return 'translate(' + source.y + ',' + source.x + ')';
    })
    .remove();

  nodeExit.select('circle')
    .attr('r', 1e-6);

  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // Update the links…
  var link = svg.selectAll('path.link')
    .data(links, function(d) {
      return d.target.id;
    });

  // Enter any new links at the parent's previous position.
  link.enter().insert('path', 'g')
    .attr('class', 'link')
    .attr('d', function(d) {
      var o = {x: source.x0, y: source.y0};
      return diagonal({source: o, target: o});
    });

  // Transition links to their new position.
  link.transition()
    .duration(duration)
    .attr('d', diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(duration)
    .attr('d', function(d) {
      var o = {x: source.x, y: source.y};
      return diagonal({source: o, target: o});
    })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // adjust the width/height
  setTimeout(function(){
    var d = d3.select('#diagram');
    var w = svg[0][0].getBBox().width;
    var h = svg[0][0].getBBox().height;
    d[0][0].style.width = (w + 100);
    d[0][0].style.height = (h + 100);
  }, 100);
}

function init(data) {
  data.x0 = height / 2;
  data.y0 = 0;
  treeData = data;
  update(data);
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}
