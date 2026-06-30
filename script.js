// Form handling via AJAX
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;

    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(form);

    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            alert('Thank you! Your request has been sent.');
            form.reset();
        })
        .catch(error => {
            alert('Oops! There was a problem submitting your form.');
        })
        .finally(() => {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        });
});

// Google Maps Places API Reviews
function initReviews() {
    const map = new google.maps.Map(document.getElementById('hidden-map'), {
        center: { lat: 0, lng: 0 },
        zoom: 1
    });

    const service = new google.maps.places.PlacesService(map);
    const placeId = 'ChIJ27lfF2ld5IkRy7vZ6OJp0u0';

    service.getDetails({
        placeId: placeId,
        fields: ['reviews']
    }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK && place.reviews) {
            const container = document.getElementById('reviews-container');
            container.innerHTML = ''; // Clear the container

            // Filter for reviews with 4 or more stars and limit to 3
            const highReviews = place.reviews.filter(review => review.rating >= 4).slice(0, 3);

            highReviews.forEach((review, index) => {
                const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

                const card = document.createElement('div');
                const delayMs = (index + 2) * 100; // start at 200ms
                card.className = `glass p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full scroll-animate [animation-delay:${delayMs}ms]`;

                card.innerHTML = `
                    <div class="flex items-center mb-6">
                        <img src="${review.profile_photo_url}" alt="${review.author_name}" class="w-12 h-12 rounded-full mr-4 object-cover shadow-sm">
                        <div>
                            <p class="font-semibold text-primary">${review.author_name}</p>
                            <div class="text-accent text-sm tracking-widest">${stars}</div>
                        </div>
                    </div>
                    <p class="text-gray-700 italic mb-6 flex-grow">"${review.text}"</p>
                    <p class="text-xs text-gray-500 font-medium">${review.relative_time_description}</p>
                `;

                container.appendChild(card);
                if (window.scrollObserver) {
                    card.classList.add('opacity-0');
                    window.scrollObserver.observe(card);
                }
            });
        }
    });
}

// Mobile Sticky CTA Logic
document.addEventListener('DOMContentLoaded', () => {
    const stickyCta = document.getElementById('mobile-sticky-cta');
    const heroBtn = document.querySelector('#hero a[href="#contact"]');
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');

    if (stickyCta && heroBtn && submitBtn) {
        window.addEventListener('scroll', () => {
            // Only apply on mobile devices (sm breakpoint is 640px in Tailwind)
            if (window.innerWidth >= 640) return;

            const heroBtnBottom = heroBtn.getBoundingClientRect().bottom;
            const submitBtnTop = submitBtn.getBoundingClientRect().top;

            // Show if hero button is above viewport (not visible) AND submit button is below viewport (not visible)
            if (heroBtnBottom < 0 && submitBtnTop > window.innerHeight) {
                stickyCta.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
            } else {
                stickyCta.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
            }
        });
    }
});

// Navbar scroll effect
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const heroSection = document.getElementById('hero');
    const navLinks = document.querySelectorAll('.nav-link');
    const navPill = document.getElementById('nav-pill');

    if (navbar && heroSection) {
        window.addEventListener('scroll', () => {
            const heroBottom = heroSection.getBoundingClientRect().bottom;
            if (heroBottom <= 130) {
                // Navbar background
                navbar.classList.add('bg-white', 'shadow-md');
                navbar.classList.remove('bg-transparent');

                // Nav pill background (remove pill style so it blends in)
                if (navPill) {
                    navPill.classList.add('bg-transparent');
                    navPill.classList.remove('bg-blue-100/40', 'backdrop-blur-lg', 'shadow-md');
                }

            } else {
                // Navbar background
                navbar.classList.add('bg-transparent');
                navbar.classList.remove('bg-white', 'shadow-md');

                // Nav pill background (restore pill style)
                if (navPill) {
                    navPill.classList.add('bg-blue-100/40', 'backdrop-blur-lg', 'shadow-md');
                    navPill.classList.remove('bg-transparent');
                }
            }
        });
    }
});



