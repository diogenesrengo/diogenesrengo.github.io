const images = {
  "coin": "https://appimage.static.mmcdn.com/application_images/2be204e1788a8ff58d4664085889309cc3e6da9c.png",
}
document.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('fireworks-canvas');
  var ctx = canvas.getContext('2d');
  var particles = [];

  function createFirework(x, y) {
    var colors = ['#FF0', '#0F0', '#00F', '#F00', '#F0F', '#0FF'];
    for (var i = 0; i < 100; i++) {
      particles.push({
        x: x,
        y: y,
        size: Math.random() * 5 + 1,
        speedX: (Math.random() - 0.5) * 10,
        speedY: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: Math.random() * 20 + 10
      });
    }
  }

  function drawFireworkParticle(particle) {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = particle.color;
    ctx.fill();
  }

  function updateFireworkParticle(particle) {
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.life -= 1;
  }

  function showFireworks() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createFirework(canvas.width / 2, canvas.height / 2);

    function animateFireworks() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(function(particle) {
        updateFireworkParticle(particle);
        if (particle.life > 0) {
          drawFireworkParticle(particle);
        }
      });

      particles = particles.filter(particle => particle.life > 0);

      if (particles.length > 0) {
        requestAnimationFrame(animateFireworks);
      } else {
        document.getElementById('fireworks-overlay').classList.add('hidden');
      }
    }

    document.getElementById('fireworks-overlay').classList.remove('hidden');
    animateFireworks();
  }

  // Aquí deberás incluir lógica para llamar a showFireworks() cuando se reciba una donación que supere la más alta.
});
