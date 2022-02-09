
class FrickLudwigMehldauMethod extends SimulationMethod {

  temperatureMax = 10;
  temperatureMin = 3;
  temperatureInit = 6;

  gravitationalConstant = 0; //0.0625

  randomDisturbanceRange = 0;

  desiredEdgeLength = 60;

  minOscillataionDetection = 1.3;
  minRotationDetection = 1.3;
  sensitivityTowardsOscillation = 1;
  sensitivityTowardsRotation = 0.5;

  temperatureGlobal;

  constructor(nodes, edges, frame, parameters) {
    super(nodes, edges, frame, parameters);

    this.updateParameters(parameters);
  }

  updateParameters(parameters){
    super.updateParameters({forceMultiplier: parameters?.forceMultiplier, forceThreshold: parameters?.forceThreshold});
    this.temperatureMax = parameters?.temperatureMax ?? this.temperatureMax;
    this.temperatureMin = parameters?.temperatureMin ?? this.temperatureMin;
    this.temperatureInit = parameters?.temperatureInit ?? this.temperatureInit;
    this.gravitationalConstant = parameters?.gravitationalConstant ?? this.gravitationalConstant;
    this.randomDisturbanceRange = parameters?.randomDisturbanceRange ?? this.randomDisturbanceRange;
    this.desiredEdgeLength = parameters?.desiredEdgeLength ?? this.desiredEdgeLength;
    this.minOscillataionDetection = parameters?.minOscillataionDetection ?? this.minOscillataionDetection;
    this.minRotationDetection = parameters?.minRotationDetection ?? this.minRotationDetection;
    this.sensitivityTowardsOscillation = parameters?.sensitivityTowardsOscillation ?? this.sensitivityTowardsOscillation;
    this.sensitivityTowardsRotation = parameters?.sensitivityTowardsRotation ?? this.sensitivityTowardsRotation;
  }

  init(){
    this.temperatureGlobal = this.temperatureMax;

    this.nodes.forEach((node, i) => {
      node.cpos = node.position.copy();
      node.lastImpulse = new Vector2D(0,0);
      node.temperature = this.temperatureInit;
      node.skewGauge = 0;
    });

  }

  calculateForces(){
    console.log(this.temperatureGlobal);
    if(this.temperatureGlobal < this.temperatureMin){
      //return;
    }

    this.temperatureGlobal = 0;
    let permutation = this.randomPermutation(this.nodes);
    permutation.forEach((choosen, i) => {
      let impulse = this.computeImpulse(choosen);
      this.updateTemperature(choosen, impulse);
    });

  }

  randomPermutation(nodes){
    let permutation = new Array();
    nodes.forEach((node, i) => {
      permutation.push(node);
    });

    for(let i = 0; i < permutation.length; i++){
      let rm = parseInt(Math.random() * (permutation.length - 1 - i) + i);

      let tmp = permutation[i];
      permutation[i] = permutation[rm];
      permutation[rm] = tmp;
    }

    return permutation;
  }

  computeImpulse(node){
    //degree function
    let phi = 1 + node.neighbours.length/2;  //TODO: move to init

    //center of gravity //TODO: change to calc barycenter of the subgraph, not whole graph
    let center = new Vector2D(0, 0);
    this.nodes.forEach((item, i) => {
      center = center.add(item.cpos);
    });
    center = center.scale(1/this.nodes.length);

    let impulse = new Vector2D(0,0);
    //attraction to center of gravity
    impulse = impulse.add(center.subtract(node.cpos).scale(this.gravitationalConstant * phi));

    //random disturbance
    let randomDisturbance = Vector2D.randomPosition(new Vector2D(-this.randomDisturbanceRange, -this.randomDisturbanceRange), new Vector2D(this.randomDisturbanceRange, this.randomDisturbanceRange), 0);
    impulse = impulse.add(randomDisturbance);

    //internodes repulsive forces
    this.nodes.forEach((other, i) => {
      if (node == other) return;
      let distance = node.cpos.subtract(other.cpos);
      let repulsiveForce = new Vector2D(0, 0);
      if(distance.magnitude() != 0) repulsiveForce = distance.normalize().scale(Math.pow(this.desiredEdgeLength, 2) / Math.pow(distance.magnitude(), 2));

      if(repulsiveForce.magnitude() == Infinity){
        console.log("repulsive");
        repulsiveForce = new Vector2D(0, 0);
      }

      impulse = impulse.add(repulsiveForce);
    });

    //edges attractive forces
    node.neighbours.forEach((neighbour, i) => {
      let distance = node.cpos.subtract(neighbour.cpos);
      let attractiveForce = distance.normalize().scale((-1 * Math.pow(distance.magnitude(), 2)) / (Math.pow(this.desiredEdgeLength, 2) * phi));

      if(attractiveForce.magnitude() == Infinity) {
        console.log("attractive");
        attractiveForce = new Vector2D(0, 0);
      }

      impulse = impulse.add(attractiveForce);
    });

    //repulsive forces with frame borders

    /*let borderForce = new Vector2D(0, 0);
    borderForce.x += Math.pow(this.desiredEdgeLength, 2) / Math.pow(node.position.x, 2);
    borderForce.x -= Math.pow(this.desiredEdgeLength, 2) / Math.pow((this.frame.width - node.position.x), 2);
    borderForce.y += Math.pow(this.desiredEdgeLength, 2) / Math.pow(node.position.y, 2);
    borderForce.y -= Math.pow(this.desiredEdgeLength, 2) / Math.pow((this.frame.height - node.position.y), 2);

    if(borderForce.magnitude() == Infinity){
      console.log("border");
      borderForce = new Vector2D(0, 0);
    }

    impulse = impulse.add(borderForce.scale(10));*/

    return impulse;

  }

  updateTemperature(node, impulse){

    if(impulse.magnitude() != 0){
      impulse = impulse.scale(node.temperature);
      node.cpos = node.cpos.add(impulse);
    }

    if(impulse.magnitude() != 0 && node.lastImpulse.magnitude() != 0){
      let sinb = Math.sin(impulse.angle(node.lastImpulse));
      if(sinb > Math.sin(Math.PI/2 + this.minRotationDetection/2)){
        node.skewGauge += this.sensitivityTowardsRotation * Math.sign(sinb);
      }

      let cosb = Math.cos(impulse.angle(node.lastImpulse));
      if(Math.abs(cosb) > Math.cos(this.minOscillataionDetection/2)){
        node.temperature *= this.sensitivityTowardsOscillation * cosb;
      }
    }

    node.temperature *= 1 - Math.abs(node.skewGauge);
    node.temperature = Math.min(node.temperature, this.temperatureMax);

    node.lastImpulse = impulse;
    this.temperatureGlobal += node.temperature;
  }

  applyForces(){
    let padding = this.frame.padding;
    let upperleft = new Vector2D(padding, padding);
    let bottomright = new Vector2D(this.frame.width - padding, this.frame.height - padding);

    this.nodes.forEach((node, i) => {
      node.cpos = node.cpos.clamp(upperleft, bottomright, padding);
      node.position = node.cpos;
    });

    this.iteration++;
  }

}
