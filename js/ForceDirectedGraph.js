class ForceDirectedGraph{

	data = [];
	nodes = [];
	edges = [];

	parentSelector;

	paused = false;

	frame = {
		width : 900,
		height : 900,
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

	simulation;


	constructor({data, simulationMethod, simulationParameters, parentSelector, frame, style}){
		this.data = data;
		this.nodes = GraphTools.graphToNodes(this.data);
		this.edges = GraphTools.graphToEdges(this.data, this.nodes);
		this.randomizePositions();

		this.parentSelector = parentSelector;

		this.frame.width = frame?.width ?? this.frame.width;
		this.frame.height = frame?.height ?? this.frame.height;

		this.style.background = style?.background ?? "#FFF";
		this.style.nodeRadius = style?.nodeRadius ?? 10;
		this.style.nodeColor = style?.nodeColor ?? "#555";
		this.style.edgeWidth = style?.edgeWidth ?? 2;
		this.style.edgeColor = style?.edgeColor ?? "#CCC";

		this.frame.padding = this.style.nodeRadius*0.5 + 4;

		if(simulationMethod == "Eades"){
			this.simulation = new EadesMethod(this.nodes, this.edges, this.frame, simulationParameters);
		}
		else if(simulationMethod == "FruchtermanAndReingold"){
			this.simulation = new FruchtermanAndReingoldMethod(this.nodes, this.edges, this.frame, simulationParameters);
		}
		else if(simulationMethod == "KamadaAndKawai"){
			console.log("KamadaAndKawai method is not supported yet");
		}
		else if(simulationMethod == "FrickLudwigMehldau"){
			this.simulation = new FrickLudwigMehldauMethod(this.nodes, this.edges, this.frame, simulationParameters);
		}
		else{
			console.log("unknown simulation method: " + simulationMethod);
		}
	}

	start(){
		this.time.startTime = Date.now();
		this.time.lastFrameTime = this.time.startTime;

		this.options.frametime = 1000/this.options.framerate

		this.simulation.init();

		this.update();
	}

	pause(){
		this.paused = true;
	}

	continue(){
		if(this.paused){
			this.paused = false;
			this.update();
		}
	}

	update(){

		if(this.paused){
			return;
		}

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

	delete(){
		this.pause();
		d3.select(this.parentSelector).selectAll("svg").remove();
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
				if(this.paused) return;
				d.position.x = e.x;
				d.position.y = e.y;
			}));
	}

	changeSimulationMethod(method){
		if(method == "Eades"){
			this.simulation = new EadesMethod(this.nodes, this.edges, this.frame);
		}
		else if(method == "FruchtermanAndReingold"){
			this.simulation = new FruchtermanAndReingoldMethod(this.nodes, this.edges, this.frame);
		}
		else if(method == "FrickLudwigMehldau"){
			this.simulation = new FrickLudwigMehldauMethod(this.nodes, this.edges, this.frame);
		}
		this.simulation.init();
	}

	randomizePositions(){
		this.nodes.forEach((node, i) => {
			node.position = Vector2D.randomPosition(new Vector2D(0, 0), new Vector2D(this.frame.width, this.frame.height), this.style.nodeRadius * 0.5);
		});

	}

}
