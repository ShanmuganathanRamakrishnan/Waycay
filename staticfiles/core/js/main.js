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

// Calendar functionality
let currentDate = new Date();
let selectedStartDate = null;
let selectedEndDate = null;
let activeCalendar = null;

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function initializeCalendars() {
    const startDateInput = document.getElementById('startDateInput');
    const endDateInput = document.getElementById('endDateInput');
    const startDateCalendar = document.getElementById('startDateCalendar');
    const endDateCalendar = document.getElementById('endDateCalendar');

    if (!startDateInput || !endDateInput || !startDateCalendar || !endDateCalendar) return;

    // Set initial dates
    const today = new Date();
    currentDate = new Date(today.getFullYear(), today.getMonth(), 1);

    // Initialize calendar grids
    const startMonthDisplay = startDateCalendar.querySelector('.current-month');
    const endMonthDisplay = endDateCalendar.querySelector('.current-month');

    // Add month navigation handlers
    startDateCalendar.querySelectorAll('.month-nav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const direction = btn.textContent === '<' ? -1 : 1;
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1);
            renderCalendar();
        });
    });

    endDateCalendar.querySelectorAll('.month-nav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const direction = btn.textContent === '<' ? -1 : 1;
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1);
            renderCalendar();
        });
    });

    // Handle input clicks
    startDateInput.addEventListener('click', (e) => {
        e.stopPropagation();
        endDateCalendar.classList.remove('show');
        startDateCalendar.classList.toggle('show');
        activeCalendar = 'start';
        renderCalendar();
    });

    endDateInput.addEventListener('click', (e) => {
        e.stopPropagation();
        startDateCalendar.classList.remove('show');
        endDateCalendar.classList.toggle('show');
        activeCalendar = 'end';
        renderCalendar();
    });

    // Close calendars when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.calendar-container') &&
            !e.target.closest('#startDateInput') &&
            !e.target.closest('#endDateInput')) {
            startDateCalendar.classList.remove('show');
            endDateCalendar.classList.remove('show');
        }
    });

    // Initial render
    renderCalendar();
}

function renderCalendar() {
    const calendar = document.getElementById(`${activeCalendar}DateCalendar`);
    if (!calendar) return;

    const currentMonthElement = calendar.querySelector('.current-month');
    currentMonthElement.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const calendarGrid = calendar.querySelector('.calendar-grid');
    calendarGrid.innerHTML = '';

    // Add weekday headers
    weekdays.forEach(day => {
        const weekdayElement = document.createElement('div');
        weekdayElement.className = 'weekday';
        weekdayElement.textContent = day;
        calendarGrid.appendChild(weekdayElement);
    });

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const today = new Date();
    const startingDay = firstDay.getDay();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarGrid.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;

        const currentDateToCompare = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

        // Add today indicator
        if (isToday(currentDateToCompare)) {
            dayElement.classList.add('today');
        }

        // Add selected state
        if (activeCalendar === 'start' && isSameDate(currentDateToCompare, selectedStartDate)) {
            dayElement.classList.add('selected', 'range-start');
        } else if (activeCalendar === 'end' && isSameDate(currentDateToCompare, selectedEndDate)) {
            dayElement.classList.add('selected', 'range-end');
        }

        // Add in-range state
        if (selectedStartDate && selectedEndDate &&
            currentDateToCompare > selectedStartDate &&
            currentDateToCompare < selectedEndDate) {
            dayElement.classList.add('in-range');
        }

        // Disable past dates
        if (currentDateToCompare < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
            dayElement.classList.add('disabled');
        } else {
            dayElement.addEventListener('click', () => selectDate(currentDateToCompare));
        }

        calendarGrid.appendChild(dayElement);
    }
}

