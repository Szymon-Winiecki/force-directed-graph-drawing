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
		loadEades();
	}

	document.querySelector("#FARMethodRadio").onchange = () => {
		forceGraph.changeSimulationMethod("FruchtermanAndReingold");
		loadFruchtermanAndReingold();
	}

	document.querySelector("#KAKMethodRadio").onchange = () => {
		forceGraph.changeSimulationMethod("KamadaAndKawai");
	}

	//simulation options

	function updateSimulationOptions(){
		forceGraph.simulation.forceMultiplier = parseFloat(document.querySelector("#forceMultiplier").value);
		forceGraph.simulation.forceThreshold = parseFloat(document.querySelector("#forceThreshold").value);
	}

	function updateInputFields(){
		document.querySelector("#forceMultiplier").value = forceGraph.simulation.forceMultiplier;
		document.querySelector("#forceThreshold").value = forceGraph.simulation.forceThreshold;
	}

	updateInputFields();
	document.querySelector('#applySimulationSettings').onclick  = () => {
		updateSimulationOptions();
		updateInputFields();
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

	function updateInputFields(){
		document.querySelector("#edgeForceMultiplier").value = forceGraph.simulation.edgeForceMultiplier;
		document.querySelector("#edgeLength").value = forceGraph.simulation.edgeLength;
		document.querySelector("#internodesForceMultiplier").value = forceGraph.simulation.internodesForceMultiplier;
	}

	function updateSimulationVariables(){
		forceGraph.simulation.edgeForceMultiplier = parseFloat(document.querySelector("#edgeForceMultiplier").value);
		forceGraph.simulation.edgeLength = parseFloat(document.querySelector("#edgeLength").value);
		forceGraph.simulation.internodesForceMultiplier = parseFloat(document.querySelector("#internodesForceMultiplier").value);
	}

	updateInputFields();

	document.querySelector("#applyEadesVariables").onclick = () => {
		updateSimulationVariables();
		updateInputFields();
	}
}

function loadFruchtermanAndReingold(){
	loadMethodControls("#FARControls");

	function updateInputFields(){
		document.querySelector("#iterations").value = forceGraph.simulation.maxIterationsCount;
		document.querySelector("#temperatureMultiplier").value = forceGraph.simulation.temperatureMultiplier;
	}

	function updateSimulationVariables(){
		forceGraph.simulation.maxIterationsCount = parseInt(document.querySelector("#iterations").value);
		forceGraph.simulation.temperatureMultiplier = parseFloat(document.querySelector("#temperatureMultiplier").value);
	}

	updateInputFields();
	document.querySelector("#applyFARVariables").onclick = () => {
		updateSimulationVariables();
		updateInputFields();
		forceGraph.simulation.iteration = 0;
	}
}
