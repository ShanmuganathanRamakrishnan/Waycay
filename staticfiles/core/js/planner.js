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
    const editNameBtn = modal.querySelector('.edit-name-btn');
    const visibilityOptions = modal.querySelectorAll('.visibility-option');
    const copyLinkBtn = modal.querySelector('.copy-link-btn');
    const deleteBtn = modal.querySelector('.delete-trip');
    const startDateInput = document.getElementById('startDateInput');
    const endDateInput = document.getElementById('endDateInput');

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
            const originalText = copyLinkBtn.innerHTML;
            copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyLinkBtn.innerHTML = originalText;
            }, 2000);
        });
    });

    // Handle edit name button
    editNameBtn.addEventListener('click', () => {
        const titleElement = modal.querySelector('.modal-header h2');
        const currentText = titleElement.childNodes[0].textContent.trim();
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.style.fontSize = '24px';
        input.style.fontWeight = '600';
        input.style.border = 'none';
        input.style.outline = 'none';
        input.style.width = '200px';

        titleElement.replaceChild(input, titleElement.childNodes[0]);
        input.focus();

        input.addEventListener('blur', () => {
            const newText = input.value.trim() || currentText;
            titleElement.replaceChild(document.createTextNode(newText), input);
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
    });

    // Handle delete button
    deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this trip?')) {
            // Add delete functionality here
            modal.classList.remove('show');
        }
    });

    // Handle date inputs
    startDateInput.addEventListener('click', () => {
        // Add date picker functionality here
    });

    endDateInput.addEventListener('click', () => {
        // Add date picker functionality here
    });
}

// Calendar functionality
function initializeCalendar() {
    const startDateInput = document.getElementById('startDateInput');
    const endDateInput = document.getElementById('endDateInput');
    const startCalendar = document.getElementById('startDateCalendar');
    const endCalendar = document.getElementById('endDateCalendar');
    const currentMonthElements = document.querySelectorAll('.current-month');

    let currentDate = new Date();
    let selectedStartDate = null;
    let selectedEndDate = null;

    function renderCalendar(calendar, date) {
        const calendarGrid = calendar.querySelector('.calendar-grid');
        const year = date.getFullYear();
        const month = date.getMonth();

        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        calendar.closest('.date-input-container').querySelector('.current-month').textContent =
            `${monthNames[month]} ${year}`;

        // Clear previous calendar
        calendarGrid.innerHTML = '';

        // Get first day of month
        const firstDay = new Date(year, month, 1);
        const startingDay = firstDay.getDay();

        // Get last day of month
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Add empty cells for days before first day
        for (let i = 0; i < startingDay; i++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-day empty';
            calendarGrid.appendChild(cell);
        }

        // Add days of month
        for (let i = 1; i <= daysInMonth; i++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-day';
            cell.textContent = i;

            const cellDate = new Date(year, month, i);

            // Add click handler
            cell.addEventListener('click', () => {
                if (calendar === startCalendar) {
                    selectedStartDate = cellDate;
                    startDateInput.value = formatDateForInput(cellDate);
                    startCalendar.classList.remove('show');
                    if (selectedEndDate && selectedStartDate > selectedEndDate) {
                        selectedEndDate = null;
                        endDateInput.value = '';
                    }
                } else {
                    if (selectedStartDate && cellDate < selectedStartDate) {
                        return;
                    }
                    selectedEndDate = cellDate;
                    endDateInput.value = formatDateForInput(cellDate);
                    endCalendar.classList.remove('show');
                }
            });

            // Highlight selected dates
            if (selectedStartDate && isSameDay(cellDate, selectedStartDate)) {
                cell.classList.add('selected');
            }
            if (selectedEndDate && isSameDay(cellDate, selectedEndDate)) {
                cell.classList.add('selected');
            }

            // Highlight today
            if (isSameDay(cellDate, new Date())) {
                cell.classList.add('today');
            }

            calendarGrid.appendChild(cell);
        }
    }

    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }

    // Initialize calendars
    renderCalendar(startCalendar, currentDate);
    renderCalendar(endCalendar, currentDate);

    // Add click handlers for date inputs
    startDateInput.addEventListener('click', () => {
        startCalendar.classList.toggle('show');
        endCalendar.classList.remove('show');
    });

    endDateInput.addEventListener('click', () => {
        if (selectedStartDate) {
            endCalendar.classList.toggle('show');
            startCalendar.classList.remove('show');
        }
    });

    // Add month navigation handlers
    document.querySelectorAll('.month-nav').forEach(button => {
        button.addEventListener('click', (e) => {
            const calendar = e.target.closest('.calendar-container');
            const isStartCalendar = calendar === startCalendar;
            const direction = e.target.textContent === '>' ? 1 : -1;

            currentDate = new Date(currentDate.getFullYear(),
                currentDate.getMonth() + direction, 1);

            renderCalendar(isStartCalendar ? startCalendar : endCalendar, currentDate);
        });
    });

    // Close calendar when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.date-input-container')) {
            startCalendar.classList.remove('show');
            endCalendar.classList.remove('show');
        }
    });
}

// Initialize planner functionality
function initializePlanner() {
    // Initialize DOM elements
    nightsBadge = document.querySelector('.nights-badge');
    destinationItems = document.querySelectorAll('.destination-item');
    destinationView = document.querySelector('.destination-view');
    const tripDates = document.getElementById('tripDates');
    const tripSettingsModal = document.getElementById('tripSettingsModal');
    const modalClose = tripSettingsModal.querySelector('.modal-close');

    // Add click handler for trip dates
    tripDates.addEventListener('click', function () {
        tripSettingsModal.classList.add('show');
    });

    // Add click handler for modal close button
    modalClose.addEventListener('click', function () {
        tripSettingsModal.classList.remove('show');
    });

    // Close modal when clicking outside
    tripSettingsModal.addEventListener('click', function (e) {
        if (e.target === tripSettingsModal) {
            tripSettingsModal.classList.remove('show');
        }
    });

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

    // Initialize calendar
    initializeCalendar();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializePlanner();
}); 