function selectDate(date) {
    if (activeCalendar === 'start') {
        selectedStartDate = date;
        document.getElementById('startDateInput').value = formatDate(date);

        // If end date is before start date, clear it
        if (selectedEndDate && selectedEndDate < selectedStartDate) {
            selectedEndDate = null;
            document.getElementById('endDateInput').value = '';
        }

        // Update all destination dates starting from the new start date
        updateDestinationDates(date);

        // Automatically switch to end date selection if no end date is selected
        if (!selectedEndDate) {
            activeCalendar = 'end';
            document.getElementById('startDateCalendar').classList.remove('show');
            document.getElementById('endDateCalendar').classList.add('show');
            renderCalendar();
            return;
        }
    } else {
        // Don't allow end date before start date
        if (selectedStartDate && date < selectedStartDate) return;

        selectedEndDate = date;
        document.getElementById('endDateInput').value = formatDate(date);

        // Update destination dates considering the end date
        if (selectedStartDate) {
            updateDestinationDates(selectedStartDate);
        }
    }

    // Close calendar after selection
    document.getElementById(`${activeCalendar}DateCalendar`).classList.remove('show');

    // Update trip dates display if both dates are selected
    if (selectedStartDate && selectedEndDate) {
        const tripDates = document.getElementById('tripDates');
        if (tripDates) {
            tripDates.textContent = `${formatDateForDisplay(selectedStartDate)} - ${formatDateForDisplay(selectedEndDate)}`;
        }
    }

    renderCalendar();
}

function updateDestinationDates(startDate) {
    const destinationItems = document.querySelectorAll('.destination-item');
    let currentDate = new Date(startDate);

    destinationItems.forEach((item, index) => {
        const nights = parseInt(item.querySelector('.nights-control span').textContent);
        const dateDisplay = item.querySelector('.destination-details p');
        const endDate = addDays(currentDate, nights);
        const destinationName = item.querySelector('.destination-details h3').textContent.toLowerCase();

        // Update the date display for this destination
        dateDisplay.textContent = `${formatDateForDisplay(currentDate)} - ${formatDateForDisplay(endDate)}`;

        // Update destination data
        if (destinations[destinationName]) {
            destinations[destinationName].dateRange = `${formatDateForDisplay(currentDate)} - ${formatDateForDisplay(endDate)}`;
        }

        // If this destination is active, update the destination view
        if (item.classList.contains('active')) {
            updateDestinationView(destinationName);
        }

        // Set start date for next destination
        currentDate = new Date(endDate);
    });

    // Update the destination header if it exists
    const destinationHeader = document.querySelector('.destination-header h1 .date-range');
    if (destinationHeader) {
        const activeDestination = document.querySelector('.destination-item.active');
        if (activeDestination) {
            const dateText = activeDestination.querySelector('.destination-details p').textContent;
            destinationHeader.textContent = dateText;
        }
    }
}

