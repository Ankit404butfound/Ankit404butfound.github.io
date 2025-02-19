const canvas = document.getElementById("shootingStars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isScrolling = false;
const stars = [];
const mouseTrailParticles = [];  // Array to store the trail particles

window.addEventListener('wheel', (event) => {
    if (isScrolling) return;

    isScrolling = true;

    const direction = event.deltaY > 0 ? 'down' : 'up';

    scrollToSection(direction);

    setTimeout(() => {
        isScrolling = false;
    }, 1000);
});

document.addEventListener("DOMContentLoaded", () => {
    const repoContainer = document.getElementById("repo-container");
    const githubUsername = "ankit404butfound"; // Replace with your GitHub username

    async function fetchGitHubRepos() {
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated`);
            const repos = await response.json();
            
            repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
            repos.slice(0, 6).forEach(repo => { // Display top 6 repos
                const card = document.createElement("div");
                card.className = "repo-card";
                card.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || "No description available."}</p>
                    <div class="repo-info">
                        <span>⭐ ${repo.stargazers_count}</span>
                        <span>🍴 ${repo.forks_count}</span>
                    </div>
                    <a href="${repo.html_url}" target="_blank">View on GitHub</a>
                `;
                repoContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error fetching repos:", error);
            repoContainer.innerHTML = "<p>Failed to load repositories.</p>";
        }
    }

    fetchGitHubRepos();
});

function scrollToSection(direction) {
    const sections = document.querySelectorAll('section');
    const currentScroll = window.scrollY;
    const sectionHeight = window.innerHeight;

    let targetSection;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        if (currentScroll >= sectionTop - sectionHeight / 2 && currentScroll < sectionTop + sectionHeight / 2) {
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
        this.opacityChange = Math.random() * 0.02 + 0.005;
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
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(0, 124, 190, ${this.opacity})`);

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

class MouseTrail {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 2;  // Size of the trail particles
        this.life = 100;  // Time until the particle fades away
        this.opacity = 1;
    }

    update() {
        this.life -= 2;  // Reduce life
        this.opacity = this.life / 100;  // Fade out effect
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 124, 129, ${this.opacity})`;  // White trail with fading opacity
        ctx.fill();
    }
}

// Track mouse movements and create particles
window.addEventListener('mousemove', (e) => {
    mouseTrailParticles.push(new MouseTrail(e.clientX, e.clientY));
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the shooting stars
    for (let star of stars) {
        star.update();
        star.draw();
    }

    // Draw mouse trail particles
    for (let i = 0; i < mouseTrailParticles.length; i++) {
        const particle = mouseTrailParticles[i];
        particle.update();
        particle.draw();
        if (particle.life <= 0) {
            mouseTrailParticles.splice(i, 1);  // Remove particle when it's fully faded
            i--;
        }
    }

    requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
