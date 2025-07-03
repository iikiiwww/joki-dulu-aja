// Global variables
let servicesData = [];
let skinsData = [];
let eventsData = [];
let trendingData = [];
let filteredSkins = [];
let currentCategory = 'Semua';

// DOM elements
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const loading = document.getElementById('loading');
const toast = document.getElementById('toast');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

async function initializeWebsite() {
    showLoading();
    
    try {
        await loadData();
        setupEventListeners();
        renderServices();
        renderSkins();
        renderEvents();
        renderTrending();
        renderCategories();
        updateActiveNavLink();
        
        // Hide loading after everything is loaded
        setTimeout(hideLoading, 500);
    } catch (error) {
        console.error('Error initializing website:', error);
        showToast('Terjadi kesalahan saat memuat data', 'error');
        hideLoading();
    }
}

// Load data from JSON
async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        servicesData = data.services;
        skinsData = data.skins;
        eventsData = data.events;
        trendingData = data.trending;
        filteredSkins = [...skinsData];
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback data if JSON fails to load
        loadFallbackData();
    }
}

function loadFallbackData() {
    servicesData = [
        {
            id: 'joki-rank',
            icon: 'fas fa-trophy',
            title: 'Joki Rank',
            description: 'Naik rank dengan cepat dan aman dari Warrior hingga Mythical Glory',
            price: 'Mulai dari Rp 10.000',
            gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
        },
        {
            id: 'top-up',
            icon: 'fas fa-gem',
            title: 'Top Up Diamond',
            description: 'Top up diamond dengan harga terjangkau dan proses instan',
            price: 'Mulai dari Rp 15.000',
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
        },
        {
            id: 'joki-classic',
            icon: 'fas fa-medal',
            title: 'Joki Classic',
            description: 'Menyelesaikan misi dan achievement dengan profesional',
            price: 'Mulai dari Rp 5.000',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        }
    ];

    skinsData = [
        {
            id: 'yin-starlight',
            name: 'Yin',
            title: 'Moonlight Sentinel',
            type: 'Starlight Skin',
            category: 'Starlight',
            rarity: 'starlight',
            image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400',
            description: 'Skin eksklusif dari event Starlight bulan ini dengan efek visual yang menakjubkan.'
        },
        {
            id: 'balmond-collector',
            name: 'Balmond',
            title: 'Savage Guardian',
            type: 'Collector Skin',
            category: 'Collector',
            rarity: 'collector',
            image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
            description: 'Skin collector dengan desain yang memukau dan efek khusus yang unik.'
        },
        {
            id: 'chou-kof',
            name: 'Chou',
            title: 'Dragon Fighter',
            type: 'KOF Collaboration',
            category: 'Epic',
            rarity: 'epic',
            image: 'https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&w=400',
            description: 'Kolaborasi eksklusif dengan King of Fighters dengan animasi fighting yang spektakuler.'
        },
        {
            id: 'leomord-epic',
            name: 'Leomord',
            title: 'Lava Soul',
            type: 'Epic Skin',
            category: 'Epic',
            rarity: 'special',
            image: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400',
            description: 'Skin epic dengan tema lava yang memberikan efek visual memukau di battlefield.'
        },
        {
            id: 'martis-anime',
            name: 'Martis',
            title: 'Attack on Titan',
            type: 'Anime Skin',
            category: 'Anime',
            rarity: 'anime',
            image: 'https://images.pexels.com/photos/157675/fashion-men-s-individuality-black-and-white-157675.jpeg?auto=compress&cs=tinysrgb&w=400',
            description: 'Kolaborasi dengan Attack on Titan membawa Martis dalam balutan Survey Corps.'
        },
        {
            id: 'hayabusa-anime',
            name: 'Hayabusa',
            title: 'Naruto Collaboration',
            type: 'Anime Skin',
            category: 'Anime',
            rarity: 'anime',
            image: 'https://images.pexels.com/photos/247676/pexels-photo-247676.jpeg?auto=compress&cs=tinysrgb&w=400',
            description: 'Transformasi ninja legend dengan teknik dan gaya bertarung ala Sasuke Uchiha.'
        }
    ];

    eventsData = [
        {
            id: 'starlight-june',
            title: 'Starlight Perks Juni 2025',
            description: 'Dapatkan skin eksklusif dan berbagai reward menarik di event Starlight bulan ini!',
            image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400',
            date: '1-30 Juni 2025',
            type: 'Starlight',
            status: 'Active'
        },
        {
            id: 'elegy-event',
            title: 'An Elegy of Spears and Flowers',
            description: 'Event spesial dengan tema oriental yang menghadirkan skin dan item eksklusif terbaru.',
            image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
            date: '15-30 Juni 2025',
            type: 'Special',
            status: 'Coming Soon'
        }
    ];

    trendingData = [
        { name: 'Starlight Juni 2025', badge: 'Hot', color: 'red' },
        { name: 'Hayabusa Anime Skin', badge: 'New', color: 'green' },
        { name: 'Martis AoT Skin', badge: 'Popular', color: 'blue' },
        { name: 'Leomord Lava Soul', badge: 'Limited', color: 'purple' }
    ];

    filteredSkins = [...skinsData];
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    const navLinksElements = document.querySelectorAll('.nav-link');
    navLinksElements.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Mobile menu
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Scroll events
    window.addEventListener('scroll', handleScroll);

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

    // Modal close
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('skinModal');
        if (e.target === modal) {
            closeSkinModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSkinModal();
        }
    });
}

