
class EadesMethod extends SimulationMethod{

  edgeForceMultiplier = 2;
  edgeLength = 70;
  internodesForceMultiplier = 70;
  forceMultiplier = 1;
  forceThreshold = 0.5;

  constructor(nodes, edges, frame) {
    super(nodes, edges, frame);
  }

	calculateForces(){

    this.nodes.forEach((nodeA, i) => {
      nodeA.force = new Vector2D(0, 0);
      this.nodes.forEach((nodeB, j) => {
        let distance = Vector2D.distance(nodeA.position, nodeB.position);
        let force = this.internodesForceMultiplier/(distance*distance);
        nodeA.force = nodeA.force.add(nodeA.position.subtract(nodeB.position).normalize().scale(force));
      });
    });

		this.edges.forEach((edge, i) => {
			let distance = Vector2D.distance(edge[0].position, edge[1].position);
			edge[1].force = edge[1].force.add(edge[0].position.subtract(edge[1].position).normalize().scale(Math.log(distance/this.edgeLength) * this.edgeForceMultiplier));
			edge[0].force = edge[0].force.add(edge[1].position.subtract(edge[0].position).normalize().scale(Math.log(distance/this.edgeLength) * this.edgeForceMultiplier));
		});
	}
}
