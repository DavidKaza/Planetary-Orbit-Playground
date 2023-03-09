let canvas = document.getElementById('can');
let ctx = canvas.getContext('2d');
ctx.scale(0.5, 0.5);

let updateCanvasSize = function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

updateCanvasSize();

window.addEventListener('resize', updateCanvasSize);

let shouldDrawLine = true;

let mouse = {
  mass: 300,
  pos: new Vector(0, 0),
  start: null,
  mouseDown: false,
  drawLine: function () {
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.pos.x, this.pos.y);
    ctx.stroke();
  },
};

let circles = [];

function createCircles(num) {
  for (let i = 0; i < num; i++) {
    let r = Math.random() * size + 10;
    let pos = {
      x: Math.random() * (canvas.width - 2 * r) + r,
      y: Math.random() * (canvas.height - 2 * r) + r,
    };
    let vel = {
      x:
        Math.random() < 0.5
          ? Math.random() * maxVel
          : Math.random() * maxVel * -1,
      y:
        Math.random() < 0.5
          ? Math.random() * maxVel
          : Math.random() * maxVel * -1,
    };
    circles.push(new Circle(pos.x, pos.y, r, color, vel.x, vel.y));
  }
}
let lastTime = 0;
let step = 12;
let simulation = 'off';

let animate = function (dt) {
  simulation = requestAnimationFrame(animate);
  let accumulator = dt - lastTime;
  if (accumulator > step) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (mouse.mouseDown && shouldDrawLine) {
      mouse.drawLine();
    }
    circles.forEach(function (circle) {
      circle.update();
    });
    if (circles.length > totalCircles) {
      circles.splice(1, 1);
    }
    accumulator = 0;
    lastTime = dt;
  }
};

playPauseBtn.addEventListener('click', function () {
  if (simulation === 'off') {
    animate();
  } else {
    cancelAnimationFrame(simulation);
    simulation = 'off';
  }
});

function mouseIsTouching(circle) {
  return (
    Math.abs(circle.pos.x - mouse.pos.x) < circle.r &&
    Math.abs(circle.pos.y - mouse.pos.y) < circle.r
  );
}

canvas.addEventListener('mousemove', function (e) {
  (mouse.pos.x = e.offsetX), (mouse.pos.y = e.offsetY);

  if (circles.some(mouseIsTouching)) {
    canvas.style.cursor = 'pointer';
  } else {
    canvas.style.cursor = 'default';
  }
});

canvas.addEventListener('mousedown', (e) => {
  mouse.mouseDown = true;
  mouse.start = new Vector(e.offsetX, e.offsetY);
  let end;

  if (circles.some(mouseIsTouching)) {
    circles.forEach((circle) => {
      if (mouseIsTouching(circle)) {
        if (!circle.movable) {
          shouldDrawLine = true;
          canvas.onmouseup = (e) => {
            mouse.mouseDown = false;
            end = new Vector(e.offsetX, e.offsetY);
            let velMagnitude = Vector.getDistance(mouse.start, end);
            velMagnitude *= 0.02;
            let angle = Vector.angleTo(mouse.start, end);
            let vel = new Vector(0, 0);
            vel = Vector.setMagnitude(vel, velMagnitude);
            vel = Vector.setAngle(vel, angle);
            circle.movable = true;
            circle.vel = vel;
          };
        } else {
          shouldDrawLine = false;
          canvas.onmouseup = (e) => {
            shouldDrawLine = true;
            mouse.mouseDown = false;
            circle.movable = !circle.movable;
          };
        }
      }
    });
    return;
  }
  canvas.onmouseup = (e) => {
    mouse.mouseDown = false;
    end = new Vector(e.offsetX, e.offsetY);
    let velMagnitude = Vector.getDistance(mouse.start, end);
    velMagnitude *= 0.02;
    let angle = Vector.angleTo(mouse.start, end);
    let vel = new Vector(0, 0);
    vel = Vector.setMagnitude(vel, velMagnitude);
    vel = Vector.setAngle(vel, angle);
    circles.push(new Circle(end.x, end.y, size, color, vel.x, vel.y));
  };
});

let sun = new Circle(
  canvas.width / 2,
  canvas.height / 2,
  25,
  { r: 255, g: 255, b: 100, a: 1 },
  0,
  0
);
sun.mass = 1000;
// sun.movable = false;

circles.unshift(sun);

function touchHandler(e) {
  (mouse.pos.x =
    e.targetTouches[0].clientX - e.targetTouches[0].target.offsetLeft),
    (mouse.pos.y =
      e.targetTouches[0].clientY - e.targetTouches[0].target.offsetTop);
  e.preventDefault();
}

canvas.addEventListener('touchmove', touchHandler);

canvas.addEventListener('touchstart', function (e) {
  touchHandler(e);
  mouse.mouseDown = true;
  mouse.start = new Vector(mouse.pos.x, mouse.pos.y);
  let end;

  if (circles.some(mouseIsTouching)) {
    circles.forEach((circle) => {
      if (mouseIsTouching(circle)) {
        if (!circle.movable) {
          shouldDrawLine = true;
          canvas.ontouchend = () => {
            mouse.mouseDown = false;
            end = new Vector(mouse.pos.x, mouse.pos.y);
            let velMagnitude = Vector.getDistance(mouse.start, end);
            velMagnitude *= 0.02;
            let angle = Vector.angleTo(mouse.start, end);
            let vel = new Vector(0, 0);
            vel = Vector.setMagnitude(vel, velMagnitude);
            vel = Vector.setAngle(vel, angle);
            circle.movable = true;
            circle.vel = vel;
          };
        } else {
          shouldDrawLine = false;
          canvas.ontouchend = (e) => {
            mouse.mouseDown = false;
            shouldDrawLine = true;
            circle.movable = !circle.movable;
          };
        }
      }
    });
    return;
  }

  canvas.ontouchend = (e) => {
    mouse.mouseDown = false;
    end = new Vector(mouse.pos.x, mouse.pos.y);
    let velMagnitude = Vector.getDistance(mouse.start, end);
    velMagnitude *= 0.02;
    let angle = Vector.angleTo(mouse.start, end);
    let vel = new Vector(0, 0);
    vel = Vector.setMagnitude(vel, velMagnitude);
    vel = Vector.setAngle(vel, angle);
    circles.push(new Circle(end.x, end.y, size, color, vel.x, vel.y));
  };
});

animate();
