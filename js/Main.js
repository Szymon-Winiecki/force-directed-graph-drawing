window.onload = start;

let forceGraph;

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
	let data = GraphGenerator.randomGraph(5, 1);

	forceGraph = new ForceDirectedGraph({data:data, parentSelector:"#graph-container", simulationMethod:"Eades"});
	forceGraph.start();

	bindButtons();
	loadEades();
}

function bindButtons(){

	//graph generation

	document.querySelector("#generateGraph").onclick = () => {
		let numberOfNodes = parseInt(document.querySelector("#numberOfNodes").value);
		let density = parseFloat(document.querySelector("#graphDensity").value);
		let data  = GraphGenerator.randomGraph(numberOfNodes, density);

		forceGraph.delete();
		forceGraph = new ForceDirectedGraph({data:data, parentSelector:"#graph-container", simulationMethod:"Eades"});
		forceGraph.start();

	}

	//controls

	document.querySelector("#resumeButton").onclick = () => {
		forceGraph.continue();
	};

	document.querySelector("#pauseButton").onclick = () => {
		forceGraph.pause();
	};

	document.querySelector("#resetButton").onclick = () => {
		forceGraph.continue();
	};


	//simulation method

	document.querySelector("#EadesMethodRadio").onchange = () => {
		forceGraph.changeSimulationMethod("Eades");
		loadEades(forceGraph);
	}

	document.querySelector("#FARMethodRadio").onchange = () => {
		forceGraph.changeSimulationMethod("FruchtermanAndReingold");
	}

	document.querySelector("#KAKMethodRadio").onchange = () => {
		forceGraph.changeSimulationMethod("KamadaAndKawai");
	}
}

function loadMethodControls(controlsTemplateSelector){
	let formTemplate = document.querySelector(controlsTemplateSelector);
	let formHolder = document.querySelector("#method-controls");

	let form = document.importNode(formTemplate.content, true);
	formHolder.innerHTML = "";
	formHolder.appendChild(form);
}

function loadEades(){
	loadMethodControls("#EadesControls");
	document.querySelector("#applyEadesVariables").onclick = () => {
		forceGraph.simulation.edgeForceMultiplier = parseInt(document.querySelector("#edgeForceMultiplier").value);
		forceGraph.simulation.edgeLength = parseInt(document.querySelector("#edgeLength").value);
		forceGraph.simulation.internodesForceMultiplier = parseInt(document.querySelector("#internodesForceMultiplier").value);
	}
}
