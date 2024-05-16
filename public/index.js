document.addEventListener('scroll', function () {
  var header = document.getElementById('top-nav');
  if (window.scrollY === 0) {
    header.style.backgroundColor = 'transparent';
    header.style.border = 'none';
  } else {
    header.style.backgroundColor = '#28282880';
    header.style.border = '1px solid #4f4f4f75';
  }
});

const listItems = document.querySelectorAll('#top-nav > ul > li');
const navUl = document.querySelector('#top-nav ul');
const indicator = document.createElement('div');

indicator.className = 'indicator';
indicator.style.position = 'absolute';
indicator.style.bottom = '0';
indicator.style.height = '100%';
indicator.style.backgroundColor = '#ffffff80';
indicator.style.opacity = '0.25';
indicator.style.color = '#ffffff';
const transitionTime = '0.15s';
const transitionValue = 'ease-in-out';
indicator.style.transition = `left ${transitionTime} ${transitionValue}, width ${transitionTime} ${transitionValue}`;
navUl.appendChild(indicator);

function updateIndicator() {
  const activeItem = document.querySelector('#top-nav ul li.active');
  if (activeItem) {
    const leftPosition = activeItem.offsetLeft;
    const width = activeItem.offsetWidth;
    indicator.style.left = `${leftPosition}px`;
    indicator.style.width = `${width}px`;
  }
}

// Function to handle scroll event
function handleScroll() {
  let found = false;
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 0 && rect.bottom >= 0 && !found) {
      listItems.forEach((li) => li.classList.remove('active'));
      const activeItem = listItems[index];
      if (activeItem) {
        activeItem.classList.add('active');
        updateIndicator();
        found = true;
      }
    }
  });
}

// Throttle function to limit the rate of function execution
function throttle(fn, wait) {
  let time = Date.now();
  return function () {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  }
}

listItems.forEach((item) => {
  item.addEventListener('click', function (event) {
    event.preventDefault();

    // Remove the "active" class from all items
    listItems.forEach((li) => li.classList.remove('active'));

    // Add the "active" class to the clicked item
    item.classList.add('active');

    // Scroll to the corresponding section
    const targetId = item.getAttribute('data-target');
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Update the indicator position and width after scrolling finishes
    setTimeout(updateIndicator, 300); // Adjust the timeout as needed
  });
});

// Initial update
updateIndicator();

const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('canvas-overlay');
let mouse = { x: null, y: null };

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = 600 * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = '600px';
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

overlay.addEventListener('mousemove', (event) => {
  const rect = overlay.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
});

class Particle {
  constructor(x, y, dx, dy, size) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = size;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.isNearMouse() ? '#eee48a' : 'white';
    ctx.fill();
  }

  update() {
    if (this.x + this.size > canvas.width / (window.devicePixelRatio || 1) || this.x - this.size < 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.size > canvas.height / (window.devicePixelRatio || 1) || this.y - this.size < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  }

  isNearMouse() {
    return getDistance(this.x, this.y, mouse.x, mouse.y) < 75;
  }
}

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function drawLines(particles, maxDistance) {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const distance = getDistance(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      if (distance < maxDistance) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / maxDistance})`;
        ctx.stroke();
      }
    }
  }
}

const particles = [];
const particleCount = 200; // default 100
const maxDistance = 100; // default 100

for (let i = 0; i < particleCount; i++) {
  const size = 3;
  const x = Math.random() * (canvas.width / (window.devicePixelRatio || 1) - size * 2) + size;
  const y = Math.random() * (canvas.height / (window.devicePixelRatio || 1) - size * 2) + size;
  const dx = (Math.random() - 0.5) * 2;
  const dy = (Math.random() - 0.5) * 2;
  particles.push(new Particle(x, y, dx, dy, size));
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(particle => {
    particle.update();
  });

  drawLines(particles, maxDistance);
}

animate();

document.getElementById('read-more').addEventListener('click', function () {
  var extendedAbout = document.getElementById('extended-about');
  if (extendedAbout.classList.contains('hidden')) {
    extendedAbout.classList.remove('hidden');
    this.textContent = 'read less ...';
  } else {
    extendedAbout.classList.add('hidden');
    this.textContent = 'read more ...';
  }
});

const sections = document.querySelectorAll('section');

// Throttle the scroll event handler
document.addEventListener('scroll', throttle(handleScroll, 100));



// index.js
document.addEventListener('DOMContentLoaded', function () {
  fetch('/api/spotify')
    .then(response => response.json())
    .then(data => {
      console.log('Currently playing:', data.track, 'by', data.artist);
    })
    .catch(error => console.error('Error fetching data:', error));
});