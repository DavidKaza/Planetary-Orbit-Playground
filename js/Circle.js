function Circle(x, y, r, color, velx, vely) {
  this.pos = new Vector(x, y);
  this.r = r;
  this.mass = r < 10 ? r / 10 : r;
  if (this.r > 20) this.mass = this.r * 10;
  this.color = color;
  this.initialColor = color;
  this.vel = new Vector(velx, vely);
  this.prevPos = [{ pos: { x: this.pos.x, y: this.pos.y } }];
  this.movable = true;

  this.draw = function (posX, posY, r, color) {
    let grd = ctx.createRadialGradient(posX, posY, 0, posX, posY, r);
    grd.addColorStop(
      0,
      'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')'
    );
    grd.addColorStop(
      0.7,
      'rgba(' +
        color.r +
        ',' +
        color.g +
        ',' +
        color.b +
        ',' +
        (color.a - 0.3) +
        ')'
    );
    grd.addColorStop(
      0.8,
      'rgba(' + color.r + ',' + color.g + ',' + color.b + ',0.1)'
    );
    grd.addColorStop(
      1,
      'rgba(' + color.r + ',' + color.g + ',' + color.b + ',0)'
    );
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(posX, posY, r, 0, 2 * Math.PI);
    ctx.fill();
    if (!this.movable) {
      ctx.strokeStyle = 'red';
      ctx.stroke();
    }
  };

  this.gravitateTo = (obj) => {
    let grav = new Vector(0, 0);
    let dist = Vector.getDistance(this.pos, obj.pos);

    let G = obj.mass / (dist * dist);
    grav = Vector.setMagnitude(grav, G);
    grav = Vector.setAngle(grav, Vector.angleTo(this.pos, obj.pos));
    this.vel = Vector.add(this.vel, grav);
  };

  this.update = function () {
    circles.forEach((circle, i) => {
      if (circle !== this) {
        if (Vector.getDistance(this.pos, circle.pos) < this.r + circle.r - 10) {
          if (this.mass >= circle.mass) {
            circles.splice(i, 1);
          }
        }
        if (this.movable) {
          this.gravitateTo(circle);
        } else {
          this.vel = new Vector(0, 0);
        }
      }
    });

    if (!this.movable) {
      this.vel = new Vector(0, 0);
    }

    if (this.prevPos.length > tailLength) {
      this.prevPos.pop();
      this.prevPos.pop();
    }

    if (this.pos.x + this.r > canvas.width || this.pos.x - this.r < 0) {
      //   let offset =
      //     this.pos.x + this.r > canvas.width
      //       ? this.pos.x + this.r - canvas.width
      //       : this.pos.x - this.r;
      //   this.pos.x -= offset;
      if (this.pos.x + this.r > canvas.width) {
        this.pos.x = this.r * 2;
      } else {
        this.pos.x = canvas.width - this.r * 2;
      }
    }
    if (this.pos.y + this.r > canvas.height || this.pos.y - this.r < 0) {
      //   let offset =
      //     this.pos.y + this.r > canvas.height
      //       ? this.pos.y + this.r - canvas.height
      //       : this.pos.y - this.r;
      //   this.pos.y -= offset;
      if (this.pos.y + this.r > canvas.height) {
        this.pos.y = this.r * 2;
      } else {
        this.pos.y = canvas.height - this.r * 2;
      }
    }

    if (Math.abs(this.vel.x) > Math.abs(maxVel)) {
      this.vel.x = this.vel.x > 0 ? maxVel : -1 * maxVel;
    }
    if (Math.abs(this.vel.y) > Math.abs(maxVel)) {
      this.vel.y = this.vel.y > 0 ? maxVel : -1 * maxVel;
    }
    if (Math.abs(this.vel.x) < 0) {
      this.vel.x = 0;
    }
    if (Math.abs(this.vel.y) < 0) {
      this.vel.y = 0;
    }
    this.pos = Vector.add(this.pos, this.vel);

    this.prevPos.unshift({ pos: { x: this.pos.x, y: this.pos.y } });

    this.prevPos.forEach(
      function (prev, i, array) {
        let r = this.color.r - 10,
          g = this.color.g - 10,
          b = this.color.b - 10,
          a = this.color.a - 0.3;
        if (r > this.initialColor.r / 2) {
          r -= 2 * i;
        } else {
          r = this.initialColor.r / 2;
        }
        if (g > this.initialColor.g / 2) {
          g -= 2 * i;
        } else {
          g = this.initialColor.g / 2;
        }
        if (b > this.initialColor.b / 2) {
          b -= 2 * i;
        } else {
          b = this.initialColor.b / 2;
        }
        a *= array.length - i;
        let color = { r: r, g: g, b: b, a: a };
        let rad =
          this.r - 0.01 * i * this.r > 0 ? this.r - 0.01 * i * this.r : 0;
        this.draw(prev.pos.x, prev.pos.y, rad, color);
      }.bind(this)
    );
    this.draw(this.pos.x, this.pos.y, this.r, this.color);
  };
}
