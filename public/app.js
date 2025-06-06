appjs:
    window.addEventListener('load', () => {
        // Create a transition element
        const transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-transition-overlay';
        document.body.appendChild(transitionOverlay);

        // Animate in
        gsap.from(transitionOverlay, {
            scaleY: 0,
            duration: 0.8,
            ease: "expo.inOut",
            transformOrigin: "top center",
            onComplete: () => {
                // Animate out
                gsap.to(transitionOverlay, {
                    scaleY: 0,
                    duration: 0.8,
                    ease: "expo.inOut",
                    transformOrigin: "bottom center",
                    delay: 0.2
                });
            }
        });
    });

document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP animations
    initAnimations();

    // Register ScrollToPlugin
    gsap.registerPlugin(ScrollToPlugin);

    // Mobile Menu Toggle with touch support
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a, .contact-btn');
    let touchStartX = 0;
    let touchEndX = 0;

    // Toggle mobile menu function
    function toggleMobileMenu(show) {
        if (mobileMenu) {
            mobileMenu.classList.toggle('active', show);
            navLinks.classList.toggle('active', show);
            document.body.classList.toggle('menu-open', show);

            const spans = mobileMenu.querySelectorAll('span');
            if (show) {
                gsap.to(spans[0], { rotation: 45, y: 6, duration: 0.3 });
                gsap.to(spans[1], { opacity: 0, duration: 0.2 });
                gsap.to(spans[2], { rotation: -45, y: -6, duration: 0.3 });
            } else {
                gsap.to(spans, {
                    rotation: 0,
                    y: 0,
                    opacity: 1,
                    duration: 0.3,
                    overwrite: true
                });
            }
        }
    }

    // Add click and touch events to mobile menu button
    if (mobileMenu) {
        ['click', 'touchend'].forEach(eventType => {
            mobileMenu.addEventListener(eventType, function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleMobileMenu(!navLinks.classList.contains('active'));
            });
        });
    }

    // Handle clicks outside the menu to close it
    document.addEventListener('click', function(e) {
        if (navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !mobileMenu.contains(e.target)) {
            toggleMobileMenu(false);
        }
    });

    // Close mobile menu when clicking on a link
    // In app.js, update the click handler for nav items to:
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Close mobile menu if open
            if (mobileMenu && navLinks.classList.contains('active')) {
                toggleMobileMenu(false);
            }

            // Handle internal page links
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetPage = this.getAttribute('data-page'); // Add data-page attribute

                if (targetPage) {
                    // Handle page transitions
                    window.location.href = targetPage + targetId;
                } else {
                    // Handle same-page anchors
                    const target = document.querySelector(targetId);
                    if (target) {
                        // Scroll to target
                    }
                }
            }
        });
    });

    // Portfolio filtering
    const filterButtons = document.querySelectorAll('.portfolio-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // Portfolio filtering with enhanced animation
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Animate the active state change
                gsap.to(filterButtons, {
                    backgroundColor: 'var(--white)',
                    color: 'var(--secondary)',
                    borderColor: 'var(--border)',
                    duration: 0.3
                });

                gsap.to(this, {
                    backgroundColor: 'var(--primary)',
                    color: 'var(--white)',
                    borderColor: 'var(--primary)',
                    duration: 0.3,
                    ease: "power2.out"
                });

                const filter = this.getAttribute('data-filter');

                // Animate portfolio items
                portfolioItems.forEach(item => {
                    const categories = item.getAttribute('data-category').split(' ');
                    if (filter === 'all' || categories.includes(filter)) {
                        gsap.fromTo(item, { opacity: 0, y: 20 }, {
                            display: 'block',
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            ease: "back.out(1.2)"
                        });
                    } else {
                        gsap.to(item, {
                            opacity: 0,
                            y: 20,
                            duration: 0.3,
                            onComplete: () => {
                                item.style.display = 'none';
                            }
                        });
                    }
                });
            });
        });
    }

    // Add touch support for portfolio items
    portfolioItems.forEach(item => {
        ['touchstart', 'mouseenter'].forEach(eventType => {
            item.addEventListener(eventType, () => {
                gsap.to(item.querySelector('.portfolio-overlay'), {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3
                });
            });
        });

        ['touchend', 'mouseleave'].forEach(eventType => {
            item.addEventListener(eventType, () => {
                gsap.to(item.querySelector('.portfolio-overlay'), {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.3
                });
            });
        });
    });

    // Testimonial slider
    const testimonialTrack = document.querySelector('.testimonial-track');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slides = document.querySelectorAll('.testimonial-slide');
    let slideInterval;

    function updateSlider() {
        if (testimonialTrack && slides.length > 0) {
            gsap.to(testimonialTrack, {
                x: `-${currentSlide * 100}%`,
                duration: 0.5,
                ease: "power2.out"
            });

            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
    }

    function startSlider() {
        slideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        }, 5000);
    }

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', function() {
            clearInterval(slideInterval);
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider();
            startSlider();
        });

        nextButton.addEventListener('click', function() {
            clearInterval(slideInterval);
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
            startSlider();
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            clearInterval(slideInterval);
            currentSlide = index;
            updateSlider();
            startSlider();
        });
    });

    // Start auto-advance
    if (testimonialTrack && slides.length > 0) {
        startSlider();

        // Pause on hover
        testimonialTrack.addEventListener('mouseenter', () => clearInterval(slideInterval));
        testimonialTrack.addEventListener('mouseleave', startSlider);
    }

    // Add touch support for testimonial slider
    if (testimonialTrack) {
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let currentIndex = 0;

        testimonialTrack.addEventListener('touchstart', touchStart);
        testimonialTrack.addEventListener('touchmove', touchMove);
        testimonialTrack.addEventListener('touchend', touchEnd);

        function touchStart(e) {
            startPos = e.touches[0].clientX;
            isDragging = true;
            currentTranslate = prevTranslate;
        }

        function touchMove(e) {
            if (isDragging) {
                const currentPosition = e.touches[0].clientX;
                const diff = currentPosition - startPos;
                currentTranslate = prevTranslate + diff;

                // Add resistance at the edges
                if (currentTranslate > 0) {
                    currentTranslate = currentTranslate / 3;
                } else if (currentTranslate < -(testimonialTrack.offsetWidth - window.innerWidth)) {
                    const overflow = currentTranslate + (testimonialTrack.offsetWidth - window.innerWidth);
                    currentTranslate = -(testimonialTrack.offsetWidth - window.innerWidth) + overflow / 3;
                }

                gsap.set(testimonialTrack, { x: currentTranslate });
            }
        }

        function touchEnd() {
            isDragging = false;
            const movedBy = currentTranslate - prevTranslate;

            if (Math.abs(movedBy) > 100) {
                if (movedBy < 0) {
                    currentIndex = Math.min(currentIndex + 1, document.querySelectorAll('.testimonial-slide').length - 1);
                } else {
                    currentIndex = Math.max(currentIndex - 1, 0);
                }
            }

            prevTranslate = -(currentIndex * window.innerWidth);
            gsap.to(testimonialTrack, {
                x: prevTranslate,
                duration: 0.3
            });

            // Update dots
            document.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
    }

    // Pricing Toggle Functionality with enhanced animation
    const toggleSwitch = document.querySelector('.toggle-switch input[type="checkbox"]');

    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', function() {
            const prices = document.querySelectorAll('.plan-price');

            prices.forEach((price, index) => {
                // Store current price text for animation
                const currentPrice = price.innerHTML;
                const newPrice = this.checked ? ['$49<span>/month</span>', '$99<span>/month</span>', '$129<span>/month</span>'][index] : ['$599<span>/one-time</span>', '$1,199<span>/one-time</span>', '$1,499<span>/one-time</span>'][index];

                // Create animation timeline
                const tl = gsap.timeline();

                // Flip out animation
                tl.to(price, {
                        rotationX: -90,
                        y: 20,
                        opacity: 0,
                        duration: 0.4,
                        ease: "power2.in",
                        onComplete: () => {
                            price.innerHTML = newPrice;
                        }
                    })
                    // Flip in animation
                    .fromTo(price, {
                        rotationX: 90,
                        y: -20,
                        opacity: 0
                    }, {
                        rotationX: 0,
                        y: 0,
                        opacity: 1,
                        duration: 0.4,
                        ease: "power2.out"
                    });

                // Add scale bounce effect to the pricing card
                gsap.to(price.closest('.pricing-plan'), {
                    scale: 1.02,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
            });
        });
    }

    // Modal functionality
    const modal = document.getElementById('consultation-modal');
    const contactBtns = document.querySelectorAll('.contact-btn');
    const closeBtn = document.querySelector('.close-modal');

    function openModal() {
        document.body.style.overflow = 'hidden';
        modal.classList.add('active');
    }

    function closeModal() {
        document.body.style.overflow = 'auto';
        modal.classList.remove('active');
    }

    // Open modal
    if (contactBtns.length > 0 && modal) {
        contactBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                if (this.getAttribute('href') === '#contact') {
                    e.preventDefault();
                    e.stopPropagation();
                    openModal();
                }
            });
        });
    }

    // Close modal
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside content
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // FAQ Functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Close all other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherQuestion.nextElementSibling.classList.remove('active');
                }
            });

            // Toggle current FAQ item
            question.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('active');
        });
    });

    // Main Contact Form
    const mainContactForm = document.querySelector('#main-contact-form');
    if (mainContactForm) {
        const mainFormSuccess = mainContactForm.querySelector('.form-success');
        const mainSubmitBtn = mainContactForm.querySelector('.submit-btn');

        mainContactForm.addEventListener('submit', async(e) => {
            e.preventDefault();

            if (mainSubmitBtn) {
                mainSubmitBtn.textContent = 'Sending...';
                mainSubmitBtn.disabled = true;
            }

            // Simulate form submission (replace with actual submission logic)
            setTimeout(() => {
                mainContactForm.style.display = 'none';
                if (mainFormSuccess) {
                    mainFormSuccess.classList.remove('hidden');
                }

                if (mainSubmitBtn) {
                    mainSubmitBtn.textContent = 'Send Message';
                    mainSubmitBtn.disabled = false;
                }
            }, 1500);
        });
    }

    const consultationForm = document.querySelector('#consultation-form');
    if (consultationForm) {
        // Get form elements up front
        const formSuccess = document.querySelector('#consultation-form .form-success');
        const sendButton = consultationForm.querySelector("button[type='submit']");

        consultationForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Update button state first
            if (sendButton) { // Add null check
                sendButton.textContent = "Sending...";
                sendButton.disabled = true;
            }

            const formData = new FormData(consultationForm);

            fetch("https://formsubmit.co/ajax/bytecrafts.ca@gmail.com", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData,
                })
                .then((response) => response.json())
                .then((data) => {
                    if (formSuccess) { // Add null check
                        formSuccess.classList.remove("hidden");
                    }

                    setTimeout(() => {
                        sessionStorage.setItem('canAccessReceived', 'true');
                        window.location.href = "/received";
                    }, 600);
                })
                .catch((error) => {
                    console.error("Form submission error:", error);
                    // Reset button state on error
                    if (sendButton) {
                        sendButton.textContent = "Submit";
                        sendButton.disabled = false;
                    }
                });
        });
    }
    // Back to Top Button
    const backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', function() {
        if (backToTopButton) {
            if (window.scrollY > 300) {
                gsap.to(backToTopButton, {
                    opacity: 1,
                    visibility: 'visible',
                    duration: 0.3
                });
            } else {
                gsap.to(backToTopButton, {
                    opacity: 0,
                    visibility: 'hidden',
                    duration: 0.3
                });
            }
        }
    });

    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Button hover animations
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Service card hover animations
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
                duration: 0.3
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                boxShadow: 'var(--shadow)',
                duration: 0.3
            });
        });
    });

    // Text reveal animation for headings
    const splitTextElements = document.querySelectorAll('.section-header h2');
    splitTextElements.forEach(element => {
        // Split text into words
        const text = element.textContent;
        element.textContent = '';
        const words = text.split(' ');
        words.forEach(word => {
            const span = document.createElement('span');
            span.style.display = 'inline-block';
            span.style.overflow = 'hidden';
            const innerSpan = document.createElement('span');
            innerSpan.style.display = 'inline-block';
            innerSpan.textContent = word + ' ';
            span.appendChild(innerSpan);
            element.appendChild(span);

            // Animate each word
            gsap.from(innerSpan, {
                y: '100%',
                duration: 1,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: span,
                    start: 'top 85%',
                    toggleActions: "play none none reverse"
                }
            });
        });
    });
});

