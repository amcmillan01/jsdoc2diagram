<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      .node {
        cursor: pointer;
      }
      .node circle, .node rect {
        stroke-width: 1.5px;
        stroke: #4169e1;
        fill: #fff;
      }
      .node text {
        font: 11px sans-serif;
      }
      .link {
        fill: none;
        stroke: #ccc;
        stroke-width: 1.5px;
      }
      .node .root {
        stroke: #4169e1;
        fill: #35a6ff;
        r: 7;
      }
      .node .class {
        stroke: #4169e1;
        fill: #7cbbff;
      }
      .node .function{
        stroke: #a0522d;
        fill: #deb887;
      }
    </style>
  </head>
  <body>
    <!-- copied from http://bl.ocks.org/d3noob/8329404 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>

    <script>
      <%= mainJS %>

      init(<%= treeData %>);
    </script>

  </body>
</html>