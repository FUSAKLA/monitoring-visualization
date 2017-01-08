
var urlSource = {
    url: "http://localhost:7474",
    user: "neo4j",
    pass: "sklik"
};

var query = "MATCH (start)-[link]->(end) RETURN *;"

var neo = new Neo(urlSource);

neo.executeQuery(query,{},function(err,res) {
    res = res || {};

    var layout_nodes = createLayout(res.graph);
    res.graph.nodes = layout_nodes;

    console.log(res.graph);
    vizualizeGraph(res.graph);

});