function formatDate(date) {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

function isSameDate(date1, date2) {
    if (!date1 || !date2) return false;
    return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();
}

function formatDateForDisplay(date) {
    if (!date) return '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Destination data
const destinations = {
    'kyoto': {
        title: 'Kyoto',
        dateRange: 'Sun 30 Mar - Mon 31 Mar',
        description: 'Experience the ancient capital of Japan with its thousands of classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.'
    },
    'tokyo': {
        title: 'Tokyo',
        dateRange: 'Mon 31 Mar - Tue 01 Apr',
        description: 'Discover the vibrant metropolis that perfectly blends ultramodern and traditional, from neon-lit skyscrapers to historic temples.'
    }
};

// Initialize all common functionalities when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize dropdowns
    initializeDropdowns();

    // Initialize user menu
    initializeUserMenu();

    // Initialize search functionality
    initializeSearch();

    // Load properties (this will also initialize favorite buttons after loading)
    loadProperties();

    // Destination data
    const destinations = {
        'kyoto': {
            title: 'Kyoto',
            dateRange: 'Sun 30 Mar - Mon 31 Mar',
            description: 'Experience the ancient capital of Japan with its thousands of classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.'
        },
        'tokyo': {
            title: 'Tokyo',
            dateRange: 'Mon 31 Mar - Tue 01 Apr',
            description: 'Discover the vibrant metropolis that perfectly blends ultramodern and traditional, from neon-lit skyscrapers to historic temples.'
        }
    };

    // Initialize variables
    let totalNights = 0;
    const maxNights = 31;
    const nightsBadge = document.querySelector('.nights-badge');
    const destinationItems = document.querySelectorAll('.destination-item');
    const destinationView = document.querySelector('.destination-view');

    // Function to update nights badge
    function updateNightsBadge() {
        if (nightsBadge) {
            nightsBadge.textContent = `${totalNights}/${maxNights}`;
        }
    }

    // Function to update destination view
    function updateDestinationView(destinationKey) {
        const destination = destinations[destinationKey];
        if (!destination) return;

        const content = `
            <div class="destination-header">
                <h1>${destination.title} <span class="date-range">${destination.dateRange}</span></h1>
                <p class="description">${destination.description}</p>
            </div>
        `;

        destinationView.innerHTML = content;
    }

    // Add date utility functions
    function formatDate(date) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
    }

    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    // Function to update dates for all destinations
    function updateAllDates() {
        let currentDate = new Date(startDate);

        destinationItems.forEach((item, index) => {
            const nights = parseInt(item.querySelector('.nights-control span').textContent);
            const dateDisplay = item.querySelector('.destination-details p');
            const endDate = addDays(currentDate, nights);

            // Update the date display
            dateDisplay.textContent = `${formatDate(currentDate)} - ${formatDate(endDate)}`;

            // Update destination data
            const destinationName = item.querySelector('.destination-details h3').textContent.toLowerCase();
            if (destinations[destinationName]) {
                destinations[destinationName].dateRange = `${formatDate(currentDate)} - ${formatDate(endDate)}`;
            }

            // If this destination is active, update the destination view
            if (item.classList.contains('active')) {
                updateDestinationView(destinationName);
            }

            // Set start date for next destination
            currentDate = endDate;
        });
    }

    // Initialize start date (March 30, 2024)
    const startDate = new Date(2024, 2, 30);  // Month is 0-based

    // Handle destination item clicks
    destinationItems.forEach(item => {
        item.addEventListener('click', function () {
            // Remove active class from all items
            destinationItems.forEach(di => di.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');

            // Get destination name and update view
            const destinationName = this.querySelector('.destination-details h3').textContent.toLowerCase();
            updateDestinationView(destinationName);
        });

        // Update nights control handlers
        const nightsControl = item.querySelector('.nights-control');
        const nightsDisplay = nightsControl.querySelector('span');

        nightsControl.querySelector('.plus').addEventListener('click', function (e) {
            e.stopPropagation();
            const currentNights = parseInt(nightsDisplay.textContent);
            if (totalNights < maxNights) {
                nightsDisplay.textContent = currentNights + 1;
                totalNights++;
                updateNightsBadge();
                updateAllDates();  // Update dates when nights change
            }
        });

        nightsControl.querySelector('.minus').addEventListener('click', function (e) {
            e.stopPropagation();
            const currentNights = parseInt(nightsDisplay.textContent);
            if (currentNights > 0) {
                nightsDisplay.textContent = currentNights - 1;
                totalNights--;
                updateNightsBadge();
                updateAllDates();  // Update dates when nights change
            }
        });
    });

    // Calculate initial total nights
    destinationItems.forEach(item => {
        const nights = parseInt(item.querySelector('.nights-control span').textContent);
        totalNights += nights;
    });
    updateNightsBadge();

    // Sidebar toggle functionality
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const plannerContainer = document.querySelector('.planner-container');

    sidebarToggle.addEventListener('click', function () {
        plannerContainer.classList.toggle('collapsed');
    });

    // Initialize dates
    updateAllDates();

    // Initialize calendars
    initializeCalendars();

    // Initialize wishlist modals
    initializeWishlistModals();
});

