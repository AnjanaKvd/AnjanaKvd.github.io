// Dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
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

// Skills data
const skillsData = [
    { name: 'HTML', icon: '🌐' },
    { name: 'CSS', icon: '🎨' },
    { name: 'JavaScript', icon: '💻' },
    { name: 'React', icon: '⚛️' },
    { name: 'Node.js', icon: '🚀' },
    { name: 'Python', icon: '🐍' },
    { name: 'Git', icon: '📚' },
    { name: 'Responsive Design', icon: '📱' }
];

// Populate skills
const skillsContainer = document.querySelector('.skills-container');
skillsData.forEach(skill => {
    const skillItem = document.createElement('div');
    skillItem.classList.add('skill-item');
    skillItem.innerHTML = `
        <div class="skill-icon">${skill.icon}</div>
        <h3>${skill.name}</h3>
    `;
    skillsContainer.appendChild(skillItem);
});

// Projects data
const projectsData = [
    {
        title: 'E-commerce Website',
        image: 'ecommerce-project.jpg',
        description: 'A fully responsive e-commerce website with product catalog, shopping cart, and secure checkout.',
        tags: ['React', 'Node.js', 'MongoDB'],
        liveDemo: 'https://ecommerce-demo.com',
        sourceCode: 'https://github.com/yourusername/ecommerce-project'
    },
    {
        title: 'Task Management App',
        image: 'task-app.jpg',
        description: 'A productivity app for managing tasks, projects, and team collaboration.',
        tags: ['Vue.js', 'Firebase', 'Vuex'],
        liveDemo: 'https://task-app-demo.com',
        sourceCode: 'https://github.com/yourusername/task-management-app'
    },
    {
        title: 'Weather Forecast App',
        image: 'weather-app.jpg',
        description: 'A mobile-friendly weather app providing real-time forecasts and location-based weather data.',
        tags: ['React Native', 'OpenWeatherMap API'],
        liveDemo: 'https://weather-app-demo.com',
        sourceCode: 'https://github.com/yourusername/weather-forecast-app'
    }
];

// Populate projects
const projectsGrid = document.querySelector('.projects-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

function createProjectCard(project) {
    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card');
    projectCard.innerHTML = `
        <img src="${project.image}" alt="${project.title}" class="project-image">
        <div class="project-info">
            <h3 class="project-title">${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
            <div class="project-links">
                <a href="${project.liveDemo}" target="_blank" rel="noopener noreferrer" class="btn primary">Live Demo</a>
                <a href="${project.sourceCode}" target="_blank" rel="noopener noreferrer" class="btn secondary">Source Code</a>
            </div>
        </div>
    `;
    return projectCard;
}

function filterProjects(category) {
    const filteredProjects = category === 'all' ? projectsData : projectsData.filter(project => project.tags.includes(category));
    projectsGrid.innerHTML = '';
    filteredProjects.forEach(project => {
        projectsGrid.appendChild(createProjectCard(project));
    });
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterProjects(button.dataset.filter);
    });
});

// Initial project population
filterProjects('all');

// Form submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const recaptchaResponse = grecaptcha.getResponse();
    
    if (!recaptchaResponse) {
        alert('Please complete the reCAPTCHA verification');
        return;
    }
    const formData = new FormData(contactForm);
    formData.append('g-recaptcha-response', recaptchaResponse);
    try {
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
    } catch (error) {
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
        navbar.style.background = 'rgba(255, 255, 255, 0.9)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.backdropFilter = 'none';
    }
});

// Scroll to top functionality
const scrollToTopButton = document.querySelector('.scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        scrollToTopButton.classList.add('visible');
    } else {
        scrollToTopButton.classList.remove('visible');
    }
});

scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
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

