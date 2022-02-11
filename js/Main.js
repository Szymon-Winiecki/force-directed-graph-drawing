window.onload = start;

let forceGraph;
let currentSimulationMethod = "Eades";

function start(){
	let data = GraphTools.randomGraph(5, 1);

	forceGraph = new ForceDirectedGraph({data:data, parentSelector:"#graph-container", simulationMethod:currentSimulationMethod});
	forceGraph.start();

	bindButtons();
	loadEades();
}

function bindButtons(){

	//graph uploading

	document.querySelector("#uploadGraph").onchange = (event) => {
		const fileList = event.target.files;

		let reader = new FileReader();
		reader.addEventListener('load', function(e) {
		    let text = e.target.result;
				let data = JSON.parse(text);

				forceGraph.delete();
				forceGraph = new ForceDirectedGraph({data:data, parentSelector:"#graph-container", simulationMethod:currentSimulationMethod});
				forceGraph.start();

				document.querySelector("#EadesMethodRadio").click();
		});

		reader.addEventListener('error', function() {
		    alert('Error : Failed to read file');
		});

		if(fileList[0]){
			reader.readAsText(fileList[0]);
		}
	}

	//graph generation

	document.querySelector("#generateGraph").onclick = () => {
		let numberOfNodes = parseInt(document.querySelector("#numberOfNodes").value);
		let density = parseFloat(document.querySelector("#graphDensity").value);
		let data  = GraphTools.randomGraph(numberOfNodes, density);

		forceGraph.delete();
		forceGraph = new ForceDirectedGraph({data:data, parentSelector:"#graph-container", simulationMethod:currentSimulationMethod});
		forceGraph.start();

		document.querySelector("#EadesMethodRadio").click();
	}

	document.querySelector("#generateTree").onclick = () => {
		let numberOfNodes = parseInt(document.querySelector("#numberOfNodes").value);
		let data  = GraphTools.randomTree(numberOfNodes);

		forceGraph.delete();
		forceGraph = new ForceDirectedGraph({data:data, parentSelector:"#graph-container", simulationMethod:currentSimulationMethod});
		forceGraph.start();

		document.querySelector("#EadesMethodRadio").click();
	}

	document.querySelector('#downlaodGraphJson').onclick = () => {

		let content = JSON.stringify(forceGraph.data);

	  const a = document.createElement('a');
	  const file = new Blob([content], {type: "application/json"});

	  a.href= URL.createObjectURL(file);
	  a.download = 'graph.json';
	  a.click();

		URL.revokeObjectURL(a.href);
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
		forceGraph.simulation.init();
		forceGraph.simulation.iteration = 0;
	};


	//simulation method

	document.querySelector("#EadesMethodRadio").onchange = () => {
		changeSimulationMethod("Eades");
	}

	document.querySelector("#FARMethodRadio").onchange = () => {
		changeSimulationMethod("FruchtermanAndReingold");
	}

	document.querySelector("#FLMMethodRadio").onchange = () => {
		changeSimulationMethod("FrickLudwigMehldau");
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

function changeSimulationMethod(method){
	currentSimulationMethod = method;
	forceGraph.changeSimulationMethod(method);

	if(method == "Eades"){
		loadEades();
	}
	else if(method == "FruchtermanAndReingold") {
		loadFruchtermanAndReingold();
	}
	else if(method == "FrickLudwigMehldau") {
		loadFrickLudwigMehldau();
	}
	else{
		console.log("unknown simulation method: " + method);
		changeSimulationMethod("Eades");
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
		document.querySelector("#edgeLength").value = forceGraph.simulation.edgeLength;
	}

	function updateSimulationVariables(){
		forceGraph.simulation.maxIterationsCount = parseInt(document.querySelector("#iterations").value);
		forceGraph.simulation.temperatureMultiplier = parseFloat(document.querySelector("#temperatureMultiplier").value);
		forceGraph.simulation.edgeLength = parseFloat(document.querySelector("#edgeLength").value);
	}

	updateInputFields();
	document.querySelector("#applyFARVariables").onclick = () => {
		updateSimulationVariables();
		updateInputFields();
		forceGraph.simulation.iteration = 0;
	}
}

function loadFrickLudwigMehldau(){
	loadMethodControls("#FLMControls");

	function updateInputFields(){
		document.querySelector("#temperatureMax").value = forceGraph.simulation.temperatureMax;
		document.querySelector("#temperatureMin").value = forceGraph.simulation.temperatureMin;
		document.querySelector("#temperatureInit").value = forceGraph.simulation.temperatureInit;
		document.querySelector("#gravitationalConstant").value = forceGraph.simulation.gravitationalConstant;
		document.querySelector("#randomDisturbanceRange").value = forceGraph.simulation.randomDisturbanceRange;
		document.querySelector("#desiredEdgeLength").value = forceGraph.simulation.desiredEdgeLength;
		document.querySelector("#minOscillataionDetection").value = forceGraph.simulation.minOscillataionDetection;
		document.querySelector("#minRotationDetection").value = forceGraph.simulation.minRotationDetection;
		document.querySelector("#sensitivityTowardsOscillation").value = forceGraph.simulation.sensitivityTowardsOscillation;
		document.querySelector("#sensitivityTowardsRotation").value = forceGraph.simulation.sensitivityTowardsRotation;
	}

	function updateSimulationVariables(){
		let parameters = {
			temperatureMax : parseFloat(document.querySelector("#temperatureMax").value),
			temperatureMin : parseFloat(document.querySelector("#temperatureMin").value),
			temperatureInit : parseFloat(document.querySelector("#temperatureInit").value),
			gravitationalConstant : parseFloat(document.querySelector("#gravitationalConstant").value),
			randomDisturbanceRange : parseFloat(document.querySelector("#randomDisturbanceRange").value),
			desiredEdgeLength : parseFloat(document.querySelector("#desiredEdgeLength").value),
			minOscillataionDetection : parseFloat(document.querySelector("#minOscillataionDetection").value),
			minRotationDetection : parseFloat(document.querySelector("#minRotationDetection").value),
			sensitivityTowardsOscillation : parseFloat(document.querySelector("#sensitivityTowardsOscillation").value),
			sensitivityTowardsRotation :  parseFloat(document.querySelector("#sensitivityTowardsRotation").value)
		}

		forceGraph.simulation.updateParameters(parameters);
	}

	updateInputFields();
	document.querySelector("#applyFLMVariables").onclick = () => {
		updateSimulationVariables();
		updateInputFields();
		forceGraph.simulation.iteration = 0;
	}
}