function initAnimations() {
    // Add to initAnimations() in app.js
    if (window.innerWidth > 1024 && typeof ScrollTrigger !== 'undefined') {
        const line = document.createElement('div');
        line.className = 'process-line';
        document.querySelector('.process-steps').appendChild(line);

        gsap.set('.process-line', {
            position: 'absolute',
            height: '2px',
            background: 'white',
            top: '50%',
            left: 0,
            width: '0%',
            zIndex: -1
        });

        ScrollTrigger.create({
            trigger: '.process-steps',
            start: 'top center',
            end: 'bottom center',
            onUpdate: (self) => {
                gsap.to('.process-line', {
                    width: `${self.progress * 100}%`,
                    duration: 0.5
                });
            }
        });
    }
    // Check if ScrollTrigger is available

    if (typeof ScrollTrigger !== 'undefined') {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Hero section animations
        gsap.from('.hero-text h1', {
            y: 80,
            opacity: 0,
            duration: 1.2,
            delay: 0.3,
            ease: "power4.out"
        });

        gsap.from('.hero-text p', {
            y: 60,
            opacity: 0,
            duration: 1,
            delay: 0.6,
            ease: "power3.out"
        });

        gsap.from('.hero-btns a', {
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: 0.9,
            stagger: 0.15,
            ease: "back.out(1.2)"
        });

        gsap.from('.hero-image', {
            x: 100,
            opacity: 0,
            duration: 1.2,
            delay: 0.6,
            ease: "power3.out"
        });

        // Add floating animation to hero image
        gsap.to('.hero-image', {
            y: 20,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Section headers animation
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 60,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });

            // Animate children elements with stagger
            gsap.from(header.children, {
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                delay: 0.3,
                ease: "power2.out"
            });
        });

        // Add parallax effect to about image
        gsap.to('.about-image', {
            scrollTrigger: {
                trigger: '.about-hero',
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
            y: 100,
            ease: "none"
        });

        // Service cards animation
        gsap.utils.toArray('.service-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.1,
                ease: "back.out(1.2)"
            });
        });

        // Portfolio items animation
        gsap.utils.toArray('.portfolio-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                y: 50,
                opacity: 0,
                duration: 0.6,
                delay: i * 0.1,
                ease: "power2.out"
            });
        });

        // Process steps animation
        gsap.utils.toArray('.process-step').forEach((step, i) => {
            gsap.from(step, {
                scrollTrigger: {
                    trigger: step,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                x: i % 2 === 0 ? -50 : 50,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.2,
                ease: "power2.out"
            });
        });

        // Horizontal scroll for process section
        let processSection;

        // Only initialize horizontal scroll on desktop
        if (window.innerWidth > 1024) {
            processSection = gsap.timeline({
                scrollTrigger: {
                    trigger: ".process",
                    pin: true,
                    start: "top top",
                    end: "+=100%",
                    scrub: 1,
                    invalidateOnRefresh: true,
                    anticipatePin: 1
                }
            });

            processSection.to(".process-steps", {
                x: function() {
                    const steps = document.querySelector(".process-steps");
                    const container = document.querySelector(".process-container");
                    const stepsCount = document.querySelectorAll('.process-step').length;
                    const stepWidth = steps.offsetWidth / stepsCount;
                    const totalScroll = -(stepWidth * (stepsCount - 1));
                    return Math.max(totalScroll, -window.innerWidth);
                },
                ease: "none"
            });
        }

        // Handle resize events
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 1024) {
                // Kill the scrollTrigger on mobile/tablet
                if (processSection && processSection.scrollTrigger) {
                    processSection.scrollTrigger.kill();
                }
                // Reset any transforms
                gsap.set(".process-steps", { clearProps: "all" });
            }
        });

        // Testimonial cards animation
        gsap.from('.testimonial-card', {
            scrollTrigger: {
                trigger: '.testimonials',
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });

        // About section animation
        gsap.from('.about-text', {
            scrollTrigger: {
                trigger: '.about-hero',
                start: "top 80%",
                toggleActions: "play none none none"
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });

        gsap.from('.about-image', {
            scrollTrigger: {
                trigger: '.about-hero',
                start: "top 80%",
                toggleActions: "play none none none"
            },
            x: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });

        // Pricing cards animation
        gsap.utils.toArray('.pricing-plan').forEach((plan, i) => {
            gsap.from(plan, {
                scrollTrigger: {
                    trigger: plan,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.2,
                ease: "back.out(1.2)"
            });
        });

        // CTA section animation
        gsap.from('.cta', {
            scrollTrigger: {
                trigger: '.cta',
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });

        // Create floating shapes if they don't exist
        if (!document.querySelector('.hero-shapes')) {
            const hero = document.querySelector('.hero');
            if (hero) {
                // Add subtle animation to the new corner shape
                gsap.to('.hero::before', {
                    x: -30,
                    y: 30,
                    duration: 20,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }
        }
    } else {
        console.warn("ScrollTrigger not available. Basic animations will still work.");

        // Basic animations without ScrollTrigger
        gsap.from('.hero-text h1', {
            y: 50,
            opacity: 0,
            duration: 1,
            delay: 0.3,
            ease: "power3.out"
        });

        gsap.from('.hero-text p', {
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 0.6,
            ease: "power3.out"
        });

        gsap.from('.hero-btns', {
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 0.9,
            ease: "power3.out"
        });

        gsap.from('.hero-image', {
            x: 50,
            opacity: 0,
            duration: 1,
            delay: 0.6,
            ease: "power3.out"
        });
    }

    // Text reveal animation for main headings
    const headings = document.querySelectorAll('h1, h2');
    headings.forEach(heading => {
        const originalText = heading.textContent;
        const words = originalText.split(' ');
        heading.innerHTML = '';

        words.forEach((word, i) => {
            const span = document.createElement('span');
            span.textContent = word;
            span.style.display = 'inline-block';

            // Add space after each word except the last one
            if (i < words.length - 1) {
                span.innerHTML += '&nbsp;';
            }

            heading.appendChild(span);

            if (typeof ScrollTrigger !== 'undefined') {
                gsap.from(span, {
                    scrollTrigger: {
                        trigger: heading,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    delay: i * 0.1, // Increased delay between words
                    ease: "back.out(1.2)"
                });
            } else {
                gsap.from(span, {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    delay: i * 0.1 + 0.3, // Increased delay between words
                    ease: "back.out(1.2)"
                });
            }
        });
    });
}

// More advanced version with GSAP
processSteps.forEach(step => {
    const hoverLight = document.createElement('div');
    hoverLight.className = 'hover-light';
    step.appendChild(hoverLight);

    step.addEventListener('mousemove', (e) => {
        const rect = step.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(hoverLight, {
            '--x': `${x}px`,
            '--y': `${y}px`,
            opacity: 1,
            duration: 0.2
        });
    });

    step.addEventListener('mouseleave', () => {
        gsap.to(hoverLight, {
            opacity: 0,
            duration: 0.4
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Lazy load images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // Track outbound links
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && !link.href.includes(window.location.hostname)) {
            gtag('event', 'outbound', {
                'event_category': 'outbound',
                'event_label': link.href,
                'transport_type': 'beacon'
            });
        }
    });

    // Track form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            gtag('event', 'conversion', {
                'send_to': 'AW-123456789/AbC-D_efG-h12',
                'value': 1.0,
                'currency': 'USD',
                'transaction_id': ''
            });
        });
    });
});
// In app.js - optimize JavaScript loading
document.addEventListener('DOMContentLoaded', function() {
    // Load non-critical resources after page load
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadNonCriticalResources);
    } else {
        setTimeout(loadNonCriticalResources, 1000);
    }
});

function loadNonCriticalResources() {
    const resources = [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js'
    ];

    resources.forEach(resource => {
        const el = resource.endsWith('.js') ?
            document.createElement('script') :
            document.createElement('link');
        el.src = el.href = resource;
        if (el.rel !== 'stylesheet') el.async = true;
        document.body.appendChild(el);
    });
}
mobileMenu.addEventListener('click', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !expanded);
    navLinks.setAttribute('aria-hidden', expanded);
});
// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});
// Theme toggle
const themeToggle = document.createElement('div');
themeToggle.innerHTML = `
    <button id="theme-toggle" class="btn btn-sm">
        <i class="fas fa-moon"></i> Dark Mode
    </button>
`;
document.querySelector('nav').appendChild(themeToggle);

document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    this.innerHTML = document.body.classList.contains('dark-theme') ?
        '<i class="fas fa-sun"></i> Light Mode' :
        '<i class="fas fa-moon"></i> Dark Mode';
});

console.log = function() {};

// Add Google Analytics tracking
window.dataLayer = window.dataLayer || [];

function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX'); // Replace with your Google Analytics ID