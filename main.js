const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const heartParticles = [];
const HEART_COLOR = "#ff66b2";
const STAR_COLOR = "rgba(255,255,255,0.8)";

// 🔹 Tạo sao
for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2,
    speed: Math.random() * 0.4 + 0.1
  });
}

// 🔹 Vẽ sao
function drawStars() {
  for (let s of stars) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = STAR_COLOR;
    ctx.fill();
    s.y += s.speed;
    if (s.y > canvas.height) s.y = 0;
  }
}

// 🔹 Hàm trái tim
function heartShape(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t)
          - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return {x, y};
}

// 🔹 Tạo hạt trái tim
for (let i = 0; i < 300; i++) {
  const t = Math.random() * Math.PI * 2;
  const h = heartShape(t);
  heartParticles.push({
    tx: canvas.width / 2 + h.x * 15,
    ty: canvas.height / 2 - h.y * 15,
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    angle: Math.random() * Math.PI * 2,
    speed: Math.random() * 1.5 + 0.5,
    size: Math.random() * 5 + 4
  });
}

// 🔹 Vẽ tam giác
function drawTriangle(x, y, size, angle, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size, size);
  ctx.lineTo(-size, size);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.shadowBlur = 20;
  ctx.shadowColor = color;
  ctx.fill();
  ctx.restore();
}

// ✈️ Máy bay
let plane = {
  x: -200,
  y: canvas.height / 3,
  speed: 3,
  textShown: false,
  textX: null
};

// Vẽ máy bay (hình đơn giản)
function drawPlane(x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#ffd1dc";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(40, -10);
  ctx.lineTo(80, 0);
  ctx.lineTo(40, 10);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// 💌 Vẽ chữ thả xuống
function drawFallingText(x, y, text) {
  ctx.save();
  ctx.font = "bold 40px 'Comic Sans MS'";
  ctx.fillStyle = "#ff99cc";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#ff66b2";
  ctx.textAlign = "center";
  ctx.fillText(text, x, y);
  ctx.restore();
}

// 🔹 Animation
let textY = -100;
let showText = false;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStars();

  // Trái tim
  for (let p of heartParticles) {
    const dx = p.tx - p.x;
    const dy = p.ty - p.y;
    p.x += dx * 0.02;
    p.y += dy * 0.02;
    p.angle += 0.05;
    drawTriangle(p.x, p.y, p.size, p.angle, HEART_COLOR);
  }

  // Máy bay bay qua
  drawPlane(plane.x, plane.y);
  plane.x += plane.speed;

  // Khi máy bay đến giữa -> thả chữ
  if (plane.x > canvas.width / 2 && !plane.textShown) {
    showText = true;
    plane.textShown = true;
  }

  // Chữ rơi xuống
  if (showText) {
    if (textY < canvas.height / 2) textY += 2;
    drawFallingText(canvas.width / 2, textY, "NÍ HẢO, WỦA ÁI NỈ   💖");
  }

  // Reset máy bay để lặp lại
  if (plane.x > canvas.width + 200) {
    plane.x = -200;
    plane.textShown = false;
    showText = false;
    textY = -100;
  }

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
