<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      .node {
        cursor: pointer;
      }
      .node circle {
        fill: #fff;
        stroke: steelblue;
        stroke-width: 1.5px;
      }
      .node text {
        font: 10px sans-serif;
      }
      .link {
        fill: none;
        stroke: #ccc;
        stroke-width: 1.5px;
      }
    </style>
  </head>
  <body>
    <!-- copied from http://bl.ocks.org/ -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>

    <script>
      <%= mainJS %>

      init(<%= treeData %>);
    </script>

  </body>
</html>