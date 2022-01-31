window.onload = start;

let forceGraph;

function start(){
	let data = GraphTools.randomGraph(5, 1);

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
		let data  = GraphTools.randomGraph(numberOfNodes, density);

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
		forceGraph.randomizePositions();
		forceGraph.simulation.iteration = 0;
	};


	//simulation method

	document.querySelector("#EadesMethodRadio").onchange = () => {
		forceGraph.changeSimulationMethod("Eades");
		loadEades(forceGraph);
	}

	document.querySelector("#FARMethodRadio").onchange = () => {
		forceGraph.changeSimulationMethod("FruchtermanAndReingold");
		loadFruchtermanAndReingold();
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

function loadFruchtermanAndReingold(){
	loadMethodControls("#FARControls");
	document.querySelector("#applyFARVariables").onclick = () => {
		forceGraph.simulation.edgeForceMultiplier = parseInt(document.querySelector("#edgeForceMultiplier").value);
		forceGraph.simulation.edgeLength = parseInt(document.querySelector("#edgeLength").value);
		forceGraph.simulation.internodesForceMultiplier = parseInt(document.querySelector("#internodesForceMultiplier").value);
	}
}
