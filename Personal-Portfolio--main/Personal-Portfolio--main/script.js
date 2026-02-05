// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isExpanded = navMenu.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

// Header scroll effect
const header = document.querySelector('.header-bar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
});

// Theme Management
const themeSelector = document.querySelector('.theme-selector');
const themeToggle = document.querySelector('.theme-toggle');
const themeDropdown = document.querySelector('.theme-dropdown');
const themeOptions = document.querySelectorAll('.theme-option');

console.log('Theme elements found:', {
    themeSelector: !!themeSelector,
    themeToggle: !!themeToggle,
    themeDropdown: !!themeDropdown,
    themeOptions: themeOptions.length
});

// Load saved theme or default to dark-purple
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark-purple';
document.documentElement.setAttribute('data-theme', savedTheme);
console.log('Applied theme:', savedTheme);

// Update theme toggle text
function updateThemeToggleText(theme) {
    const themeNames = {
        'dark-purple': 'Dark Purple',
        'light': 'Light Blue',
        'ocean': 'Ocean Blue',
        'forest': 'Forest Green',
        'sunset': 'Sunset Orange'
    };
    if (themeToggle) {
        themeToggle.textContent = themeNames[theme] || 'Dark Purple';
    }
}

updateThemeToggleText(savedTheme);

// Toggle dropdown
if (themeToggle && themeDropdown) {
    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        themeDropdown.classList.toggle('show');
        console.log('Theme dropdown toggled:', themeDropdown.classList.contains('show'));
    });
}

// Handle theme selection - moved to auto cycling section

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    if (themeDropdown) {
        themeDropdown.classList.remove('show');
    }
});

// Prevent dropdown from closing when clicking inside
if (themeDropdown) {
    themeDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Auto Theme Cycling Functionality
const autoCycleToggle = document.getElementById('autoCycleToggle');
const themes = ['dark-purple', 'light', 'ocean', 'forest', 'sunset'];
let currentThemeIndex = themes.indexOf(savedTheme) !== -1 ? themes.indexOf(savedTheme) : 0;
let autoCycleInterval = null;
let isAutoCycling = true;

// Function to apply theme with smooth transition
function applyThemeWithTransition(theme) {
    document.documentElement.style.transition = 'all 0.8s ease-in-out';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggleText(theme);
    localStorage.setItem('portfolio-theme', theme);
    
    // Remove transition after animation completes
    setTimeout(() => {
        document.documentElement.style.transition = '';
    }, 800);
}

// Function to cycle to next theme
function cycleToNextTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const nextTheme = themes[currentThemeIndex];
    applyThemeWithTransition(nextTheme);
}

// Function to start auto cycling
function startAutoCycle() {
    if (autoCycleInterval) clearInterval(autoCycleInterval);
    autoCycleInterval = setInterval(cycleToNextTheme, 10000); // 10 seconds
    isAutoCycling = true;
    autoCycleToggle.classList.add('active');
    autoCycleToggle.innerHTML = '<span class="emoji">⏸️</span> Pause';
}

// Function to stop auto cycling
function stopAutoCycle() {
    if (autoCycleInterval) {
        clearInterval(autoCycleInterval);
        autoCycleInterval = null;
    }
    isAutoCycling = false;
    autoCycleToggle.classList.remove('active');
    autoCycleToggle.innerHTML = '<span class="emoji">▶️</span> Start';
}

// Toggle auto cycling on button click
if (autoCycleToggle) {
    autoCycleToggle.addEventListener('click', () => {
        if (isAutoCycling) {
            stopAutoCycle();
        } else {
            startAutoCycle();
        }
    });
}

// Start auto cycling by default
startAutoCycle();

// Update theme selection to sync with auto cycling
themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        const selectedTheme = option.getAttribute('data-theme');
        currentThemeIndex = themes.indexOf(selectedTheme);
        applyThemeWithTransition(selectedTheme);
        if (themeDropdown) {
            themeDropdown.classList.remove('show');
        }
        // Restart auto cycling if it was active
        if (isAutoCycling) {
            startAutoCycle();
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for section highlighting
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-menu a');

const observerOptions = {
    rootMargin: '-100px 0px -50% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${id}`) {
                    item.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});
