/**
 * jsdoc2diagram
 */

'use strict';

var fs = require('fs');
var path = require('path');
var template = require('lodash.template');

/**
 * Create the tree structure need for the d3 tree diagram
 *  - original code from http://bl.ocks.org/
 *
 * @param {Array.<Object>} data
 * @return {Array}
 */
var createTreeStructure = function(data) {
  var dataMap = data.reduce(function(map, node) {
    map[node.name] = node;
    return map;
  }, {});

  // create the tree array
  var treeData = [];
  data.forEach(function(node) {
    // add to parent
    var parent = dataMap[node.parent];
    if (parent) {
      // create child array if it doesn't exist
      (parent.children || (parent.children = []))
        // add node to child array
        .push(node);
    } else {
      // parent is null or missing
      treeData.push(node);
    }
  });

  return treeData;
};

/**
 @param {TAFFY} data
 @param {object} opts
 */
exports.publish = function(data, opt) {
  data({undocumented: true}).remove();
  data({kind: 'package'}).remove();

  //an array of Doclet objects
  var docs = data().get();

  /**
   *
   * @param {string} text
   * @return {string}
   */
  var cleanName = function(text) {
    return (text || '').trim().replace(/(\#|\/|\~|\-|\:)/g, '.');
  };

  var dataSet = [];

  docs.forEach(function(doc) {
    var path = cleanName(doc.longname);
    var memberOf = cleanName(doc.memberof);
    var name = path.split('.').pop();

    dataSet.push({
      name: path,
      shortName: name,
      parent: memberOf,
      type: doc.kind || ''
    });

  });

  var mainObj = {
    shortName: 'root',
    type: 'root',
    children: createTreeStructure(dataSet)
  };

  var indexContent = fs.readFileSync(__dirname + '/tpl/index.tpl', 'utf-8');
  var mainJsContent = fs.readFileSync(__dirname + '/tpl/index.js', 'utf-8');
  var dataHtmlFile = path.join(opt.destination, '/diagram.html');

  var html = template(indexContent)({
    mainJS: mainJsContent,
    treeData: JSON.stringify(mainObj)
  });

  if (!fs.existsSync(opt.destination)) {
    fs.mkdirSync(opt.destination);
  }

  fs.writeFileSync(dataHtmlFile, html, 'utf-8');
};
