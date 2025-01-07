// Dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Function to set the theme
function setTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light-mode');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
    
    if (window.neuralBackground) {
        window.neuralBackground.updateColors();
    }
}

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
} else {
    setTheme(prefersDarkScheme.matches ? 'dark' : 'light');
}

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('light-mode')) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
});

// Listen for system theme changes
prefersDarkScheme.addListener((e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Timeline data
const timelineData = [
    { year: '2023', event: 'Started freelancing as a full-stack developer' },
    { year: '2022', event: 'Completed Advanced Web Development Bootcamp' },
    { year: '2021', event: 'Internship at Tech Innovators Inc.' },
    { year: '2020', event: 'Graduated with a degree in Computer Science' }
];

// Populate timeline
const timeline = document.querySelector('.timeline');
timelineData.forEach(item => {
    const timelineItem = document.createElement('div');
    timelineItem.classList.add('timeline-item');
    timelineItem.innerHTML = `
        <h3>${item.year}</h3>
        <p>${item.event}</p>
    `;
    timeline.appendChild(timelineItem);
});

// Skills section technologies and tooltips
const skills = {
    'Azure': 'Leverage Microsoft\'s cloud platform to deploy, scale, and manage AI and ML solutions efficiently.',
    'Natural Language Processing': 'Expert in developing models for text understanding, sentiment analysis, chatbots, and language generation.',
    'JavaScript': 'Proficient in creating dynamic and interactive user interfaces, with a focus on integrating AI-based features.',
    'APIs': 'Experienced in building and integrating RESTful and GraphQL APIs to connect systems and enable seamless communication.',
    'Next.js': 'Skilled in building modern, server-rendered React applications with optimized performance and SEO capabilities.',
    'AWS': 'Extensive experience using AWS services such as S3, Lambda, and SageMaker for scalable AI and ML deployments.',
    'Kubernetes': 'Competent in container orchestration to manage, scale, and deploy ML models and microservices efficiently.',
    'Angular': 'Develop web applications with Angular for clean, maintainable, and dynamic front-end architectures.',
    'Version Control': 'Strong expertise in version control for collaborative development, ensuring clean workflows and codebase history.',
    'IoT': 'Integrating AI into IoT systems to build intelligent and connected solutions.',
    'Django': 'Building robust, secure, and scalable backend systems for AI-driven web applications.',
    'Unsupervised Learning': 'Research and application of clustering, anomaly detection, and dimensionality reduction in data exploration.'
};

// Create overlay
const overlay = document.createElement('div');
overlay.className = 'tooltip-overlay';
document.body.appendChild(overlay);

// Initialize tooltips
document.querySelectorAll('.letter-box.completed').forEach(box => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    const tech = box.dataset.tech;
    
    tooltip.innerHTML = `
        <button class="tooltip-close">&times;</button>
        <h3>${tech}</h3>
        <p>${skills[tech]}</p>
        <button class="view-progress">View Progress</button>
    `;
    
    document.body.appendChild(tooltip);
    
    // Add close button functionality
    const closeButton = tooltip.querySelector('.tooltip-close');
    closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        tooltip.classList.remove('visible');
        overlay.classList.remove('visible');
    });
    
    box.addEventListener('click', (e) => {
        e.stopPropagation();
        const allTooltips = document.querySelectorAll('.tooltip');
        const isCurrentlyVisible = tooltip.classList.contains('visible');
        
        // Hide all tooltips and overlay
        allTooltips.forEach(t => t.classList.remove('visible'));
        overlay.classList.remove('visible');
        
        if (!isCurrentlyVisible) {
            tooltip.classList.add('visible');
            overlay.classList.add('visible');
        }
    });
});

// Close tooltip when clicking outside
overlay.addEventListener('click', () => {
    document.querySelectorAll('.tooltip').forEach(tooltip => {
        tooltip.classList.remove('visible');
    });
    overlay.classList.remove('visible');
});

// Projects data
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

setCanvasSize();
window.addEventListener('resize', setCanvasSize);

