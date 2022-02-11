
class EadesMethod extends SimulationMethod{

  edgeForceMultiplier = 2;
  edgeLength = 120;
  internodesForceMultiplier = 1000;

  constructor(nodes, edges, frame, parameters) {
    super(nodes, edges, frame, parameters);

    this.edgeForceMultiplier = parameters?.edgeForceMultiplier ?? this.edgeForceMultiplier;
    this.edgeLength = parameters?.edgeLength ?? this.edgeLength;
    this.internodesForceMultiplier = parameters?.internodesForceMultiplier ?? this.internodesForceMultiplier;
  }

  updateParameters(parameters){
    super.updateParameters({forceMultiplier: parameters?.forceMultiplier, forceThreshold: parameters?.forceThreshold});
    this.edgeForceMultiplier = parameters?.edgeForceMultiplier ?? this.edgeForceMultiplier;
    this.edgeLength = parameters?.edgeLength ?? this.edgeLength;
    this.internodesForceMultiplier = parameters?.internodesForceMultiplier ?? this.internodesForceMultiplier;
  }

	calculateForces(){

    this.nodes.forEach((nodeA, i) => {
      nodeA.force = new Vector2D(0, 0);
      this.nodes.forEach((nodeB, j) => {
        let direction = nodeA.position.subtract(nodeB.position);
        let distance = direction.magnitude();
        let force = this.internodesForceMultiplier/(distance*distance);
        nodeA.force = nodeA.force.add(direction.normalize().scale(force));
      });
    });

		this.edges.forEach((edge, i) => {
      let direction = edge[0].position.subtract(edge[1].position);
			let distance = direction.magnitude();
      let normalizedDirection = direction.normalize();
      let force = Math.log(distance/this.edgeLength) * this.edgeForceMultiplier;
			edge[1].force = edge[1].force.add(normalizedDirection.scale(force));
			edge[0].force = edge[0].force.add(normalizedDirection.scale(force * -1));
		});
	}
}
