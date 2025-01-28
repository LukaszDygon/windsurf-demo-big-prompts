class Boid {
    constructor(x, y) {
        this.position = { x, y };
        this.velocity = {
            x: Math.random() * 4 - 2,
            y: Math.random() * 4 - 2
        };
        this.baseSpeed = 4;
        this.panicSpeed = 8;
        this.avoidanceRadius = 100;
        this.isAvoiding = false;
    }

    update(boids, mouse) {
        // Check mouse avoidance
        const dx = mouse.x - this.position.x;
        const dy = mouse.y - this.position.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        
        this.isAvoiding = distToMouse < this.avoidanceRadius;
        
        // Apply flocking behavior
        const alignment = this.align(boids);
        const cohesion = this.cohesion(boids);
        const separation = this.separate(boids);
        
        // Update velocity
        this.velocity.x += alignment.x + cohesion.x + separation.x;
        this.velocity.y += alignment.y + cohesion.y + separation.y;
        
        // Normalize velocity and apply speed
        const speed = this.isAvoiding ? this.panicSpeed : this.baseSpeed;
        const magnitude = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        this.velocity.x = (this.velocity.x / magnitude) * speed;
        this.velocity.y = (this.velocity.y / magnitude) * speed;
        
        // Update position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        // Wrap around screen edges
        const canvas = document.getElementById('boidCanvas');
        if (this.position.x < 0) this.position.x = canvas.width;
        if (this.position.x > canvas.width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = canvas.height;
        if (this.position.y > canvas.height) this.position.y = 0;
    }

    align(boids) {
        let avgVelocity = { x: 0, y: 0 };
        let count = 0;
        
        boids.forEach(boid => {
            if (boid !== this && this.distance(boid) < 50) {
                avgVelocity.x += boid.velocity.x;
                avgVelocity.y += boid.velocity.y;
                count++;
            }
        });
        
        if (count > 0) {
            avgVelocity.x /= count;
            avgVelocity.y /= count;
        }
        
        return avgVelocity;
    }

    cohesion(boids) {
        let centerOfMass = { x: 0, y: 0 };
        let count = 0;
        
        boids.forEach(boid => {
            if (boid !== this && this.distance(boid) < 50) {
                centerOfMass.x += boid.position.x;
                centerOfMass.y += boid.position.y;
                count++;
            }
        });
        
        if (count > 0) {
            centerOfMass.x = centerOfMass.x / count - this.position.x;
            centerOfMass.y = centerOfMass.y / count - this.position.y;
        }
        
        return centerOfMass;
    }

    separate(boids) {
        let avoidance = { x: 0, y: 0 };
        
        boids.forEach(boid => {
            if (boid !== this) {
                const dist = this.distance(boid);
                if (dist < 30) {
                    avoidance.x -= (boid.position.x - this.position.x);
                    avoidance.y -= (boid.position.y - this.position.y);
                }
            }
        });
        
        return avoidance;
    }

    distance(other) {
        const dx = this.position.x - other.position.x;
        const dy = this.position.y - other.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    draw(ctx) {
        // Save context state
        ctx.save();
        
        // Move to boid position and rotate
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(Math.atan2(this.velocity.y, this.velocity.x));
        
        // Draw surfboard base
        ctx.fillStyle = this.isAvoiding ? '#ff6b6b' : '#4ecdc4';
        ctx.beginPath();
        ctx.moveTo(-15, -5);
        ctx.lineTo(15, 0);
        ctx.lineTo(-15, 5);
        ctx.closePath();
        ctx.fill();
        
        // Draw sail
        ctx.fillStyle = this.isAvoiding ? '#ff8787' : '#45b7af';
        ctx.beginPath();
        ctx.moveTo(-5, -15);
        ctx.quadraticCurveTo(5, -5, -5, 15);
        ctx.lineTo(-5, -15);
        ctx.fill();
        
        // Restore context state
        ctx.restore();
    }
}

class SpeechBubble {
    constructor(text, boid) {
        this.text = text;
        this.boid = boid;
        this.opacity = 0.6;
        this.lifetime = 5000; // 5 seconds
        this.birth = Date.now();
        this.tail = { x: 0, y: 0 };
    }

    isExpired() {
        return Date.now() - this.birth > this.lifetime;
    }

    draw(ctx) {
        const age = Date.now() - this.birth;
        const fadeStart = this.lifetime - 1000; // Start fading in the last second
        
        if (age > fadeStart) {
            this.opacity = 0.6 * (1 - (age - fadeStart) / 1000);
        }

        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.strokeStyle = `rgba(0, 0, 0, ${this.opacity})`;
        
        // Position bubble above boid
        const bubbleX = this.boid.position.x;
        const bubbleY = this.boid.position.y - 40;
        
        // Draw bubble
        ctx.beginPath();
        ctx.roundRect(bubbleX - 50, bubbleY - 20, 100, 30, 10);
        ctx.fill();
        ctx.stroke();
        
        // Draw tail
        ctx.beginPath();
        ctx.moveTo(bubbleX - 10, bubbleY + 10);
        ctx.lineTo(bubbleX, bubbleY + 20);
        ctx.lineTo(bubbleX + 10, bubbleY + 10);
        ctx.fill();
        ctx.stroke();
        
        // Draw text
        ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.text, bubbleX, bubbleY);
        
        ctx.restore();
    }
}

class BoidSimulation {
    constructor() {
        this.canvas = document.getElementById('boidCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.boids = [];
        this.bubbles = [];
        this.mouse = { x: 0, y: 0 };
        this.phrases = [
            "Cowabunga! 🏄‍♂️",
            "Gnarly waves! 🌊",
            "Totally tubular! 🤙",
            "Surf's up! 🏄‍♂️",
            "Radical! 🌊",
            "Shred it! 🏄‍♂️",
            "Hang ten! 🤙",
            "Epic swell! 🌊",
            "Stoked! 🏄‍♂️",
            "Catch the wave! 🌊"
        ];

        // Set initial canvas size
        this.handleResize();
        
        // Initialize boids
        for (let i = 0; i < 30; i++) {
            this.boids.push(new Boid(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height
            ));
        }
        
        // Set up event listeners
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        window.addEventListener('resize', () => this.handleResize());
        
        // Start animation
        this.animate();
        
        // Start random speech bubbles
        setInterval(() => this.addRandomBubble(), 1000);
    }

    handleResize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    addRandomBubble() {
        if (Math.random() < 0.1) { // 10% chance per second
            const randomBoid = this.boids[Math.floor(Math.random() * this.boids.length)];
            const randomPhrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];
            this.bubbles.push(new SpeechBubble(randomPhrase, randomBoid));
        }
    }

    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw boids
        this.boids.forEach(boid => {
            boid.update(this.boids, this.mouse);
            boid.draw(this.ctx);
        });
        
        // Update and draw bubbles
        this.bubbles = this.bubbles.filter(bubble => !bubble.isExpired());
        this.bubbles.forEach(bubble => bubble.draw(this.ctx));
        
        // Request next frame
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize simulation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BoidSimulation();
});
