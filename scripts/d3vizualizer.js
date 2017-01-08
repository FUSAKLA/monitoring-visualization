
var lineFunction = function(start,end) {
    var path = d3.path();
    path.moveTo(start.x, start.y);
    path.lineTo(end.x, end.y);
    path.closePath();
    return path.toString();
};

var nodeStyles = {
    server: {
        color: "white",
        image: "\uf233"
    },
    database: {
        color: "white",
        image: "\uf1c0"
    },
    unknown: {
        color: "white",
        image: "\uf059"
    }
};


 var getNodeStyle = function(labels) {
    for (var i = 0; i < labels.length; i++) {
        var label = labels[i];
        if (label == "Server"){
            return nodeStyles.server
        } else if (label == "Database"){
            return nodeStyles.database
        }
    }
    return nodeStyles.server;
};



var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

svg.append("svg:defs").append("svg:marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 14)
        .attr("refY", 0)
        .attr("markerWidth", 4)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class","arrowHead");


var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().distance(0).strength(0.001).id(function(d) { return d.id; }))
    .force('charge', function() {return 500})
    .force("strength", function(){return 0.1})
    .force("center", d3.forceCenter(width / 2, height / 2));

function vizualizeGraph(graph) {

  var path = svg.append("g")
    .attr("class", "paths")
    .selectAll("path")
    .data(graph.links)
    .enter().append("path")
      .attr("id", function(d) { return "link_"+d.id})
      .attr("class","graph_path");

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(Math.sqrt(d.value)); })
      .attr("stroke-opacity", function(d) { return Math.sqrt(d.value)/50; })
      .attr("marker-end", function() { return "url(#arrow)"})
      .attr("class","graph_link");


  var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
          .attr("r", 20)
          .attr("fill", function(d) { return color(d.labels); })
          .attr("class","graph_node")
          .attr("id", function(d) { return "node_"+d.id})
          .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));


  var node_images = svg.append("g")
      .attr("class", "node_images")
      .selectAll("text")
      .data(graph.nodes)
      .enter().append("text")


  var nodeText = svg.append("g")
      .attr("class", "node_labels")
      .selectAll("text")
      .data(graph.nodes)
      .enter()
             .append("text");

  var linkText = svg.append("g")
      .attr("class", "link_labels")
      .selectAll("text")
      .data(graph.links)
      .enter()
             .append("text")
             .attr("dy", function() { return -8 })
             .attr("text-anchor", function() { return "middle" })
             .attr("fill-opacity", function(d) { return Math.sqrt(d.value)/50; })
             .append("textPath")
              .attr("xlink:href", function(d) {return "#link_"+d.id})
              .attr("startOffset", function() {return "70%"})
              .text( function (d) { return d.value; });


  var marker = svg.append("svg:defs")
      .append("svg:marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 14)
        .attr("refY", 0)
        .attr("markerWidth", 4)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class","arrowHead");


  node.append("title")
      .text(function(d) { return d.name; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  var nodeLabels = nodeText
      .attr("dy", function() { return -23 })
      .attr("text-anchor", function() { return "middle" })
      .text( function (d) { return d.name; });

  var node_ims = node_images
      .attr("fill", function(d) { return getNodeStyle(d.labels).color; })
      .attr("dx", function() { return -10 })
      .attr("dy", function() { return 8 })
      .text(function(d) { return getNodeStyle(d.labels).image; })



  function ticked() {
    path
        .attr("d", function(d) { return lineFunction(d.source, d.target)});

    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    nodeText
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });

    node_images
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; });
  }
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}