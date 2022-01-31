
class GraphTools{

  static randomGraph(nodes, density){
    let graph = new Array(nodes);

    let neighbours = new Array(nodes);
    for(let i = 0; i < nodes; i++){
      neighbours[i] = new Array();
    }

    for(let i = 0; i < nodes; i++){
      for(let j = 0; j < nodes; j++){
        if(j == i) continue;
        if(Math.random() < density){
          neighbours[i].push(j);
          neighbours[j].push(i);
        }
      }
    }

    for(let i = 0; i < graph.length; i++) {
      graph[i] = {
        id : i,
  			name : "",
  			value : 1,
  			neighbours : neighbours[i]
      }
    }

    return graph;
  }

  static graphToNodes(graph){
		let nodes = [];

		graph.forEach((item, i) => {
			nodes.push({
				position : new Vector2D(0, 0),
				force :  new Vector2D(0, 0)
			});
		});

		return nodes;
	}

	static graphToEdges(graph, nodes){
		let edges = [];

		graph.forEach((node, i) => {
			node.neighbours.forEach((neighbour, j) => {
				if(neighbour > i){ //to not double the edges, only undirected graphs allowed
					edges.push([nodes[i], nodes[neighbour]]);
				}
			});

		});

		return edges;
	}
}
