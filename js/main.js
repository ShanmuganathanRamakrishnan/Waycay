// Common utility functions
const initializeDropdowns = (options = {}) => {
    const {
        triggerSelector = '.filter-item',
        dropdownSelector = '.dropdown-content',
        hoverDelay = 300
    } = options;

    const triggers = document.querySelectorAll(triggerSelector);
    let currentDropdown = null;
    let hideTimeout = null;

    triggers.forEach(trigger => {
        const dropdown = trigger.querySelector(dropdownSelector);
        if (!dropdown) return;

        const showDropdown = () => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }

            if (currentDropdown && currentDropdown !== dropdown) {
                currentDropdown.style.display = 'none';
            }

            const triggerRect = trigger.getBoundingClientRect();

            dropdown.style.position = 'fixed';
            dropdown.style.top = (triggerRect.bottom + 8) + 'px';
            dropdown.style.left = triggerRect.left + 'px';
            dropdown.style.transform = 'translateX(-25%)';
            dropdown.style.zIndex = '99999';
            dropdown.style.display = 'block';

            currentDropdown = dropdown;
        };

        const hideDropdown = () => {
            dropdown.style.display = 'none';
            currentDropdown = null;
        };

        trigger.addEventListener('mouseenter', showDropdown);

        trigger.addEventListener('mouseleave', (e) => {
            if (!e.relatedTarget || !dropdown.contains(e.relatedTarget)) {
                hideTimeout = setTimeout(() => {
                    if (!dropdown.matches(':hover')) {
                        hideDropdown();
                    }
                }, hoverDelay);
            }
        });

        dropdown.addEventListener('mouseenter', () => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            dropdown.style.display = 'block';
            currentDropdown = dropdown;
        });

        dropdown.addEventListener('mouseleave', (e) => {
            if (!e.relatedTarget || !trigger.contains(e.relatedTarget)) {
                hideTimeout = setTimeout(() => {
                    hideDropdown();
                }, hoverDelay);
            }
        });
    });
};

// User menu dropdown functionality
const initializeUserMenu = (options = {}) => {
    const {
        menuSelector = '.user-menu',
        dropdownSelector = '.user-dropdown',
        activeClass = 'show',
        hoverDelay = 300
    } = options;

    const userMenu = document.querySelector(menuSelector);
    const userDropdown = document.querySelector(dropdownSelector);
    let userMenuTimeout = null;

    if (!userMenu || !userDropdown) return;

    const showUserDropdown = () => {
        if (userMenuTimeout) {
            clearTimeout(userMenuTimeout);
            userMenuTimeout = null;
        }
        userDropdown.classList.add(activeClass);
    };

    const hideUserDropdown = () => {
        userDropdown.classList.remove(activeClass);
    };

    userMenu.addEventListener('mouseenter', showUserDropdown);

    userMenu.addEventListener('mouseleave', (e) => {
        if (!e.relatedTarget || !userDropdown.contains(e.relatedTarget)) {
            userMenuTimeout = setTimeout(() => {
                if (!userDropdown.matches(':hover')) {
                    hideUserDropdown();
                }
            }, hoverDelay);
        }
    });

    userDropdown.addEventListener('mouseenter', showUserDropdown);

    userDropdown.addEventListener('mouseleave', (e) => {
        if (!e.relatedTarget || !userMenu.contains(e.relatedTarget)) {
            userMenuTimeout = setTimeout(() => {
                hideUserDropdown();
            }, hoverDelay);
        }
    });
};

// Search functionality
const initializeSearch = () => {
    const handleSearch = () => {
        const searchInput = document.querySelector('.search-input');
        const searchTerm = searchInput.value.toLowerCase();
        const propertyGrid = document.getElementById('propertyGrid');
        const properties = document.querySelectorAll('.property-card');

        properties.forEach(property => {
            const location = property.querySelector('h3').textContent.toLowerCase();
            const title = property.querySelector('img').alt.toLowerCase();

            if (location.includes(searchTerm) || title.includes(searchTerm)) {
                property.style.display = 'block';
            } else {
                property.style.display = 'none';
            }
        });
    };

    // Add event listener for search button
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }

    // Add event listener for Enter key
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
};

// Favorite button functionality
const initializeFavoriteButtons = () => {
    document.querySelectorAll('.favorite-button').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const icon = this.querySelector('i');
            this.classList.toggle('active');

            if (this.classList.contains('active')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }

            // Reset animation
            this.style.animation = 'none';
            this.offsetHeight; // Trigger reflow
            this.style.animation = null;
        });
    });
};

// Load and render properties
const loadProperties = () => {
    const propertyGrid = document.getElementById('propertyGrid');
    if (!propertyGrid) return;

    fetch('data/properties.json')
        .then(response => response.json())
        .then(data => {
            data.properties.forEach(property => {
                const propertyCard = document.createElement('div');
                propertyCard.className = 'property-card';
                propertyCard.innerHTML = `
                    <div class="property-image-container">
                        <img src="${property.image}" alt="${property.title}" class="property-image">
                        <button class="favorite-button">
                            <i class="far fa-heart"></i>
                        </button>
                        <div class="image-pagination">
                            <span class="active"></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    ${property.isGuestFavorite ? '<div class="property-tag">Guest favorite</div>' : ''}
                    <div class="property-details">
                        <div class="property-location-rating">
                            <h3>${property.location}</h3>
                            <div class="rating">
                                <i class="fas fa-star"></i>
                                <span>${property.rating}</span>
                            </div>
                        </div>
                    </div>
                `;
                propertyGrid.appendChild(propertyCard);
            });
            // Initialize favorite buttons after properties are loaded
            initializeFavoriteButtons();
        })
        .catch(error => {
            console.error('Error loading properties:', error);
            propertyGrid.innerHTML = `
                <div class="error-message">
                    <p>Unable to load properties. Please try again later.</p>
                </div>
            `;
        });
};

// Initialize all functionalities when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize dropdowns
    initializeDropdowns();

    // Initialize user menu
    initializeUserMenu();

    // Initialize search functionality
    initializeSearch();

    // Load properties (this will also initialize favorite buttons after loading)
    loadProperties();
}); 