class ForceDirectedGraph{

	data = [];
	nodes = [];
	edges = [];

	parentSelector;

	style = {
		width : 600,
		height : 600,
		background : "#FFF",
		nodeRadius : 10,
		nodeColor : "#555",
		edgeWidth : 2,
		edgeColor : "#CCC",
	}

	simulation = {
		edgeForceMultiplier : 2,
		edgeLength : 70,
		internodesForceMultiplier : 70,
		forceMultiplier : 1,
		forceThreshold: 0.5,
		temperature : (frame) => {
			let max = Math.min(this.style.width, this.style.height) * 0.01;
			let finalFrame = 150;
			frame = Math.min(frame, finalFrame);
			let progress = frame/finalFrame;
			return (1 - progress) * max;
		}
	}

	time = {
		startTime : 0,
		lastFrameTime : 0,
		deltaTime : 0,
		framesCount : 0
	}

	options = {
		framerate : 60,
		frametime : 16
	}


	constructor(data, parentSelector, style){
		this.data = data;
		this.nodes = this.buildNodesArray();
		this.edges = this.buildEdgesArray();

		this.parentSelector = parentSelector;

		if(style.width) this.style.width = width;
		if(style.height) this.style.height = height;
		if(style.background) this.style.background = background;
		if(style.nodeRadius) this.style.nodeRadius = nodeRadius;
		if(style.nodeColor) this.style.nodeColor = nodeColor;
		if(style.edgeWidth) this.style.edgeWidth = edgeWidth;
		if(style.edgeColor) this.style.edgeColor = edgeColor;
	}

	buildNodesArray(){
		let nodes = [];

		this.data.forEach((item, i) => {
			nodes.push({
				position : this.randomPosition(this.style.nodeRadius * 0.5),
				force :  new Vector2D(0, 0)
			});
		});

		return nodes;
	}

	buildEdgesArray(){
		let edges = [];

		this.data.forEach((node, i) => {
			node.neighbours.forEach((neighbour, j) => {
				if(neighbour > i){ //to not double the edges, only undirected graphs allowed
					edges.push([this.nodes[i], this.nodes[neighbour]]);
				}
			});

		});

		return edges;
	}

	start(){
		this.time.startTime = Date.now();
		this.time.lastFrameTime = this.time.startTime;

		this.options.frametime = 1000/this.options.framerate

		//this.simulation.temperature =

		this.update();
	}

	update(){

		this.calcForces();
		this.applyForces();

		this.drawGraph();


		//frametime managment
		//console.log((this.time.lastFrameTime-this.time.startTime)/this.time.framesCount); //avg frametime
		let nzk = d3.max([this.time.deltaTime - this.options.frametime, 0]); //TODO: change name
		this.time.framesCount++;
		let currentTime = Date.now();
		this.time.deltaTime = currentTime - this.time.lastFrameTime;
		this.time.lastFrameTime = currentTime;

		setTimeout(this.update.bind(this), d3.max([1, this.options.frametime - nzk])); //TODO: change to conditional upate AND protect from < 0 time
	}

	drawGraph(){
		let graphsvg = d3.select(this.parentSelector)
			.selectAll("svg")
			.data([null])
			.enter()
			.append("svg");

		graphsvg = d3.select(this.parentSelector)
			.selectAll("svg")
			.attr("width", this.style.width)
			.attr("height", this.style.height)
			.style("background", this.style.background);

		graphsvg.selectAll("line")
			.data(this.edges)
			.enter()
			.append("line");

		graphsvg.selectAll("line")
			.attr("x1", (d, i) => {return d[0].position.x;})
			.attr("y1", (d, i) => {return d[0].position.y;})
			.attr("x2", (d, i) => {return d[1].position.x;})
			.attr("y2", (d, i) => {return d[1].position.y;})
			.attr("stroke", this.style.edgeColor)
			.attr("stroke-width", this.style.edgeWidth)

		graphsvg.selectAll("circle")
			.data(this.nodes)
			.enter()
			.append("circle");

		graphsvg.selectAll("circle")
			.attr("cx", (d, i) => {return d.position.x;})
			.attr("cy", (d, i) => {return d.position.y;})
			.attr("r", this.style.nodeRadius)
			.attr("fill", this.style.nodeColor)
			.call(d3.drag().on('drag', (e, d) => {
				d.position.x = e.x;
				d.position.y = e.y;
			}));
	}

