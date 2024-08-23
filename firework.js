/* classes Particle and Firework with some modifications from
  https://github.com/The-Best-Codes/the-best-codes.github.io */

const canvas = document.getElementById("fireworksCanvas");
const c = canvas.getContext("2d");

class Particle {
  constructor(x, y, color, velocity, radius) {
    this.x = x;
    this.y = y;
    this.color = (color)? color : {
      r: Math.floor(Math.random() * 255),
      g: Math.floor(Math.random() * 255),
      b: Math.floor(Math.random() * 255)
    };
    this.radius = Math.random() * 2 + ((radius)? radius : 0.75);
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
  constructor(x, y, color, speed, parts, radius, multi) {
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
    this.partsMulticolor = multi;
    this.radius = radius;
  }
  explode() {
    let n = (15 + Math.random() * 50) * ((this.parts)? this.parts : 1);
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      const velocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed, };
      this.particles.push(
        new Particle(
          this.x,
          this.y,
          (this.partsMulticolor)? 0 : this.color,
          velocity,
          this.radius
          )
      );
    }
    this.exploded = true;
  }
  update() {
    if (!this.exploded) {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.velocity.y += 0.05;
      this.trail.push(
        new Particle(this.x, this.y, this.color, {x:0, y:0}, this.radius)
      );
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

class App {
  constructor() {
    this.settings = {
      color:  undefined,
      speed:  1,
      parts:  1,
      radius: 0.75,
      fired:  1,
      tperfw: 1,
      max_fw: 25,
      notice: true,
      multi:  false,
    };
    this.fireworks = {
      data: [],
      total: 0,
    };
  }
  color2rgb(str) {
    switch(str) {
      // $settings.color
      case "red":    return {r:255, g:  0, b:  0};
      case "gold":   return {r:255, g:211, b:  0};
      case "purple": return {r:190, g: 10, b:255};
      case "yellow": return {r:255, g:255, b:  0};
      case "green":  return {r:161, g:255, b: 10};
      case "cyan":   return {r: 10, g:239, b:255};
      case "blue":   return {r: 20, g:125, b:245};
      case "pink":   return {r:255, g:  1, b:144};
      case "orange": return {r:255, g:135, b:  0};
      case "white":  return {r:255, g:255, b:255};
      case "black":  return {r:  0, g:  0, b:  0};
      // $user.colorGroup
      case "o":
      case "m":
      case "f":      return {r:255, g:  0, b:  0};
      case "l":      return {r: 48, g: 25, b: 52};
      case "p":      return {r:177, g:156, b:217};
      case "tr":     return {r:  0, g:  0, b:139};
      case "t":      return {r:173, g:216, b:230};
      case "g":      return {r:128, g:128, b:128};
      default: return undefined;
    }
  }
  speed2num(str) {
    switch(str) {
      case "slow":  return 0.5;
      case "fast":  return 2;
      default: return 1;
    }
  }
  parts2num(str) {
    switch(str) {
      case "few":    return 0.5;
      case "much":   return 5;
      case "huge":   return 10;
      case "atomic": return 50;
      default: return 1;
    }
  }
  fired2num(str) {
    switch (str) {
      case "separate": return 0.01;
      case "together": return 1;
      default: return 0.1;
    }
  }
  radius2num(str) {
    switch (str) {
      case "small": return 0.5;
      case "big":   return 1.1;
      default: return 0.75;
    }
  }
  get_settings() {
    this.settings = {
      color:  this.color2rgb( $settings.color ),
      speed:  this.speed2num( $settings.speed ),
      parts:  this.parts2num( $settings.parts ),
      radius: this.radius2num( $settings.radius ),
      fired:  this.fired2num( $settings.fired ),
      tperfw: $settings.tperfw,
      max_fw: $settings.max_fw,
      notice: $settings.notice,
      multi:  $settings.multi,
    };
  }
  set_fireworks_total(tokens) {
    this.fireworks.total = Math.round(tokens / this.settings.tperfw);
  }
}

function animate_fireworks() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  app.fireworks.data.forEach( (firework) => {firework.update(); firework.draw();} );
  if (app.fireworks.total > 0 && Math.random() < app.settings.fired) {
    app.fireworks.data.push(
      new Firework(
        Math.random() * canvas.width,
        Math.random() * canvas.height / 2,
        app.settings.color,
        app.settings.speed,
        app.settings.parts,
        app.settings.radius,
        app.settings.multi,
      )
    );
    app.fireworks.total--;
  }
  app.fireworks.data = app.fireworks.data.filter(
    (firework) => !firework.exploded || firework.particles.length > 0 
  );
  if (app.fireworks.total > 0 || app.fireworks.data.length)
    requestAnimationFrame(animate_fireworks);
}

function show_notice(delay) {
  if (app.settings.notice) {
    let elem = document.getElementById("notice_box");
    elem.style.visibility = "visible";
    setTimeout(() => elem.style.visibility = "hidden", delay);
  }
}

function notice_tip(tip, delay) {
  let elem = document.getElementById("span1");
  elem.style.color =
    `rgb(${tip.colorGroup.r}, ${tip.colorGroup.g}, ${tip.colorGroup.b})`;
  elem.innerHTML = tip.username;
  document.getElementById("span2").innerHTML =
    " tipped " + tip.tokens + ((tip.tokens == 1)? " token" : " tokens");
  show_notice(delay);
}

function notice_start(delay) {
  let elem = document.getElementById("span1");
  elem.style.color = "white";
  elem.innerHTML = "Starting Fireworks For Tokens";
  show_notice(delay);
}

let app = new App;

$overlay.on("tip", (e) => {
  app.get_settings();
  notice_tip(e, 3000);
  app.set_fireworks_total(e.tokens);
  if (app.fireworks.total > app.settings.max_fw) 
    app.fireworks.total = app.settings.max_fw;
  animate_fireworks();
}, 2000);

$overlay.on("start", (e) => {
  notice_start(2000);
  app.set_fireworks.total(2);
  requestAnimationFrame(animate_fireworks);
}, 2000);

