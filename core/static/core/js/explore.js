document.addEventListener('DOMContentLoaded', function() {
    const propertyGrid = document.querySelector('.listings-grid');
    const filterButtons = document.querySelectorAll('.filter-button');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const categoryFilters = document.querySelector('.category-filters');
    let searchTimeout;
    let activeCategory = null;
    let allItems = []; // Store all items from initial page load
    let lastScrollTop = 0;

    // Handle scroll behavior for category filters
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // If we've scrolled past the filters' original position
        if (scrollTop > 80) {
            categoryFilters.style.visibility = 'hidden';
        } else {
            categoryFilters.style.visibility = 'visible';
        }
        
        lastScrollTop = scrollTop;
    });

    // Get initial items from the page
    const initialCards = document.querySelectorAll('.property-card');
    initialCards.forEach(card => {
        allItems.push({
            id: card.dataset.id,
            type: card.dataset.type,
            name: card.querySelector('h3').textContent,
            location: card.querySelector('.property-distance').textContent.trim(),
            description: card.querySelector('.property-info').textContent,
            region_type: card.dataset.category,
            rating: card.querySelector('.rating span')?.textContent || '0.0',
            image_url: card.querySelector('.property-image').src,
            is_liked: card.querySelector('.like-button').classList.contains('liked')
        });
    });

    console.log('Initial items loaded:', allItems);

    // Function to create a property card
    function createPropertyCard(item) {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.setAttribute('data-type', item.type);
        card.setAttribute('data-id', item.id);
        card.setAttribute('data-category', item.region_type.toLowerCase());

        const imageUrl = item.image_url.includes('/static/') ? 
            item.image_url : 
            `/static/${item.image_url}`;

        const heartIconClass = item.is_liked ? 'fas' : 'far';

        card.innerHTML = `
            <div class="property-image-container">
                <img src="${imageUrl}" alt="${item.name}" class="property-image">
                <div class="like-button ${item.is_liked ? 'liked' : ''}" data-id="${item.id}" data-type="${item.type}">
                    <i class="${heartIconClass} fa-heart"></i>
                </div>
            </div>
            <div class="property-details">
                <div class="property-location-rating">
                    <h3>${item.name}</h3>
                    <div class="rating">
                        <span>${item.rating}</span>
                        <i class="fas fa-star"></i>
                    </div>
                </div>
                <p class="property-distance">
                    <i class="fas fa-map-marker-alt"></i>
                    ${item.location}
                </p>
                <p class="property-info">${item.description}</p>
                ${item.region_type ? `<div class="property-tag">${item.region_type}</div>` : ''}
            </div>
        `;

        // Add event listeners to the new card
        addCardEventListeners(card);

        return card;
    }

    // Function to update the property grid
    function updatePropertyGrid(items) {
        propertyGrid.innerHTML = '';
        
        if (items.length === 0) {
            const noItems = document.createElement('div');
            noItems.className = 'no-results';
            noItems.innerHTML = '<p>No items found for the selected category.</p>';
            propertyGrid.appendChild(noItems);
            return;
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'property-card';
            card.setAttribute('data-type', item.type);
            card.setAttribute('data-id', item.id);
            card.setAttribute('data-category', item.region_type.toLowerCase());

            const imageUrl = item.image_url.includes('/static/') ? 
                item.image_url : 
                `/static/${item.image_url}`;

            const heartIconClass = item.is_liked ? 'fas' : 'far';

            card.innerHTML = `
                <div class="property-image-container">
                    <img src="${imageUrl}" alt="${item.name}" class="property-image">
                    <div class="like-button ${item.is_liked ? 'liked' : ''}" data-id="${item.id}" data-type="${item.type}">
                        <i class="${heartIconClass} fa-heart"></i>
                    </div>
                </div>
                <div class="property-details">
                    <div class="property-location-rating">
                        <h3>${item.name}</h3>
                        <div class="rating">
                            <span>${item.rating}</span>
                            <i class="fas fa-star"></i>
                        </div>
                    </div>
                    <p class="property-distance">
                        <i class="fas fa-map-marker-alt"></i>
                        ${item.location}
                    </p>
                    <p class="property-info">${item.description}</p>
                    ${item.region_type ? `<div class="property-tag">${item.region_type}</div>` : ''}
                </div>
            `;

            // Add event listeners to the new card
            addCardEventListeners(card);
            propertyGrid.appendChild(card);
        });
    }

    // Function to filter by category
    async function filterByCategory(category) {
        try {
            const response = await fetch('/filter-destinations/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    category: category
                })
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                // Filter items to only show hotspots and restaurants
                const filteredItems = data.items.filter(item => 
                    item.type === 'hotspot' || item.type === 'restaurant'
                );
                updatePropertyGrid(filteredItems);
            } else {
                console.error('Error filtering items:', data.message);
            }
        } catch (error) {
            console.error('Error filtering items:', error);
        }
    }

    // Handle search input with debounce
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const searchTerm = this.value.trim();
        
        if (searchTerm.length < 2) {
            if (activeCategory) {
                filterByCategory(activeCategory);
            } else {
                updatePropertyGrid(allItems);
            }
            return;
        }

        searchTimeout = setTimeout(() => {
            const filteredItems = allItems.filter(item => {
                const searchText = `${item.name} ${item.location} ${item.description} ${item.region_type}`.toLowerCase();
                return searchText.includes(searchTerm.toLowerCase());
            });
            updatePropertyGrid(filteredItems);
        }, 300);
    });

    // Handle search button click
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm.length >= 2) {
            const filteredItems = allItems.filter(item => {
                const searchText = `${item.name} ${item.location} ${item.description} ${item.region_type}`.toLowerCase();
                return searchText.includes(searchTerm.toLowerCase());
            });
            updatePropertyGrid(filteredItems);
        }
    });

    // Add event listeners for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            
            // If clicking the same button, remove the filter
            if (activeCategory === category) {
                button.classList.remove('active');
                activeCategory = null;
                updatePropertyGrid(allItems);
                return;
            }
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            activeCategory = category;
            
            // Filter items by category
            filterByCategory(category);
        });
    });

    // Function to handle like button click
    async function handleLikeClick(button) {
        const itemId = button.dataset.id;
        const itemType = button.dataset.type;
        
        try {
            const response = await fetch('/like-item/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    item_id: itemId,
                    item_type: itemType
                })
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                // Update the button state
                button.classList.toggle('liked', data.liked);
                const heartIcon = button.querySelector('i.fa-heart');
                if (heartIcon) {
                    heartIcon.classList.toggle('fas', data.liked);
                    heartIcon.classList.toggle('far', !data.liked);
                }

                // Add animation class
                button.classList.add('like-animation');
                setTimeout(() => {
                    button.classList.remove('like-animation');
                }, 300);

                // Update the item in allItems
                const itemIndex = allItems.findIndex(item => item.id === itemId && item.type === itemType);
                if (itemIndex !== -1) {
                    allItems[itemIndex].is_liked = data.liked;
                }
            } else if (data.status === 'error' && data.message === 'Authentication required') {
                // Redirect to login page if not authenticated
                window.location.href = '/login/';
            } else {
                console.error('Error updating like:', data.message);
            }
        } catch (error) {
            console.error('Error updating like:', error);
        }
    }

    // Function to handle card click for navigation
    function handleCardClick(card, event) {
        if (event.target.closest('.like-button')) {
            return;
        }

        const itemId = card.dataset.id;
        const itemType = card.dataset.type;
        
        if (itemType === 'hotspot') {
            window.location.href = `/hotspot/${itemId}/`;
        } else if (itemType === 'restaurant') {
            window.location.href = `/restaurant/${itemId}/`;
        }
    }

    // Add event listeners to initial cards
    function addCardEventListeners(card) {
        const likeButton = card.querySelector('.like-button');
        if (likeButton) {
            likeButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLikeClick(likeButton);
            });
        }

        card.addEventListener('click', (e) => handleCardClick(card, e));
    }

    // Add event listeners to initial cards
    initialCards.forEach(card => {
        addCardEventListeners(card);
    });
}); 