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
let nightsBadge;
let destinationItems;
let destinationView;
let startDate;

// Date utility functions
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

// Function to update nights badge with animation
function updateNightsBadge() {
    nightsBadge.textContent = `${totalNights}/${maxNights}`;
    nightsBadge.classList.add('animate');
    setTimeout(() => nightsBadge.classList.remove('animate'), 300);
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

// Modal functionality
function initializeModal() {
    const tripDates = document.getElementById('tripDates');
    const modal = document.getElementById('tripSettingsModal');
    const closeBtn = modal.querySelector('.modal-close');
    const visibilityOptions = modal.querySelectorAll('.visibility-option');
    const copyLinkBtn = modal.querySelector('.copy-link-btn');

    // Open modal when clicking trip dates
    tripDates.addEventListener('click', () => {
        modal.classList.add('show');
    });

    // Close modal when clicking close button
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Handle visibility options
    visibilityOptions.forEach(option => {
        option.addEventListener('click', () => {
            visibilityOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });

    // Handle copy link button
    copyLinkBtn.addEventListener('click', () => {
        const linkText = modal.querySelector('.link-display').textContent;
        navigator.clipboard.writeText(linkText).then(() => {
            const originalText = copyLinkBtn.textContent;
            copyLinkBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyLinkBtn.textContent = originalText;
            }, 2000);
        });
    });
}

// Initialize planner functionality
function initializePlanner() {
    // Initialize DOM elements
    nightsBadge = document.querySelector('.nights-badge');
    destinationItems = document.querySelectorAll('.destination-item');
    destinationView = document.querySelector('.destination-view');

    // Initialize start date (March 30, 2024)
    startDate = new Date(2024, 2, 30);  // Month is 0-based

    // Sidebar toggle functionality
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const plannerContainer = document.querySelector('.planner-container');

    if (sidebarToggle && plannerContainer) {
        // Remove any existing event listeners
        const newSidebarToggle = sidebarToggle.cloneNode(true);
        sidebarToggle.parentNode.replaceChild(newSidebarToggle, sidebarToggle);

        newSidebarToggle.addEventListener('click', function (e) {
            e.preventDefault();
            plannerContainer.classList.toggle('collapsed');
        });
    }

    // Handle destination item clicks
    destinationItems.forEach(item => {
        // Remove any existing event listeners
        const clone = item.cloneNode(true);
        item.parentNode.replaceChild(clone, item);

        clone.addEventListener('click', function () {
            // Remove active class from all items
            destinationItems.forEach(di => di.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');

            // Get destination name and update view
            const destinationName = this.querySelector('.destination-details h3').textContent.toLowerCase();
            updateDestinationView(destinationName);
        });

        // Update nights control handlers
        const nightsControl = clone.querySelector('.nights-control');
        const nightsDisplay = nightsControl.querySelector('span');
        const plusButton = nightsControl.querySelector('.plus');
        const minusButton = nightsControl.querySelector('.minus');

        plusButton.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            const currentNights = parseInt(nightsDisplay.textContent);
            if (totalNights < maxNights) {
                nightsDisplay.textContent = currentNights + 1;
                totalNights++;
                updateNightsBadge();
                updateAllDates();
            }
        });

        minusButton.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            const currentNights = parseInt(nightsDisplay.textContent);
            if (currentNights > 0) {
                nightsDisplay.textContent = currentNights - 1;
                totalNights--;
                updateNightsBadge();
                updateAllDates();
            }
        });
    });

    // Calculate initial total nights
    destinationItems = document.querySelectorAll('.destination-item');
    totalNights = 0;
    destinationItems.forEach(item => {
        const nights = parseInt(item.querySelector('.nights-control span').textContent);
        totalNights += nights;
    });
    updateNightsBadge();

    // Initialize dates
    updateAllDates();

    // Initialize modal
    initializeModal();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializePlanner();
}); 