// Wishlist functionality
const initializeWishlistModals = () => {
    const loginPromptModal = document.getElementById('loginPromptModal');
    const createWishlistModal = document.getElementById('createWishlistModal');
    const saveToWishlistModal = document.getElementById('saveToWishlistModal');
    const savePrompt = document.getElementById('savePrompt');
    let currentProperty = null;
    let saveCount = 0;

    // Mock user state - replace with actual authentication logic
    const isLoggedIn = false;
    const hasWishlists = false;

    // Initialize save buttons
    const initializeSaveButtons = () => {
        const propertyCards = document.querySelectorAll('.property-card');
        propertyCards.forEach(card => {
            const saveButton = document.createElement('button');
            saveButton.className = 'save-button';
            saveButton.innerHTML = '<i class="far fa-heart"></i>';

            // Add tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'save-tooltip';
            tooltip.textContent = 'Save to wishlist';

            // Replace favorite button with save button and add tooltip
            const imageContainer = card.querySelector('.property-image-container');
            const existingFavoriteButton = card.querySelector('.favorite-button');
            if (existingFavoriteButton) {
                existingFavoriteButton.replaceWith(saveButton);
            } else {
                imageContainer.appendChild(saveButton);
            }
            imageContainer.appendChild(tooltip);

            // Show tooltip on hover if not saved
            card.addEventListener('mouseenter', () => {
                if (!saveButton.classList.contains('saved')) {
                    tooltip.classList.add('show');
                }
            });

            card.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
            });

            saveButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentProperty = card;
                handleSaveClick(saveButton);
            });
        });
    };

    // Handle save button click
    const handleSaveClick = (button) => {
        if (!isLoggedIn) {
            showModal(loginPromptModal);
            return;
        }

        if (!hasWishlists) {
            saveCount++;
            if (saveCount === 1) {
                // First save attempt - show bottom prompt
                showSavePrompt();
            } else if (saveCount === 3) {
                // Third save attempt - show create wishlist modal
                showModal(createWishlistModal);
                saveCount = 0; // Reset counter
            } else {
                // Toggle save state
                toggleSaveState(button);
            }
        } else {
            showModal(saveToWishlistModal);
        }
    };

    // Toggle save state with animation
    const toggleSaveState = (button) => {
        const isSaved = button.classList.contains('saved');
        const icon = button.querySelector('i');

        if (!isSaved) {
            button.classList.add('saved');
            icon.classList.remove('far');
            icon.classList.add('fas');
        } else {
            button.classList.remove('saved');
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
    };

    // Show save prompt
    const showSavePrompt = () => {
        savePrompt.classList.add('show');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (savePrompt.classList.contains('show')) {
                savePrompt.classList.remove('show');
            }
        }, 5000);
    };

    // Handle prompt buttons
    const createFirstWishlistBtn = document.getElementById('createFirstWishlist');
    const dismissPromptBtn = document.getElementById('dismissPrompt');

    if (createFirstWishlistBtn) {
        createFirstWishlistBtn.addEventListener('click', () => {
            savePrompt.classList.remove('show');
            showModal(createWishlistModal);
        });
    }

    if (dismissPromptBtn) {
        dismissPromptBtn.addEventListener('click', () => {
            savePrompt.classList.remove('show');
        });
    }

    // Modal controls
    const showModal = (modal) => {
        closeAllModals();
        modal.classList.add('show');
    };

    const closeAllModals = () => {
        [loginPromptModal, createWishlistModal, saveToWishlistModal].forEach(modal => {
            modal.classList.remove('show');
        });
    };

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeAllModals();
        }
    });

    // Close buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', closeAllModals);
    });

    // Create new wishlist button in save modal
    const createNewWishlistBtn = document.getElementById('createNewWishlistBtn');
    if (createNewWishlistBtn) {
        createNewWishlistBtn.addEventListener('click', () => {
            showModal(createWishlistModal);
        });
    }

    // Character counter for wishlist name
    const wishlistNameInput = document.getElementById('wishlistName');
    const charCount = document.getElementById('charCount');
    if (wishlistNameInput && charCount) {
        wishlistNameInput.addEventListener('input', () => {
            const count = wishlistNameInput.value.length;
            charCount.textContent = count;

            // Update create button state
            const createButton = document.getElementById('createWishlistBtn');
            if (createButton) {
                createButton.disabled = count === 0;
                if (count === 0) {
                    createButton.classList.add('disabled');
                } else {
                    createButton.classList.remove('disabled');
                }
            }
        });
    }

    // Create wishlist button
    const createWishlistBtn = document.getElementById('createWishlistBtn');
    if (createWishlistBtn) {
        createWishlistBtn.addEventListener('click', () => {
            const name = wishlistNameInput.value.trim();
            if (name) {
                // Here you would typically make an API call to create the wishlist
                console.log('Creating wishlist:', name);
                closeAllModals();
                wishlistNameInput.value = '';
                charCount.textContent = '0';
            }
        });
    }

    // Initialize save buttons
    initializeSaveButtons();
};

// Main JavaScript file for Waycay

document.addEventListener('DOMContentLoaded', function() {
    // Initialize user menu dropdown
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.addEventListener('click', function() {
            const dropdown = this.querySelector('.user-dropdown');
            dropdown.classList.toggle('show');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.user-menu')) {
            const dropdowns = document.querySelectorAll('.user-dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });

    // Initialize category filters
    const filterItems = document.querySelectorAll('.filter-item');
    filterItems.forEach(item => {
        item.addEventListener('click', function() {
            filterItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Initialize search functionality
    const searchForm = document.querySelector('.search-bar form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const searchInput = this.querySelector('.search-input');
            if (!searchInput.value.trim()) {
                e.preventDefault();
            }
        });
    }

    // Mobile search functionality
    const mobileSearch = document.querySelector('.mobile-search');
    if (mobileSearch) {
        mobileSearch.addEventListener('click', function() {
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        });
    }
}); 