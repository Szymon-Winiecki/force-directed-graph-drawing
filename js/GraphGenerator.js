
class GraphGenerator{

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
}
