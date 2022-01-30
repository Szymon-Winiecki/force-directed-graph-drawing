class ForceDirectedGraph{

	data = [];
	nodes = [];
	edges = [];

	parentSelector;

	frame = {
		width : 600,
		height : 600,
		margin : 0
	};

	style = {
		background : "#FFF",
		nodeRadius : 10,
		nodeColor : "#555",
		edgeWidth : 2,
		edgeColor : "#CCC",
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

	simulationMethod;


	constructor(data, parentSelector, style){
		this.data = data;
		this.nodes = this.buildNodesArray();
		this.edges = this.buildEdgesArray();

		this.parentSelector = parentSelector;

		if(style.width) this.frame.width = width;
		if(style.height) this.frame.height = height;
		if(style.background) this.style.background = background;
		if(style.nodeRadius) this.style.nodeRadius = nodeRadius;
		if(style.nodeColor) this.style.nodeColor = nodeColor;
		if(style.edgeWidth) this.style.edgeWidth = edgeWidth;
		if(style.edgeColor) this.style.edgeColor = edgeColor;

		this.frame.padding = this.style.nodeRadius*0.5 + 4;

		this.simulation = new FruchtermanAndReingoldMethod(this.nodes, this.edges, this.frame);
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

		this.update();
	}

	update(){

		this.simulation.calculateForces();
		this.simulation.applyForces();

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
			.attr("width", this.frame.width)
			.attr("height", this.frame.height)
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

	randomPosition(margin){
		let xmin = margin;
		let xmax = this.frame.width - margin;
		let x = Math.random() * (xmax - xmin) + xmin;

		let ymin = margin;
		let ymax = this.frame.height - margin;
		let y = Math.random() * (ymax - ymin) + ymin;

		return new Vector2D(x, y);
	}

}