// Scroll Animations
window.scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const animationClass = entry.target.dataset.animation || 'animate-fade-in-up';
            entry.target.classList.add(animationClass);
            entry.target.classList.remove('opacity-0');
            window.scrollObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.scroll-animate').forEach(el => {
        el.classList.add('opacity-0');
        window.scrollObserver.observe(el);
    });

    // Custom Select Dropdown Logic
    const customSelects = document.querySelectorAll('.custom-select-container');

    customSelects.forEach(container => {
        const button = container.querySelector('button');
        const display = container.querySelector('.select-display');
        const input = container.querySelector('input');
        const dropdown = container.querySelector('.dropdown-list');
        const icon = container.querySelector('.dropdown-icon');
        const options = container.querySelectorAll('li');

        button.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = !dropdown.classList.contains('invisible');

            if (isOpen) {
                closeDropdown();
            } else {
                dropdown.classList.remove('opacity-0', 'invisible', '-translate-y-2');
                icon.style.transform = 'rotate(180deg)';
            }
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                input.value = value;
                display.textContent = value;
                display.classList.remove('text-gray-400');
                display.classList.add('text-white');
                closeDropdown();
            });
        });

        function closeDropdown() {
            dropdown.classList.add('opacity-0', 'invisible', '-translate-y-2');
            icon.style.transform = 'rotate(0deg)';
        }

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                closeDropdown();
            }
        });
    });
});

// Video Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const videoTriggers = document.querySelectorAll('.video-trigger');
    const videoModal = document.getElementById('videoModal');
    const videoModalOverlay = document.getElementById('videoModalOverlay');
    const closeVideoModal = document.getElementById('closeVideoModal');
    const videoContainer = document.getElementById('videoContainer');

    if (!videoModal || !videoContainer) return;

    // Preload videos in the background
    const preloadedVideos = {};

    videoTriggers.forEach(trigger => {
        const src = trigger.getAttribute('data-video-src');
        if (src && !preloadedVideos[src]) {
            const video = document.createElement('video');
            video.src = src;
            video.preload = 'auto'; // Load in background
            video.className = 'w-full max-h-[80vh] rounded-xl outline-none hidden';
            video.controls = true;
            preloadedVideos[src] = video;
        }
    });

    function openModal(src) {
        const video = preloadedVideos[src];
        if (video) {
            video.classList.remove('hidden');
            videoContainer.appendChild(video);
            video.play().catch(e => console.log('Autoplay prevented:', e));
        } else {
            videoContainer.innerHTML = `
                <video controls autoplay class="w-full max-h-[80vh] rounded-xl outline-none">
                    <source src="${src}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
        }

        videoModal.classList.remove('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }

    function closeModal() {
        videoModal.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';

        const video = videoContainer.querySelector('video');
        if (video) {
            video.pause();
        }

        setTimeout(() => {
            if (video && video.parentNode === videoContainer) {
                // If it's a preloaded video, just remove it from DOM but don't destroy it
                videoContainer.removeChild(video);
                video.classList.add('hidden');
            } else if (video) {
                // Fallback for non-preloaded innerHTML approach
                videoContainer.innerHTML = '';
            }
        }, 300); // wait for fade out transition
    }

    videoTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const src = trigger.getAttribute('data-video-src');
            if (src) openModal(src);
        });
    });

    closeVideoModal.addEventListener('click', closeModal);
    videoModalOverlay.addEventListener('click', closeModal);
});

// Testimonials Slider Logic
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('testimonials-slider');
    const group1 = document.getElementById('testimonials-group-1');
    if (!slider || !group1) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let animationId;
    const speed = 0.5; // Scroll speed

    function play() {
        if (!isDown) {
            slider.scrollLeft += speed;
            
            // Seamless loop: if scrolled past group1, reset
            if (slider.scrollLeft >= group1.offsetWidth) {
                slider.scrollLeft -= group1.offsetWidth;
            } else if (slider.scrollLeft <= 0 && speed < 0) {
                slider.scrollLeft += group1.offsetWidth;
            }
        }
        animationId = requestAnimationFrame(play);
    }

    // Start auto-scroll
    animationId = requestAnimationFrame(play);

    // Mouse events for dragging
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('cursor-grabbing');
        slider.classList.remove('cursor-grab');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        if(isDown) {
            isDown = false;
            slider.classList.remove('cursor-grabbing');
            slider.classList.add('cursor-grab');
        }
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('cursor-grabbing');
        slider.classList.add('cursor-grab');
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        slider.scrollLeft = scrollLeft - walk;
    });
    
    // Touch events for mobile dragging
    slider.addEventListener('touchstart', () => {
        isDown = true;
    }, {passive: true});
    
    slider.addEventListener('touchend', () => {
        isDown = false;
    });

    // Prevent native image dragging
    slider.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });
});