// Node class
class Node {
    constructor(x, y, technology) {
        this.x = x;
        this.y = y;
        this.technology = technology;
        this.connections = [];
        this.speed = {
            x: (Math.random() - 0.5) * 0.15,
            y: (Math.random() - 0.5) * 0.15
        };
        this.radius = 15;
        this.loadLogo();
    }

    loadLogo() {
        this.logo = new Image();
        this.logo.onerror = (e) => {
            console.warn(`Failed to load logo for ${this.technology}`, {
                attempted_url: this.logo.src
            });
            this.logoLoaded = false;
            this.fallbackColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
        };
        this.logo.onload = () => {
            this.logoLoaded = true;
        };
        
        const technology = this.technology.toLowerCase();
        if (technology === 'aws') {
            this.logo.src = 'path/to/your/local/aws-logo.svg';
        } else {
            this.logo.src = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${technology}/${technology}-original.svg`;
        }
    }

    update() {
        this.x += this.speed.x;
        this.y += this.speed.y;

        if (this.x <= this.radius || this.x >= canvas.width - this.radius) this.speed.x *= -1;
        if (this.y <= this.radius || this.y >= canvas.height - this.radius) this.speed.y *= -1;
    }

    draw(highlighted = false) {
        const isLightMode = document.body.classList.contains('light-mode');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        if (isLightMode) {
            ctx.fillStyle = highlighted ? 'rgba(220, 38, 38, 0.8)' : 'rgba(37, 99, 235, 0.6)';
        } else {
            ctx.fillStyle = highlighted ? 'rgba(255, 107, 107, 0.8)' : 'rgba(0, 168, 255, 0.6)';
        }
        ctx.fill();

        if (this.logoLoaded) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius - 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(this.logo, this.x - this.radius + 2, this.y - this.radius + 2, this.radius * 2 - 4, this.radius * 2 - 4);
            ctx.restore();
        } else if (this.fallbackColor) {
            ctx.fillStyle = this.fallbackColor;
            ctx.fill();
        }
    }

    connect(node) {
        this.connections.push(node);
    }

    drawConnections(highlighted = false) {
        const isLightMode = document.body.classList.contains('light-mode');
        this.connections.forEach(node => {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(node.x, node.y);
            
            if (isLightMode) {
                ctx.strokeStyle = highlighted ? 'rgba(220, 38, 38, 0.6)' : 'rgba(37, 99, 235, 0.2)';
            } else {
                ctx.strokeStyle = highlighted ? 'rgba(255, 107, 107, 0.6)' : 'rgba(0, 168, 255, 0.2)';
            }
            ctx.lineWidth = highlighted ? 2 : 1;
            ctx.stroke();
        });
    }
}

// Create nodes
const nodes = [];
const technologies = ['javascript', 'python', 'react', 'nodejs', 'html5', 'css3', 'vuejs', 'angular', 'typescript', 'mongodb', 'postgresql', 'docker', 'kubernetes', 'aws', 'firebase'];
const nodeCount = technologies.length;

for (let i = 0; i < nodeCount; i++) {
    nodes.push(new Node(Math.random() * canvas.width, Math.random() * canvas.height, technologies[i]));
}

// Connect nodes
nodes.forEach(node => {
    const connectionsCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < connectionsCount; i++) {
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
        if (randomNode !== node) {
            node.connect(randomNode);
        }
    }
});

// Create central node
const centralNode = new Node(canvas.width / 2, canvas.height / 2, 'github');
centralNode.radius = 30;

// Animation loop
let animationFrameId = null;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nodes.forEach(node => {
        node.update();
        node.drawConnections();
        node.draw();
    });

    centralNode.draw();

    animationFrameId = requestAnimationFrame(animate);
}

animate();

// Project data
const projects = [
    {
        id: 1,
        title: "AI-Powered Chatbot",
        description: "An intelligent chatbot using natural language processing and machine learning algorithms to provide human-like conversations.",
        technologies: ["python", "tensorflow", "react", "flask"],
        githubUrl: "https://github.com/anjanakvd"
    },
    {
        id: 2,
        title: "Blockchain Voting System",
        description: "A secure and transparent voting system built on blockchain technology, ensuring tamper-proof elections.",
        technologies: ["javascript", "ethereum", "react", "nodejs"],
        githubUrl: "https://github.com/anjanakvd"
    },
    {
        id: 3,
        title: "AR Navigation App",
        description: "An augmented reality app that overlays navigation information on the real world, making city exploration easier and more interactive.",
        technologies: ["swift", "arkit", "firebase"],
        githubUrl: "https://github.com/anjanakvd"
    },
    {
        id: 4,
        title: "IoT Smart Home Hub",
        description: "A centralized system to control and monitor various smart home devices, with voice control and energy optimization features.",
        technologies: ["cpp", "python", "nodejs", "react"],
        githubUrl: "https://github.com/anjanakvd"
    },
    {
        id: 5,
        title: "Quantum Algorithm Simulator",
        description: "A simulator for quantum computing algorithms, helping researchers test and visualize quantum circuits without actual quantum hardware.",
        technologies: ["python", "numpy", "flask"],
        githubUrl: "https://github.com/anjanakvd"
    }
];

// Create popup elements
const popupOverlay = document.createElement('div');
popupOverlay.className = 'popup-overlay';
document.body.appendChild(popupOverlay);

const popup = document.createElement('div');
popup.className = 'project-popup';
popup.innerHTML = `
    <button class="popup-close">&times;</button>
    <h2 id="popup-title"></h2>
    <p id="popup-description"></p>
    <div id="popup-technologies" class="technology-tags"></div>
    <a href="#" class="github-button" target="_blank" rel="noopener noreferrer">
        <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        View on GitHub
    </a>
`;
document.body.appendChild(popup);

const popupTitle = document.getElementById('popup-title');
const popupDescription = document.getElementById('popup-description');
const popupTechnologies = document.getElementById('popup-technologies');
const githubButton = popup.querySelector('.github-button');

// Project interaction
const projectInfo = document.getElementById('projectInfo');
const projectTitle = document.getElementById('projectTitle');
const projectDescription = document.getElementById('projectDescription');
const projectTechnologies = document.getElementById('projectTechnologies');

document.querySelectorAll('#projects li').forEach(project => {
    project.addEventListener('mouseover', (e) => {
        const projectId = parseInt(project.dataset.id);
        const selectedProject = projects.find(p => p.id === projectId);

        projectTitle.textContent = selectedProject.title;
        projectDescription.textContent = selectedProject.description;
        projectTechnologies.innerHTML = selectedProject.technologies
            .map(tech => `<span>${tech}</span>`)
            .join('');

        projectInfo.classList.remove('hidden');
        projectInfo.style.left = `${e.clientX + 10}px`;
        projectInfo.style.top = `${e.clientY + 10}px`;

        // Highlight related nodes and connect to central node
        function highlightNodes() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            nodes.forEach((node) => {
                const isHighlighted = selectedProject.technologies.includes(node.technology);
                node.update();
                node.drawConnections(isHighlighted);
                node.draw(isHighlighted);

                if (isHighlighted) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(centralNode.x, centralNode.y);
                    ctx.strokeStyle = 'rgba(255, 107, 107, 0.6)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            });

            centralNode.draw(true);

            if (!projectInfo.classList.contains('hidden')) {
                animationFrameId = requestAnimationFrame(highlightNodes);
            } else {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
                animate();
            }
        }

        highlightNodes();
    });

    project.addEventListener('mouseout', () => {
        projectInfo.classList.add('hidden');
    });

    // Add click event
    project.addEventListener('click', () => {
        const projectId = parseInt(project.dataset.id);
        const selectedProject = projects.find(p => p.id === projectId);

        popupTitle.textContent = selectedProject.title;
        popupDescription.textContent = selectedProject.description;
        popupTechnologies.innerHTML = selectedProject.technologies
            .map(tech => `<span class="tech-tag">${tech}</span>`)
            .join('');
        githubButton.href = selectedProject.githubUrl;

        popup.classList.add('active');
        popupOverlay.classList.add('active');
    });
});

// Close popup handlers
popup.querySelector('.popup-close').addEventListener('click', () => {
    popup.classList.remove('active');
    popupOverlay.classList.remove('active');
});

popupOverlay.addEventListener('click', () => {
    popup.classList.remove('active');
    popupOverlay.classList.remove('active');
});

// Prevent popup close when clicking inside popup
popup.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Update projectInfo position on mouse move
document.addEventListener('mousemove', (e) => {
    if (!projectInfo.classList.contains('hidden')) {
        const padding = 20;
        let left = e.clientX + 10;
        let top = e.clientY + 10;
        
        const infoRect = projectInfo.getBoundingClientRect();
        
        if (left + infoRect.width > window.innerWidth - padding) {
            left = window.innerWidth - infoRect.width - padding;
        }
        if (top + infoRect.height > window.innerHeight - padding) {
            top = window.innerHeight - infoRect.height - padding;
        }
        
        projectInfo.style.left = `${left}px`;
        projectInfo.style.top = `${top}px`;
    }
});

// After canvas setup, add gradient overlay
const gradientOverlay = document.createElement('div');
gradientOverlay.id = 'gradient-overlay';
document.querySelector('main').insertBefore(gradientOverlay, document.querySelector('#projects'));

// Form submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse) {
            const recaptchaResponse = grecaptcha.getResponse();
            
            if (!recaptchaResponse) {
                alert('Please complete the reCAPTCHA verification');
                return;
            }
            
            const formData = new FormData(contactForm);
            formData.append('g-recaptcha-response', recaptchaResponse);
            
            const response = await fetch('https://formspree.io/f/xzzblgay', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert('Thank you for your message. I will get back to you soon!');
                contactForm.reset();
                grecaptcha.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } else {
            alert('reCAPTCHA has not loaded properly. Please refresh the page and try again.');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        alert('Oops! There was a problem submitting your form. Please try again.');
    }
});

// ScrollReveal for animations
ScrollReveal().reveal('.hero, .about-content, .timeline-item, .skill-item, .project-card', {
    delay: 200,
    distance: '50px',
    origin: 'bottom',
    duration: 1000,
    easing: 'cubic-bezier(0.5, 0, 0, 1)',
    interval: 200
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'var(--header-bg)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.backdropFilter = 'none';
    }
});

// Scroll to top functionality
// Add this at the beginning of your script.js
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopButton = document.querySelector('.scroll-to-top');
    
    // Show/hide button based on scroll position
    function toggleScrollButton() {
        if (window.pageYOffset > window.innerHeight * 0.2) {
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
        }
        
        // Adjust position when near footer
        const footerOffset = document.querySelector('footer').offsetTop;
        if (window.pageYOffset + window.innerHeight > footerOffset - 20) {
            scrollToTopButton.style.bottom = '80px';
        } else {
            scrollToTopButton.style.bottom = '30px';
        }
    }

    // Throttle scroll event
    let isScrolling = false;
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                toggleScrollButton();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    // Scroll to top when clicked
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Add fade-in-up animation to elements when they come into view
const fadeInUpElements = document.querySelectorAll('.fade-in-up');

const fadeInUpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            fadeInUpObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

fadeInUpElements.forEach(element => {
    fadeInUpObserver.observe(element);
});

// Particle effect
function createParticles() {
    const particlesContainers = document.querySelectorAll('.particles');
    if (!particlesContainers.length) return;

    particlesContainers.forEach(container => {
        const particleCount = container.closest('.skills-background') ? 50 : 100;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 2 + 1}s`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(particle);
        }
    });
}

createParticles();

// Intersection Observer for fade-in effect
const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.fade-in-element').forEach(element => {
    fadeInObserver.observe(element);
});


