// Global variables
let currentImageIndex = 0;
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const toast = document.getElementById('toast');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    setupEventListeners();
    updateActiveNavLink();
    initializeAnimations();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    const navLinksElements = document.querySelectorAll('.nav-link');
    navLinksElements.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Scroll events
    window.addEventListener('scroll', handleScroll);

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // View toggle
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            toggleSkinsView(this.dataset.view);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('skinSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchSkins, 300));
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchSkins();
            }
        });
    }

    // Category links
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            filterByCategory(this.textContent.trim().split(' ')[0]);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals or menus
            if (navLinks && navLinks.classList.contains('show')) {
                toggleMobileMenu();
            }
        }
    });
}

// Navigation handlers
function handleNavClick(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    
    if (href.startsWith('#')) {
        // Internal link - scroll to section
        const targetSection = href.substring(1);
        scrollToSection(targetSection);
        updateActiveNavLink(targetSection);
    } else if (href.includes('#')) {
        // External link with hash - navigate to page and section
        window.location.href = href;
    } else {
        // Regular link - navigate to page
        window.location.href = href;
    }
    
    // Close mobile menu if open
    if (navLinks && navLinks.classList.contains('show')) {
        toggleMobileMenu();
    }
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offset = 80; // Account for fixed navbar
        const elementPosition = element.offsetTop - offset;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

function updateActiveNavLink(activeSection = null) {
    const navLinksElements = document.querySelectorAll('.nav-link');
    
    if (activeSection) {
        navLinksElements.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${activeSection}` || href.includes(`#${activeSection}`)) {
                link.classList.add('active');
            }
        });
        return;
    }

    // Auto-detect active section based on scroll position
    const sections = ['home', 'services', 'skins', 'events', 'contact'];
    const scrollPosition = window.scrollY + 100;

    for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
            navLinksElements.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${sections[i]}` || href.includes(`#${sections[i]}`)) {
                    link.classList.add('active');
                }
            });
            break;
        }
    }
}

function toggleMobileMenu() {
    if (!navLinks || !mobileMenuBtn) return;
    
    navLinks.classList.toggle('show');
    const icon = mobileMenuBtn.querySelector('i');
    
    if (navLinks.classList.contains('show')) {
        icon.classList.replace('fa-bars', 'fa-times');
    } else {
        icon.classList.replace('fa-times', 'fa-bars');
    }
}

function handleScroll() {
    // Navbar background
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Update active navigation
    updateActiveNavLink();

    // Animate elements on scroll
    animateOnScroll();
}

// Skin detail page functions
function changeImage(thumbnail) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage && thumbnail) {
        mainImage.src = thumbnail.src.replace('w=200', 'w=800');
        
        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
        });
        thumbnail.classList.add('active');
    }
}

function zoomImage() {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        // Create a modal to show zoomed image
        const modal = document.createElement('div');
        modal.className = 'image-zoom-modal';
        modal.innerHTML = `
            <div class="zoom-overlay" onclick="this.parentElement.remove()">
                <img src="${mainImage.src}" alt="Zoomed Image" class="zoomed-image">
                <button class="close-zoom" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Remove modal when clicking outside or pressing escape
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.classList.contains('zoom-overlay')) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
        });
    }
}

function orderSkin(skinName) {
    // Redirect to contact section with pre-filled form
    if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
        scrollToSection('contact');
        setTimeout(() => {
            prefillContactForm(skinName);
        }, 1000);
    } else {
        window.location.href = `index.html#contact?skin=${encodeURIComponent(skinName)}`;
    }
}

function shareSkin() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: document.querySelector('meta[name="description"]').content,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Link berhasil disalin!', 'success');
        });
    }
}

function addToWishlist() {
    const skinName = document.querySelector('.skin-header h1').textContent + ' ' + 
                    document.querySelector('.skin-header h2').textContent;
    
    // Get existing wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('mlbb-wishlist') || '[]');
    
    // Check if already in wishlist
    if (wishlist.includes(skinName)) {
        showToast('Skin sudah ada di wishlist!', 'error');
        return;
    }
    
    // Add to wishlist
    wishlist.push(skinName);
    localStorage.setItem('mlbb-wishlist', JSON.stringify(wishlist));
    
    showToast('Skin berhasil ditambahkan ke wishlist!', 'success');
}

function prefillContactForm(skinName) {
    const serviceSelect = document.getElementById('serviceType');
    const messageTextarea = document.getElementById('message');
    
    if (serviceSelect) {
        serviceSelect.value = 'joki-rank';
    }
    
    if (messageTextarea) {
        messageTextarea.value = `Halo, saya tertarik dengan skin ${skinName}. Mohon informasi lebih lanjut.`;
    }
    
    showToast(`Form telah diisi untuk ${skinName}`, 'success');
}

