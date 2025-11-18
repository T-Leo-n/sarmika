let highestZ = 1;

class Paper {
  holdingPaper = false;
  rotating = false;
  startX = 0;
  startY = 0;
  prevX = 0;
  prevY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentX = 0;
  currentY = 0;
  startAngle = 0;
  currentAngle = 0;

  init(paper) {
    // --- Mouse events (for PC) ---
    paper.addEventListener('mousedown', (e) => this.startDrag(e.clientX, e.clientY, paper));
    window.addEventListener('mousemove', (e) => this.move(e.clientX, e.clientY, paper));
    window.addEventListener('mouseup', () => this.end());

    // --- Touch events (for mobile) ---
    paper.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.startDrag(e.touches[0].clientX, e.touches[0].clientY, paper);
      } else if (e.touches.length === 2) {
        this.startRotate(e.touches, paper);
      }
    });

    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        this.move(e.touches[0].clientX, e.touches[0].clientY, paper);
      } else if (e.touches.length === 2) {
        this.rotate(e.touches, paper);
      }
    });

    paper.addEventListener('touchend', () => this.end());
    paper.addEventListener('touchcancel', () => this.end());
  }

  startDrag(x, y, paper) {
    this.holdingPaper = true;
    this.rotating = false;

    this.startX = x;
    this.startY = y;
    this.prevX = x;
    this.prevY = y;

    paper.style.zIndex = highestZ++;
  }

  move(x, y, paper) {
    if (!this.holdingPaper || this.rotating) return;

    this.velX = x - this.prevX;
    this.velY = y - this.prevY;

    this.currentX += this.velX;
    this.currentY += this.velY;

    this.prevX = x;
    this.prevY = y;

    paper.style.transform = `translate(${this.currentX}px, ${this.currentY}px) rotate(${this.rotation}deg)`;
  }

  end() {
    this.holdingPaper = false;
    this.rotating = false;
  }

  startRotate(touches, paper) {
    this.rotating = true;
    this.holdingPaper = false;

    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    this.startAngle = Math.atan2(dy, dx) * (180 / Math.PI);

    paper.style.zIndex = highestZ++;
  }

  rotate(touches, paper) {
    if (!this.rotating) return;

    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    const newAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    const angleDiff = newAngle - this.startAngle;

    this.rotation += angleDiff;
    this.startAngle = newAngle;

    paper.style.transform = `translate(${this.currentX}px, ${this.currentY}px) rotate(${this.rotation}deg)`;
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
