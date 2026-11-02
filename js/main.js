/* ----------------------------------------------------
   Brazilia Coffee - Core Interactive Logic & Animations
------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // 1. WhatsApp Configuration
    const WHATSAPP_NUMBER = '201147070744'; // Brazilia Coffee official hotline / WhatsApp

    // 2. DOM Elements
    const header = document.getElementById('header');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navbar = document.getElementById('navbar');
    const navCloseBtn = document.getElementById('navCloseBtn');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollProgress = document.getElementById('scrollProgress');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const orderButtons = document.querySelectorAll('.btn-card-order');
    const contactForm = document.getElementById('contactForm');
    const statNumbers = document.querySelectorAll('.stat-number');
    const scrollToTopBtn = document.getElementById('scrollToTop');

    // -----------------------------------------
    // 3. Responsive Mobile Navigation Menu
    // -----------------------------------------
    if (hamburgerMenu && navbar) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            navbar.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Close mobile menu when clicking the close button
    if (navCloseBtn) {
        navCloseBtn.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            navbar.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }

    // Close navbar menu when clicking any nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                hamburgerMenu.classList.remove('active');
                navbar.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // -----------------------------------------
    // 4. Sticky Header on Scroll
    // -----------------------------------------
    const handleScroll = () => {
        // Sticky class toggle
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        // Scroll Progress Bar
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolledPercentage = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = scrolledPercentage + '%';

        // Active Nav Link highlight on Scroll
        let currentSection = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' && currentSection === 'hero') {
                link.classList.add('active');
            } else if (href === '#' + currentSection) {
                link.classList.add('active');
            }
        });

        // Show/Hide Scroll-to-Top Button
        if (scrollToTopBtn) {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', handleScroll);

    // -----------------------------------------
    // 5. Intersection Observer for Animations
    // -----------------------------------------
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // If it's a stats item, start counting
                if (entry.target.classList.contains('stat-item')) {
                    const numberEl = entry.target.querySelector('.stat-number');
                    if (numberEl && !numberEl.classList.contains('counted')) {
                        animateCounter(numberEl);
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements
    const elementsToAnimate = document.querySelectorAll('.fade-in-scroll, .stat-item');
    elementsToAnimate.forEach(el => {
        animationObserver.observe(el);
    });

    // Trigger hero element animation on load
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('active');
        }, 150);
    }

    // -----------------------------------------
    // 6. Stats Count-Up Animation Function
    // -----------------------------------------
    function animateCounter(el) {
        el.classList.add('counted');
        const target = parseInt(el.getAttribute('data-target'), 10);
        let start = 0;
        const duration = 2000; // 2 seconds
        const stepTime = Math.abs(Math.floor(duration / target));
        
        // Adjust step time for very large numbers
        const increment = target > 100 ? Math.ceil(target / 100) : 1;
        const step = duration / (target / increment);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                el.innerText = target.toLocaleString('ar-EG'); // Formatting into Arabic numbers or standard
                // If the user prefers English numbers, we can use:
                el.innerText = target + (target === 100 ? '%' : '+');
                clearInterval(timer);
            } else {
                el.innerText = start + '+';
            }
        }, step);
    }

    // -----------------------------------------
    // 7. Product Catalog Filter
    // -----------------------------------------
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active button class toggle
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Fade grid briefly for smooth transition
            const grid = document.getElementById('productsGrid');
            grid.style.opacity = '0.3';

            setTimeout(() => {
                if (filterValue === 'menu-board') {
                    grid.classList.add('menu-boards-active');
                } else {
                    grid.classList.remove('menu-boards-active');
                }

                const filterItems = document.querySelectorAll('.product-card, .category-divider-card');
                filterItems.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterValue === 'all') {
                        // In 'all', display all coffee products & category headers, hide menu board panels
                        if (cardCategory === 'menu-board') {
                            card.classList.add('hide');
                        } else {
                            card.classList.remove('hide');
                        }
                    } else if (cardCategory === filterValue) {
                        card.classList.remove('hide');
                    } else {
                        card.classList.add('hide');
                    }
                });
                grid.style.opacity = '1';
            }, 300);
        });
    });

    // -----------------------------------------
    // 8. Order via WhatsApp Implementation
    // -----------------------------------------
    orderButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productName = btn.getAttribute('data-product');
            const message = `مرحباً برازيليا كوفي (Brazilia Coffee)، أود طلب المنتج التالي من موقعكم:\n*${productName}*\nيرجى تزويدي بالتفاصيل وطرق الاستلام والتوصيل.`;
            const encodedMessage = encodeURIComponent(message);
            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
            
            // Open WhatsApp link
            window.open(waUrl, '_blank');
        });
    });

    // -----------------------------------------
    // 9. Contact Form via WhatsApp Implementation
    // -----------------------------------------
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('formName').value.trim();
            const phone = document.getElementById('formPhone').value.trim();
            const messageText = document.getElementById('formMsg').value.trim();

            const templateMsg = `مرحباً برازيليا كوفي (Brazilia Coffee)،\nلقد أرسلت رسالة عبر استمارة التواصل في موقعكم:\n\n👤 *الاسم:* ${name}\n📞 *رقم الهاتف:* ${phone}\n💬 *الرسالة:* ${messageText}`;
            const encodedTemplate = encodeURIComponent(templateMsg);
            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedTemplate}`;

            // Reset form
            contactForm.reset();

            // Open WhatsApp link
            window.open(waUrl, '_blank');
        });
    }

    // 10. Scroll To Top Smooth Animation
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // -----------------------------------------
    // 11. Menu Lightbox Modals (Beans & Drinks)
    // -----------------------------------------
    const setupModal = (modalId, triggerIds, closeId) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        const closeBtn = document.getElementById(closeId);
        const dialog = modal.querySelector('.menu-modal-dialog');

        const open = () => {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const close = () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        triggerIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', open);
        });

        if (closeBtn) closeBtn.addEventListener('click', close);

        // Clicking on the dialog or image must NOT close the modal
        if (dialog) {
            dialog.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Clicking the backdrop closes the modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                close();
            }
        });
    };

    setupModal('menuModal', ['openMenuModal', 'btnViewMenuModal'], 'closeMenuModal');
    setupModal('drinksModal', ['openDrinksModal', 'btnViewDrinksModal'], 'closeDrinksModal');
});