// Search and filter functions
function searchSkins() {
    const searchInput = document.getElementById('skinSearch');
    const skinCards = document.querySelectorAll('.skin-card');
    
    if (!searchInput || !skinCards.length) return;
    
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;
    
    skinCards.forEach(card => {
        const skinName = card.querySelector('h4').textContent.toLowerCase();
        const skinType = card.querySelector('.skin-type').textContent.toLowerCase();
        
        if (!query || skinName.includes(query) || skinType.includes(query)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update count
    const countElement = document.querySelector('.skins-header h3');
    if (countElement) {
        countElement.textContent = `${visibleCount} Skin Ditemukan`;
    }
}

function filterByCategory(category) {
    const skinCards = document.querySelectorAll('.skin-card');
    const categoryLinks = document.querySelectorAll('.category-link');
    
    // Update active category
    categoryLinks.forEach(link => {
        link.classList.remove('active');
        if (link.textContent.trim().startsWith(category)) {
            link.classList.add('active');
        }
    });
    
    let visibleCount = 0;
    
    skinCards.forEach(card => {
        const skinRarity = card.querySelector('.skin-rarity');
        const skinCategory = skinRarity ? skinRarity.textContent.trim() : '';
        
        if (category === 'Semua' || skinCategory === category) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update count
    const countElement = document.querySelector('.skins-header h3');
    if (countElement) {
        countElement.textContent = `${visibleCount} Skin Ditemukan`;
    }
}

function toggleSkinsView(view) {
    const skinsGrid = document.getElementById('skinsGrid');
    if (!skinsGrid) return;

    if (view === 'list') {
        skinsGrid.style.gridTemplateColumns = '1fr';
        skinsGrid.querySelectorAll('.skin-card').forEach(card => {
            card.style.display = 'flex';
            card.style.flexDirection = 'row';
            card.style.alignItems = 'center';
        });
    } else {
        skinsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
        skinsGrid.querySelectorAll('.skin-card').forEach(card => {
            card.style.display = 'block';
            card.style.flexDirection = 'column';
        });
    }
}

// Form handling
function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    
    // Validate form
    if (!validateContactForm(form)) {
        return;
    }
    
    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showToast('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.', 'success');
        form.reset();
        clearFormErrors();
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function validateContactForm(form) {
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate name
    const name = form.querySelector('#fullName');
    if (name && !name.value.trim()) {
        showFieldError('nameError', 'Nama lengkap harus diisi');
        isValid = false;
    }
    
    // Validate email
    const email = form.querySelector('#email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email) {
        if (!email.value.trim()) {
            showFieldError('emailError', 'Email harus diisi');
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            showFieldError('emailError', 'Format email tidak valid');
            isValid = false;
        }
    }
    
    // Validate service
    const service = form.querySelector('#serviceType');
    if (service && !service.value) {
        showFieldError('serviceError', 'Pilih jenis layanan');
        isValid = false;
    }
    
    // Validate message
    const message = form.querySelector('#message');
    if (message) {
        if (!message.value.trim()) {
            showFieldError('messageError', 'Pesan harus diisi');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showFieldError('messageError', 'Pesan minimal 10 karakter');
            isValid = false;
        }
    }
    
    return isValid;
}

function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.remove('show');
    });
}

// Utility functions
function showToast(message, type = 'success') {
    if (!toast) return;
    
    toast.className = `toast ${type}`;
    toast.querySelector('.toast-message').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) translateX(0)';
        }
    });
}

// Initialize animations
function initializeAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const slideLeftElements = document.querySelectorAll('.slide-in-left');
    const slideRightElements = document.querySelectorAll('.slide-in-right');
    
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    slideLeftElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    slideRightElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

// Check for URL parameters on page load
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const skinParam = urlParams.get('skin');
    
    if (skinParam) {
        // Scroll to contact section and prefill form
        setTimeout(() => {
            scrollToSection('contact');
            setTimeout(() => {
                prefillContactForm(skinParam);
            }, 1000);
        }, 500);
    }
});

// Fungsi mainkan suara
function mainkanKlik() {
    const klikSound = document.getElementById("klikSound");
    klikSound.currentTime = 0;
    klikSound.play();
}

// Deteksi klik ke semua elemen tombol/link
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        // Boleh dibatasi ke elemen tertentu saja
        if (e.target.tagName === "BUTTON" || e.target.tagName === "A") {
            mainkanKlik();
        }
    });
});
