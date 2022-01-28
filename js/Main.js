window.onload = start;

function start(){

	/*let data = [
		{
			id : 0,
			name : "",
			value : 1,
			xpos : 100,
			ypos : 100,
			neighbours : [1, 2]
		},
		{
			id : 1,
			name : "",
			value : 1,
			xpos : 150,
			ypos : 100,
			neighbours : [0, 2]
		},
		{
			id : 2,
			name : "",
			value : 1,
			xpos : 125,
			ypos : 150,
			neighbours : [0, 1, 3]
		},
		{
			id : 3,
			name : "",
			value : 2,
			xpos : 170,
			ypos : 200,
			neighbours : [2]
		},
	];*/
	let data = GraphGenerator.randomGraph(40, 0.04);
	let options = {

	};
	let forceGraph = new ForceDirectedGraph(data, "#graph-container", options);
	forceGraph.start();
}
