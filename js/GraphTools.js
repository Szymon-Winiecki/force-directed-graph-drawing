
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


  //Ganerates tree with Prüfer sequence
  static randomTree(nodes){
    let prufer = new Array(nodes-2);
    for(let i = 0; i < prufer.length; i++){
      prufer[i] = parseInt(Math.random() * (nodes-1));
    }

    let left = new Array(nodes);
    for(let i = 0; i < left.length; i++){
      left[i] = i;
    }
    left = left.filter(x => !prufer.includes(x));

    let neighbours = new Array(nodes);
    for(let i = 0; i < nodes; i++){
      neighbours[i] = new Array();
    }

    let removed = new Array();

    while(prufer.length > 0){

      let a = left.shift();
      let b = prufer.shift();

      neighbours[a].push(b);
      neighbours[b].push(a);

      removed.push(a);
      if(removed.includes(b) || prufer.includes(b)){
        continue;
      }
      for(let j = 0; j < left.length; j++){
        if(left[j] == b){
          break;
        }
        if(left[j] > b){
          left.splice(j, 0, b);
          break;
        }
        if(j == left.length-1){
          left.append(b);
        }
      }
    }

    neighbours[left[0]].push(left[1]);
    neighbours[left[1]].push(left[0]);


    let tree = new Array(nodes);
    for(let i = 0; i < tree.length; i++) {
      tree[i] = {
        id : i,
  			name : "",
  			value : 1,
  			neighbours : neighbours[i]
      }
    }

    return tree;

  }

  static graphToNodes(graph){
		let nodes = [];

		graph.forEach((item, i) => {
			nodes.push({
				position : new Vector2D(0, 0),
				force :  new Vector2D(0, 0),
        neighbours : new Array()
			});
		});

    graph.forEach((item, i) => {
      item.neighbours.forEach((neighbour, j) => {
        nodes[i].neighbours.push(nodes[neighbour]);
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
