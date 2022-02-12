
class Vector2D{
  x = 0;
  y = 0;

  constructor(x, y){
    if(x) this.x = x;
    if(y) this.y = y;
  }

  static distance(a, b){
    return a.subtract(b).magnitude();
  }

  static randomPosition(upperleft, bottomright, padding){
    let xmin = upperleft.x + padding;
    let xmax = bottomright.x - padding;
    let x = Math.random() * (xmax - xmin) + xmin;

    let ymin = upperleft.y + padding;
    let ymax = bottomright.y - padding;
    let y = Math.random() * (ymax - ymin) + ymin;

    return new Vector2D(x, y);
}

  copy(){
    return new Vector2D(this.x, this.y);
  }

  add(other){
    return new Vector2D(this.x + other.x, this.y + other.y);
  }

  subtract(other){
    return new Vector2D(this.x - other.x, this.y - other.y);
  }

  scale(s){
    return new Vector2D(this.x * s, this.y * s);
  }

  dotProduct(other){
    return (this.x * other.x + this.y * other.y);
  }

  angle(other){
    return Math.acos(this.dotProduct(other)/(this.magnitude()*other.magnitude()));
  }

  magnitude(){
    return Math.sqrt(this.sqrMagnitude());
  }

  sqrMagnitude(){
    return this.x*this.x + this.y*this.y;
  }

  normalize(){
    return this.scale(1/this.magnitude())
  }

  clamp(upperleft, bottomright){
    let vec = new Vector2D(0, 0);
    vec.x = Math.min(Math.max(upperleft.x, this.x), bottomright.x);
    vec.y = Math.min(Math.max(upperleft.y, this.y), bottomright.y);

    return vec;
  }
}
