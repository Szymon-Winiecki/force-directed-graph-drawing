
class FruchtermanAndReingoldMethod extends SimulationMethod {

  maxIterationsCount = 150;
  temperatureMultiplier = 0.01;
  
  temperature = (iteration) => {
    let max = Math.min(this.frame.width, this.frame.height) * this.temperatureMultiplier;
    iteration = Math.min(iteration, this.maxIterationsCount);
    let progress = iteration/this.maxIterationsCount;
    return (1 - progress) * max;
  };


  constructor(nodes, edges, frame, parameters) {
    super(nodes, edges, frame, parameters);
  }

  updateParameters({forceMultiplier, forceThreshold, maxIterationsCount, temperatureMultiplier}){
    super.updateParameters({forceMultiplier: forceMultiplier, forceThreshold: forceThreshold});
    this.maxIterationsCount = maxIterationsCount ?? this.maxIterationsCount;
    this.temperatureMultiplier = temperatureMultiplier ?? this.temperatureMultiplier;
  }

  calculateForces(){
		let area = this.frame.width * this.frame.height;
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
			borderForce.x -= k2 / (this.frame.width - node.position.x);
			borderForce.y += k2 / node.position.y;
			borderForce.y -= k2 / (this.frame.height - node.position.y);
			node.force = node.force.add(borderForce);

			node.force = node.force.normalize().scale(Math.min(node.force.magnitude(), this.temperature(this.iteration)));
      if(node.force.magnitude() < this.forceThreshold){
        node.force = new Vector2D(0,0);
      }
		});

	}
}
