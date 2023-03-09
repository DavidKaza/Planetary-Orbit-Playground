let numOfCirclesSlider = document.getElementById('numOfCircles');
let tailLengthSlider = document.getElementById('tailLength');
let sizeSlider = document.getElementById('size');
let maxVelSlider = document.getElementById('maxVel');
let colorsSlider = document.getElementById('colors');
let gravityBtn = document.getElementById('gravity');
let fsBtn = document.getElementById('fs');
let playPauseBtn = document.getElementById('playPause');

function openFullscreen() {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else if (canvas.mozRequestFullScreen) {
    /* Firefox */
    canvas.mozRequestFullScreen();
  } else if (canvas.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    canvas.webkitRequestFullscreen();
  } else if (canvas.msRequestFullscreen) {
    /* IE/Edge */
    canvas.msRequestFullscreen();
  }
}

fsBtn.addEventListener('click', function () {
  openFullscreen();
});

let maxVel = maxVelSlider;
let totalCircles = numOfCirclesSlider.value;
let tailLength = tailLengthSlider.value;
let size = parseInt(sizeSlider.value);
let redness = 33,
  greenness = 33,
  blueness = 33;

numOfCirclesSlider.oninput = function () {
  totalCircles = parseInt(this.value);
};
tailLengthSlider.oninput = function () {
  tailLength = parseInt(this.value);
};
sizeSlider.oninput = function () {
  size = parseInt(this.value);
};
maxVelSlider.oninput = function () {
  maxVel = parseInt(this.value);
};

function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

let h = parseInt(colorsSlider.value) / 360;
let s = 1;
let l = 0.5;
let color = hslToRgb(h, s, l);
color.a = 1;
colorsSlider.oninput = function () {
  h = parseInt(colorsSlider.value) / 360;
  color = hslToRgb(h, s, l);
  color.a = 1;
};
