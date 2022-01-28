
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

  magnitude(){
    return Math.sqrt(this.sqrMagnitude());
  }

  sqrMagnitude(){
    return this.x*this.x + this.y*this.y;
  }

  normalize(){
    return this.scale(1/this.magnitude())
  }
}
