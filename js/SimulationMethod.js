
class SimulationMethod{
  nodes;
  edges;

  iteration = 0;

  frame = {
    width : 0,
    height : 0,
    padding : 0
  }


  constructor(nodes, edges, frame){
    this.nodes = nodes;
    this.edges = edges;

    this.frame = frame;
  }

  calculateForces(){}

  applyForces(){
    let padding = this.frame.padding;
    let upperleft = new Vector2D(padding, padding);
    let bottomright = new Vector2D(this.frame.width - padding, this.frame.height - padding);

    this.nodes.forEach((node, i) => {
      node.position = node.position.add(node.force.scale(this.forceMultiplier));
      node.position = node.position.clamp(upperleft, bottomright);
    });

    this.iteration++;
  }
}
