class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  static add(v1, v2) {
    let res = new Vector(0, 0);
    res.x = v1.x + v2.x;
    res.y = v1.y + v2.y;
    return res;
  }
  static subtract(v1, v2) {
    let res = new Vector(0, 0);
    res.x = v1.x - v2.x;
    res.y = v1.y - v2.y;
    return res;
  }
  static multiply(v1, v2) {
    let res = new Vector(0, 0);
    res.x = v1.x * v2.x;
    res.y = v1.y * v2.y;
    return res;
  }
  static divide(v1, v2) {
    let res = new Vector(0, 0);
    res.x = v1.x / Math.abs(v2.x);
    res.y = v1.y / Math.abs(v2.y);
    return res;
  }
  static normalize(v) {
    //get unit vector (keep dir, change length to 1)
    let res = new Vector(0, 0);
    let mag = Vector.magnitude(v);
    res.x = v.x / mag;
    res.y = v.y / mag;
    return res;
  }
  static magnitude(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y); //a^2 + b^2 = c^2 (hypotenuse length)
  }
  static setMagnitude(v, length) {
    let angle = Vector.getAngle(v);
    let x = Math.cos(angle) * length;
    let y = Math.sin(angle) * length;
    return new Vector(x, y);
  }
  static getAngle(v) {
    return Math.atan2(v.y, v.x);
  }
  static setAngle(v, angle) {
    let length = Vector.magnitude(v);
    let x = Math.cos(angle) * length;
    let y = Math.sin(angle) * length;
    return new Vector(x, y);
  }
  static angleTo(v1, v2) {
    return Math.atan2(v2.y - v1.y, v2.x - v1.x);
  }
  static getDistance(v1, v2) {
    let dx = v1.x - v2.x;
    let dy = v1.y - v2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
