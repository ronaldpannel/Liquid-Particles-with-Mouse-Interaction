/**@type{HTMLCanvasElement} */
const canvas1 = document.getElementById("canvas1");
const ctx1 = canvas1.getContext("2d");
canvas1.width = window.innerWidth;
canvas1.height = window.innerHeight;
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;

let particleArray = [];
let numOfParticles = 100;
let mouse = {
  x: undefined,
  y: undefined,
  radius: 100,
  pressed: true,
};

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 15 + 15;
    this.density = Math.random() * 40 + 20;
    this.basePosX = this.x;
    this.basePosY = this.y;
    this.color = "white";
    this.vx = -5;
    this.velX = Math.random() * 5 + -2.5;
    this.velY = Math.random() * 5 + -2.5;
  }
  update() {
    this.x += this.velX;
    this.y += this.velY;

    if (this.x + this.radius > canvas1.width) {
      this.x = canvas1.width - this.radius;
      this.velX *= -1;
    }
    if (this.x < this.radius) {
      this.x = this.radius;
      this.velX *= -1;
    }

    if (this.y + this.radius > canvas1.height) {
      this.y = canvas1.height - this.radius;
      this.velY *= -1;
    }
    if (this.y < this.radius) {
      this.y = this.radius;
      this.velY *= -1;
    }
  }
  draw(ctx1) {
    ctx1.beginPath();
    ctx1.fillStyle = this.color;
    ctx1.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx1.fill();
    ctx1.closePath();
  }

  pushParticles() {
    let dx = this.x - mouse.x;
    let dy = this.y - mouse.y;
    let distance = Math.hypot(dx, dy);
    let angle = Math.atan2(dy, dx);

    if (distance < mouse.radius) {
      this.x -= Math.cos(angle) * this.density;
      this.y -= Math.sin(angle) * this.density;
    } else {
      if (this.x !== this.basePosX) {
        let dx = this.x - this.basePosX;
        this.x -= dx / 10;
      }
      if (this.y !== this.basePosX) {
        let dy = this.y - this.basePosY;
        this.y -= dy / 10;
      }
    }
  }
  connect(ctx2) {
    for (let i = 0; i < particleArray.length; i++) {
      for (let j = i; j < particleArray.length; j++) {
        let dx = particleArray[i].x - particleArray[j].x;
        let dy = particleArray[i].y - particleArray[j].y;
        let distance = Math.hypot(dx, dy);
        if (distance < mouse.radius / 2) {
          ctx2.beginPath();
          ctx2.strokeStyle = "rgba(0,0,0,0.01)";
          ctx2.moveTo(particleArray[i].x, particleArray[i].y);
          ctx2.lineTo(particleArray[j].x, particleArray[j].y);
          ctx2.stroke();
        }
      }
    }
  }
}
function initParticles() {
  for (let i = 0; i < numOfParticles; i++) {
    let x = Math.random() * canvas1.width;
    let y = Math.random() * canvas1.height;

    particleArray.push(new Particle(x, y));
  }
}
initParticles();

function animate() {
  ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  particleArray.forEach((particle) => {
    particle.draw(ctx1);
    particle.update();
    particle.connect(ctx2);
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("mousedown", (e) => {
  mouse.pressed = true;
});
window.addEventListener("mousemove", (e) => {
  if (mouse.pressed) {
    mouse.x = e.x;
    mouse.y = e.y;
    particleArray.forEach((particle) => {
      particle.pushParticles();
    });
  }
});

window.addEventListener("mouseup", (e) => {
  mouse.pressed = false;
});
window.addEventListener("resize", (e) => {
  location.reload();
});
