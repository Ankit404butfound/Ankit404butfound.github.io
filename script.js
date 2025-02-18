const canvas = document.getElementById("shootingStars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isScrolling = false;  // Flag to prevent multiple scrolling actions
const stars = [];

window.addEventListener('wheel', (event) => {
    if (isScrolling) return; // Prevent multiple scroll actions

    isScrolling = true; // Lock scrolling

    const direction = event.deltaY > 0 ? 'down' : 'up'; // Determine scroll direction

    scrollToSection(direction);

    // Unlock scrolling after the transition
    setTimeout(() => {
        isScrolling = false;
    }, 1000); // Timeout duration should match scroll transition time
});

function scrollToSection(direction) {
    const sections = document.querySelectorAll('section');
    const currentScroll = window.scrollY;
    const sectionHeight = window.innerHeight;

    let targetSection;
    let currentSection;

    // Find the current section based on scroll position
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        if (currentScroll >= sectionTop - sectionHeight / 2 && currentScroll < sectionTop + sectionHeight / 2) {
            currentSection = section;
            if (direction === 'down' && sections[index + 1]) {
                targetSection = sections[index + 1];
            } else if (direction === 'up' && sections[index - 1]) {
                targetSection = sections[index - 1];
            }
        }
    });

    if (targetSection) {
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
    }
}



class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 0.5;
        this.length = Math.random() * 80 + 30;
        this.speed = Math.random() * 3 + 2;
        this.angle = Math.PI / 4;
        this.opacity = 0;
        this.opacityChange = Math.random() * 0.02 + 0.005; // Controls fading speed
        this.fadingIn = true;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.length -= 0.3;

        if (this.fadingIn) {
            this.opacity += this.opacityChange;
            if (this.opacity >= 1) {
                this.fadingIn = false;
            }
        } else {
            this.opacity -= this.opacityChange;
            if (this.opacity <= 0) {
                this.reset();
            }
        }
    }

    draw() {
        // Create a gradient that goes from one color to another
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`); // Starting color (white)
        gradient.addColorStop(1, `rgba(0, 124, 190, ${this.opacity})`); // Ending color (cyan)

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
        ctx.strokeStyle = gradient;
        ctx.stroke();
    }
}

for (let i = 0; i < 15; i++) {
    stars.push(new ShootingStar());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let star of stars) {
        star.update();
        star.draw();
    }

    requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