// Navigation handlers
function handleNavClick(e) {
    e.preventDefault();
    const targetSection = e.target.getAttribute('data-section');
    if (targetSection) {
        scrollToSection(targetSection);
        updateActiveNavLink(targetSection);
        
        // Close mobile menu if open
        navLinks.classList.remove('show');
        mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
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
            if (link.getAttribute('data-section') === activeSection) {
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
                if (link.getAttribute('data-section') === sections[i]) {
                    link.classList.add('active');
                }
            });
            break;
        }
    }
}

function toggleMobileMenu() {
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
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update active navigation
    updateActiveNavLink();

    // Animate elements on scroll
    animateOnScroll();
}

// Render functions
function renderServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    if (!servicesGrid) return;

    servicesGrid.innerHTML = servicesData.map(service => `
        <div class="service-card fade-in">
            <div class="service-icon" style="background: ${service.gradient}">
                <i class="${service.icon}"></i>
            </div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <div class="service-price">${service.price}</div>
        </div>
    `).join('');
}

function renderSkins() {
    const skinsGrid = document.getElementById('skinsGrid');
    const skinsCount = document.getElementById('skinsCount');
    
    if (!skinsGrid) return;

    skinsGrid.innerHTML = filteredSkins.map(skin => `
        <div class="skin-card fade-in" data-skin-id="${skin.id}">
            <div class="skin-image">
                <img src="${skin.image}" alt="${skin.name} ${skin.type}" loading="lazy">
                <div class="skin-overlay">
                    <button class="view-detail-btn" onclick="openSkinModal('${skin.id}')">
                        <i class="fas fa-eye"></i> Lihat Detail
                    </button>
                </div>
            </div>
            <div class="skin-info">
                <h4>${skin.name}</h4>
                <p class="skin-type">${skin.type}</p>
                <div class="skin-rarity ${skin.rarity}">${skin.category}</div>
            </div>
        </div>
    `).join('');

    if (skinsCount) {
        skinsCount.textContent = `${filteredSkins.length} Skin Ditemukan`;
    }
}

function renderEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    if (!eventsGrid) return;

    eventsGrid.innerHTML = eventsData.map(event => `
        <div class="event-card fade-in">
            <div class="event-image">
                <img src="${event.image}" alt="${event.title}" loading="lazy">
                <div class="event-badge ${event.status.toLowerCase().replace(' ', '-')}">${event.status}</div>
            </div>
            <div class="event-content">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <div class="event-meta">
                    <span class="event-date">
                        <i class="fas fa-calendar"></i> ${event.date}
                    </span>
                    <span class="event-type">${event.type}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderTrending() {
    const trendingList = document.getElementById('trendingList');
    if (!trendingList) return;

    const badgeColors = {
        red: '#fee2e2',
        green: '#dcfce7',
        blue: '#dbeafe',
        purple: '#f3e8ff'
    };

    const textColors = {
        red: '#dc2626',
        green: '#16a34a',
        blue: '#2563eb',
        purple: '#7c3aed'
    };

    trendingList.innerHTML = trendingData.map(item => `
        <li>
            <div class="trending-item">
                <span class="trending-name">${item.name}</span>
                <span class="trending-badge" style="background: ${badgeColors[item.color]}; color: ${textColors[item.color]}">${item.badge}</span>
            </div>
        </li>
    `).join('');
}

function renderCategories() {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;

    const categories = ['Semua', ...new Set(skinsData.map(skin => skin.category))];
    const categoryCounts = categories.map(category => ({
        name: category,
        count: category === 'Semua' ? skinsData.length : skinsData.filter(skin => skin.category === category).length
    }));

    categoryList.innerHTML = categoryCounts.map(category => `
        <li>
            <a href="#" class="category-link ${category.name === currentCategory ? 'active' : ''}" 
               onclick="filterByCategory('${category.name}')">
                ${category.name}
                <span class="count">${category.count}</span>
            </a>
        </li>
    `).join('');
}

// Filter and search functions
function searchSkins() {
    const searchInput = document.getElementById('skinSearch');
    const query = searchInput.value.toLowerCase().trim();

    filteredSkins = skinsData.filter(skin => {
        const matchesSearch = !query || 
            skin.name.toLowerCase().includes(query) || 
            skin.type.toLowerCase().includes(query) ||
            skin.description.toLowerCase().includes(query);
        
        const matchesCategory = currentCategory === 'Semua' || skin.category === currentCategory;
        
        return matchesSearch && matchesCategory;
    });

    renderSkins();
}

function filterByCategory(category) {
    currentCategory = category;
    
    // Update active category
    document.querySelectorAll('.category-link').forEach(link => {
        link.classList.remove('active');
        if (link.textContent.trim().startsWith(category)) {
            link.classList.add('active');
        }
    });

    searchSkins(); // This will apply both search and category filters
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

// Modal functions
function openSkinModal(skinId) {
    const skin = skinsData.find(s => s.id === skinId);
    if (!skin) return;

    const modal = document.getElementById('skinModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div class="skin-detail">
            <div class="skin-detail-image">
                <img src="${skin.image}" alt="${skin.name} ${skin.type}">
            </div>
            <div class="skin-detail-content">
                <h2>${skin.name}</h2>
                <h3>${skin.title}</h3>
                <p class="skin-detail-type">${skin.type}</p>
                <div class="skin-rarity ${skin.rarity}">${skin.category}</div>
                <p class="skin-detail-description">${skin.description}</p>
                
                <div class="skin-actions">
                    <button class="btn-primary" onclick="contactForSkin('${skin.name}')">
                        <i class="fas fa-shopping-cart"></i> Pesan Sekarang
                    </button>
                    <button class="btn-secondary" onclick="shareSkin('${skin.name}')">
                        <i class="fas fa-share"></i> Share
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeSkinModal() {
    const modal = document.getElementById('skinModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function contactForSkin(skinName) {
    scrollToSection('contact');
    closeSkinModal();
    
    // Pre-fill form
    setTimeout(() => {
        const serviceSelect = document.getElementById('serviceType');
        const messageTextarea = document.getElementById('message');
        
        if (serviceSelect) {
            serviceSelect.value = 'joki-rank';
        }
        
        if (messageTextarea) {
            messageTextarea.value = `Halo, saya tertarik dengan skin ${skinName}. Mohon informasi lebih lanjut.`;
        }
        
        showToast(`Form telah diisi untuk ${skinName}`, 'success');
    }, 1000);
}

function shareSkin(skinName) {
    if (navigator.share) {
        navigator.share({
            title: `${skinName} - Joki MLBB`,
            text: `Check out this amazing skin: ${skinName}`,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showToast('Link berhasil disalin!', 'success');
        });
    }
}

// Form handling
function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
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
    if (!name.value.trim()) {
        showFieldError('nameError', 'Nama lengkap harus diisi');
        isValid = false;
    }
    
    // Validate email
    const email = form.querySelector('#email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showFieldError('emailError', 'Email harus diisi');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        showFieldError('emailError', 'Format email tidak valid');
        isValid = false;
    }
    
    // Validate service
    const service = form.querySelector('#serviceType');
    if (!service.value) {
        showFieldError('serviceError', 'Pilih jenis layanan');
        isValid = false;
    }
    
    // Validate message
    const message = form.querySelector('#message');
    if (!message.value.trim()) {
        showFieldError('messageError', 'Pesan harus diisi');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showFieldError('messageError', 'Pesan minimal 10 karakter');
        isValid = false;
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
function showLoading() {
    loading.classList.add('show');
}

function hideLoading() {
    loading.classList.remove('show');
}

function showToast(message, type = 'success') {
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

// Call initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAnimations);
