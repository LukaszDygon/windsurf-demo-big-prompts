class Boid {
    constructor(x, y) {
        this.position = new Vector(x, y);
        this.velocity = Vector.random2D();
        this.velocity.setMagnitude(4); // Base speed
        this.acceleration = new Vector(0, 0);
        this.maxForce = 0.2;
        this.maxSpeed = 4;
        this.panicSpeed = 8;
        this.size = 20;
        this.angle = 0;
        this.speaking = false;
        this.lastSpeechTime = 0;
    }

    align(boids) {
        let perceptionRadius = 50;
        let steering = new Vector(0, 0);
        let total = 0;

        for (let other of boids) {
            let d = this.position.dist(other.position);
            if (other !== this && d < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.setMagnitude(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    cohesion(boids) {
        let perceptionRadius = 100;
        let steering = new Vector(0, 0);
        let total = 0;

        for (let other of boids) {
            let d = this.position.dist(other.position);
            if (other !== this && d < perceptionRadius) {
                steering.add(other.position);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMagnitude(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    separation(boids) {
        let perceptionRadius = 50;
        let steering = new Vector(0, 0);
        let total = 0;

        for (let other of boids) {
            let d = this.position.dist(other.position);
            if (other !== this && d < perceptionRadius) {
                let diff = Vector.sub(this.position, other.position);
                diff.div(d * d);
                steering.add(diff);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.setMagnitude(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    avoidMouse(mouseX, mouseY) {
        let mouse = new Vector(mouseX, mouseY);
        let d = this.position.dist(mouse);
        let avoidanceRadius = 100;

        if (d < avoidanceRadius) {
            let diff = Vector.sub(this.position, mouse);
            diff.div(d * d);
            diff.mult(5); // Stronger avoidance force
            this.maxSpeed = this.panicSpeed;
            return diff;
        }
        this.maxSpeed = 4;
        return new Vector(0, 0);
    }

    edges(width, height) {
        if (this.position.x > width) this.position.x = 0;
        else if (this.position.x < 0) this.position.x = width;
        if (this.position.y > height) this.position.y = 0;
        else if (this.position.y < 0) this.position.y = height;
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
        this.angle = this.velocity.heading() + Math.PI / 2;
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    flock(boids, mouseX, mouseY) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);
        let mouseAvoidance = this.avoidMouse(mouseX, mouseY);

        alignment.mult(1);
        cohesion.mult(1);
        separation.mult(1.5);
        mouseAvoidance.mult(2);

        this.applyForce(alignment);
        this.applyForce(cohesion);
        this.applyForce(separation);
        this.applyForce(mouseAvoidance);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);

        // Draw surfboard
        ctx.fillStyle = '#FFE4C4';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw sail
        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.moveTo(0, -this.size/2);
        ctx.quadraticCurveTo(this.size/2, -this.size, 0, -this.size*1.5);
        ctx.quadraticCurveTo(-this.size/2, -this.size, 0, -this.size/2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
    }

    mult(n) {
        this.x *= n;
        this.y *= n;
    }

    div(n) {
        this.x /= n;
        this.y /= n;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    setMagnitude(n) {
        let m = this.mag();
        if (m !== 0) {
            this.mult(n / m);
        }
    }

    limit(n) {
        let m = this.mag();
        if (m > n) {
            this.setMagnitude(n);
        }
    }

    heading() {
        return Math.atan2(this.y, this.x);
    }

    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    dist(v) {
        let dx = this.x - v.x;
        let dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static random2D() {
        let angle = Math.random() * Math.PI * 2;
        return new Vector(Math.cos(angle), Math.sin(angle));
    }
}

// Speech bubble phrases
const SURFER_PHRASES = [
    "Cowabunga! 🏄‍♂️",
    "Totally tubular! 🌊",
    "Hang loose, brah! 🤙",
    "Shred the gnar! 🏄‍♂️",
    "Epic waves today! 🌊",
    "Stoked! 🤘",
    "Radical! 🏄‍♂️",
    "Catch the wave! 🌊",
    "Surf's up! 🏄‍♂️",
    "Gnarly! 🤙",
    "Riding high! 🌊",
    "Pure stoke! 🏄‍♂️",
    "Send it! 🤘",
    "Flow state! 🌊",
    "Carving it up! 🏄‍♂️",
    "Riding the flow! 🌊",
    "Crushing it! 🤙",
    "Wave check! 🏄‍♂️",
    "Perfect conditions! 🌊",
    "Let's ride! 🏄‍♂️"
];

class SpeechBubble {
    constructor(text, x, y) {
        this.element = document.createElement('div');
        this.element.className = 'speech-bubble';
        this.element.textContent = text;
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
        document.getElementById('canvas-container').appendChild(this.element);
        
        setTimeout(() => {
            this.element.style.opacity = '0';
            setTimeout(() => {
                this.element.remove();
            }, 300);
        }, 5000);
    }

    updatePosition(x, y) {
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
    }
}

// Main simulation
class BoidSimulation {
    constructor() {
        this.canvas = document.getElementById('boids-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.boids = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.speechBubbles = new Map();
        this.isActive = false;
        this.animationFrame = null;
        this.resizeCanvas();
        this.setupEventListeners();
        this.initializeBoids();
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.isActive) return;
            let rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = -1000;
            this.mouseY = -1000;
        });

        // Toggle functionality
        const toggle = document.getElementById('view-toggle');
        toggle.addEventListener('change', (e) => {
            this.isActive = e.target.checked;
            if (this.isActive) {
                this.canvas.style.pointerEvents = 'auto';
                this.start();
            } else {
                this.canvas.style.pointerEvents = 'none';
                this.stop();
            }
        });
    }

    start() {
        if (!this.animationFrame) {
            this.animate();
        }
    }

    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    initializeBoids() {
        for (let i = 0; i < 30; i++) {
            this.boids.push(new Boid(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height
            ));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw boids
        for (let boid of this.boids) {
            boid.flock(this.boids, this.mouseX, this.mouseY);
            boid.update();
            boid.edges(this.canvas.width, this.canvas.height);
            boid.draw(this.ctx);

            // Random speech bubbles
            if (this.isActive && Math.random() < 0.001) { // Only show speech bubbles when active
                let phrase = SURFER_PHRASES[Math.floor(Math.random() * SURFER_PHRASES.length)];
                new SpeechBubble(phrase, boid.position.x, boid.position.y - 50);
            }
        }

        if (this.isActive) {
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }
    }
}

// Start simulation when page loads
window.addEventListener('load', () => {
    new BoidSimulation();
});
