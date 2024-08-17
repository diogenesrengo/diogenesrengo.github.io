/* classes from to https://github.com/The-Best-Codes/the-best-codes.github.io */

const canvas = document.getElementById("fireworksCanvas");
const c = canvas.getContext("2d");

class Particle {
  constructor(x, y, color, velocity) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = Math.random() * 2 + 1;
    this.velocity = velocity;
    this.life = 100;
    this.alpha = 1;
    this.shimmer = Math.random() < 0.3;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    let alpha = this.alpha;
    if (this.shimmer) { alpha *= 0.5 + Math.random() * 0.5; }
    c.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
    c.fill();
  }
  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.y += 0.05;
    this.life--;
    this.alpha -= 0.01;
  }
}

class Firework {
  constructor(x, y, color, speed, parts) {
    this.x = x;
    this.y = canvas.height;
    this.targetX = x;
    this.targetY = y;
    this.color = (color)? color : {
      r: Math.floor(Math.random() * 255),
      g: Math.floor(Math.random() * 255),
      b: Math.floor(Math.random() * 255),
    };
    const angle = (Math.random() * Math.PI) / 4 - Math.PI / 8;
    this.speed = (Math.random() * 3 + 5) * ((speed)? speed : 1);
    this.velocity = {
      x: Math.sin(angle) * this.speed,
      y: -Math.cos(angle) * this.speed,
    };
    this.particles = [];
    this.trail = [];
    this.exploded = false;
    this.explosionProgress = 0;
    this.hasShimmer = Math.random() < 0.5;
    this.parts = parts;
  }
  explode() {
    let n = (15 + Math.random() * 50) * ((this.parts)? this.parts : 1);
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      const velocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed, };
      this.particles.push( new Particle(this.x, this.y, this.color, velocity) );
    }
    this.exploded = true;
  }
  update() {
    if (!this.exploded) {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.velocity.y += 0.05;
      this.trail.push( new Particle(this.x, this.y, this.color, {x:0, y:0}) );
      if (this.trail.length > 20) this.trail.shift();
      if (this.velocity.y >= 0 || this.y <= this.targetY) this.explode();
    } else {
      this.explosionProgress += 0.02;
      this.particles.forEach( (particle) => {particle.update(); particle.draw();} );
      this.particles = this.particles.filter( (particle) => particle.life > 0 );
    }
    this.trail.forEach( (particle, index) => {
      particle.alpha = (index / this.trail.length) * (1 - this.explosionProgress);
      if (this.hasShimmer) { particle.shimmer = true; }
      particle.draw();
    });
  }
  draw() {
    if (!this.exploded) {
      c.beginPath();
      c.arc(this.x, this.y, 2, 0, Math.PI * 2);
      c.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
      c.fill();
    }
  }
}

let color2rgb = {
  yellow:     {r:255, g:253, b:  1},
  green:      {r:157, g:255, b:  0},
  cyan:       {r:  0, g:255, b:255},
  blue:       {r:  1, g:101, b:252},
  pink:       {r:254, g:  1, b:177},
  orange:     {r:255, g: 91, b:  0},
  random:     undefined,
};
let speed2num = {
  very_slow:  0.25,
  slow:       0.5,
  normal:     1,
  fast:       2,
  very_fast:  3,
};
let parts2num = {
  few:        0.5,
  normal:     1,
  much:       5,
  huge:       10,
  atomic:     50,
};

let from_setts = {
  color: "random",
  speed: "normal",
  parts: "normal",
  tperf: 1,
  f_max: 50,
  e_txt: false,
};
let from_tip = {
  tot: 0,
  txt: "",
}

let fireworks = [];

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  if (from_setts.e_txt) {
    c.font = "12px Tahoma";
    c.textAlign = "center";
    c.fillText(from_tip.txt, canvas.width / 2, canvas.height - 10); 
  }
  fireworks.forEach( (firework) => {firework.update(); firework.draw();} );
  if (from_tip.tot > 0 && Math.random() < 0.05) {
    fireworks.push(
      new Firework(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        color2rgb[ from_setts.color ],
        speed2num[ from_setts.speed ],
        parts2num[ from_setts.parts ]
      )
    );
    from_tip.tot--;
  }
  fireworks = fireworks.filter(
    (firework) => !firework.exploded || firework.particles.length > 0 
  );
  requestAnimationFrame(animate);
}

$overlay.on("tip", (e) => {
  from_tip.txt = e.tokens + " tokens from " + e.username;
  from_tip.tot = Math.round(e.tokens / from_setts.tperf);
  if (from_tip.tot > from_setts.f_max) from_tip.tot = from_setts.f_max;
  if (from_tip.tot > 0) animate();
}, 2000);

$overlay.on("start", (e) => {
  from_tip.tot = 1;
  requestAnimationFrame(animate);
  from_setts = {
    color: $settings.color,
    speed: $settings.speed,
    parts: $settings.parts,
    tperf: $settings.tperf,
    f_max: $settings.f_max,
    e_txt: $settings.e_txt,
  };
}, 1000);

$overlay.on("stop", (e) =>{
  from_setts.e_txt = false;
}, 1000);

