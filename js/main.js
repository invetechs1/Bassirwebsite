// ========================================
// Bassir Technology - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Animated counter for stats
    const stats = document.querySelectorAll('.stat-value');
    const animateCounter = (element) => {
        const target = parseFloat(element.getAttribute('data-target'));
        const suffix = element.getAttribute('suffix') || '+';
        const duration = 2000;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;

            if (target < 30 && suffix === '.9%') {
                element.textContent = current.toFixed(1) + '%';
            } else if (suffix === '/7') {
                element.textContent = Math.floor(current) + '/7';
            } else {
                element.textContent = Math.floor(current) + (progress === 1 ? suffix : '');
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                // Final formatting
                if (suffix === '.9%') {
                    element.textContent = target.toFixed(1) + '%';
                } else if (suffix === '/7') {
                    element.textContent = Math.floor(target) + '/7';
                } else {
                    element.textContent = Math.floor(target) + suffix;
                }
            }
        };
        requestAnimationFrame(update);
    };

    // Intersection observer for counter and fade-in
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stat-value')) {
                    animateCounter(entry.target);
                }
                if (entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));

    // Add fade-in class to key sections and observe
    const fadeElements = document.querySelectorAll('.solution-card, .why-card, .industry-item, .process-step, .visual-card');
    fadeElements.forEach((el, i) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${(i % 6) * 0.05}s`;
        observer.observe(el);
    });

    // Smooth scroll for anchor links (fallback beyond CSS)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // Contact form handler
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            formMessage.textContent = `Thank you, ${name}! We received your message and will be in touch within one business day.`;
            formMessage.classList.add('success');
            contactForm.reset();
            setTimeout(() => {
                formMessage.classList.remove('success');
                formMessage.textContent = '';
            }, 6000);
        });
    }

    // Set current year
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Parallax effect on hero glows
    const glows = document.querySelectorAll('.glow');
    let ticking = false;
    window.addEventListener('mousemove', (e) => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 30;
                const y = (e.clientY / window.innerHeight - 0.5) * 30;
                glows.forEach((glow, i) => {
                    const factor = (i + 1) * 0.5;
                    glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });
});