	/*
	//basic method
	calcForces(){
		this.edges.forEach((edge, i) => { //forces from next edges overwriting forces frok previous ones, TODO: fix it
			let distance = Vector2D.distance(edge[0].position, edge[1].position);
			edge[1].force = edge[0].position.subtract(edge[1].position).normalize().scale(Math.log(distance/this.simulation.edgeLength) * this.simulation.edgeForceMultiplier);
			edge[0].force = edge[1].position.subtract(edge[0].position).normalize().scale(Math.log(distance/this.simulation.edgeLength) * this.simulation.edgeForceMultiplier);
		});

		this.nodes.forEach((nodeA, i) => {
			this.nodes.forEach((nodeB, j) => {
				let distance = Vector2D.distance(nodeA.position, nodeB.position);
				let force = this.simulation.internodesForceMultiplier/(distance*distance);
				nodeA.force = nodeA.force.add(nodeA.position.subtract(nodeB.position).normalize().scale(force));
				nodeB.force = nodeB.force.add(nodeB.position.subtract(nodeA.position).normalize().scale(force)); // forces are calculeted twice (when foreach is in nodeA and when in nodeB), TODO: fix it
			});
		});
	}*/

	calcForces(){
		let area = this.style.width * this.style.height;
		let k = Math.sqrt(area / this.nodes.length) * 3;
		let k2 = k*k;


		//repulsive forces between each pair nodes
		this.nodes.forEach((nodeA, i) => {
			nodeA.force = new Vector2D(0, 0);
			this.nodes.forEach((nodeB, j) => {
				if(nodeA == nodeB) return;
				let diff = nodeA.position.subtract(nodeB.position);
				let forceDir = diff.normalize();
				let forceVal = k2 / diff.magnitude();

				nodeA.force = nodeA.force.add(forceDir.scale(forceVal));
			});
		});

		//attractive forces between each pair of neighbours
		this.edges.forEach((edge, i) => {
			let diff = edge[0].position.subtract(edge[1].position);
			let forceDir = diff.normalize();
			let forceVal = Math.pow(diff.magnitude(), 2) / k;

			edge[0].force = edge[0].force.subtract(forceDir.scale(forceVal));
			edge[1].force = edge[1].force.add(forceDir.scale(forceVal));
		});

		//repulsive forces between each node and frame borders AND force clam to temperature
		this.nodes.forEach((node, i) => {
			let borderForce = new Vector2D(0, 0);
			borderForce.x += k2 / node.position.x;
			borderForce.x -= k2 / (this.style.width - node.position.x);
			borderForce.y += k2 / node.position.y;
			borderForce.y -= k2 / (this.style.height - node.position.y);
			node.force = node.force.add(borderForce);

			node.force = node.force.normalize().scale(Math.min(node.force.magnitude(), this.simulation.temperature(this.time.framesCount)));
		});

	}

	applyForces(){
		let margin = this.style.nodeRadius*0.5;
		let upperleft = new Vector2D(margin, margin);
		let bottomright = new Vector2D(this.style.width - margin, this.style.height - margin);

		this.nodes.forEach((node, i) => {
			if(node.force.magnitude() > this.simulation.forceThreshold){
				node.position = node.position.add(node.force.scale(this.simulation.forceMultiplier));
				node.position = node.position.clamp(upperleft, bottomright);
			}
		});

	}

	randomPosition(margin){
		let xmin = margin;
		let xmax = this.style.width - margin;
		let x = Math.random() * (xmax - xmin) + xmin;

		let ymin = margin;
		let ymax = this.style.height - margin;
		let y = Math.random() * (ymax - ymin) + ymin;

		return new Vector2D(x, y);
	}

}
