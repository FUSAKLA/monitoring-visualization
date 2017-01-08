


function createLayout(graph) {
    var g = new dagre.graphlib.Graph();
    g.setGraph({});
    g.edgesep = 500;
    g.nodesep = 500;

    g.setDefaultEdgeLabel(function() { return {}; });
    graph.nodes.forEach(function(node){
        node.width = 150;
        node.height = 150;
        g.setNode(node.id, node);
    });
    graph.links.forEach(function(link){
        var e = g.setEdge(link.source, link.target);
        e.weight=link.call_count
    });
    dagre.layout(g);
    lNodes = [];
    g.nodes().forEach(function(v) {
     lNodes.push(g.node(v));
    });
    return lNodes
}