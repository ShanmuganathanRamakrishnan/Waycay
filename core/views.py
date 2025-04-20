from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q, Avg
from .models import Destination, Restaurant, Hotspots, Trip_Planner, User, Review, Likes
from django.core.paginator import Paginator
from django.utils import timezone
from django.views.decorators.http import require_POST, require_http_methods
from django.http import JsonResponse
import json
from functools import wraps
from django.templatetags.static import static

def ajax_login_required(view_func):
    """
    Decorator that checks if a user is logged in for AJAX requests,
    returning JSON response instead of redirect for unauthorized users
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({
                'status': 'error',
                'message': 'Authentication required'
            }, status=401)
        return view_func(request, *args, **kwargs)
    return wrapper

def index(request):
    """Landing page view"""
    return render(request, 'index.html')

def get_item_image(item_type, name):
    """Get the appropriate image URL based on item type and name"""
    # Convert name to lowercase and remove spaces for matching
    name_key = name.lower().replace(' ', '_').replace('-', '_')
    
    # Define image mappings
    image_mappings = {
        'destination': {
            'delhi': 'delhi.jpeg',
            'mumbai': 'mumbai.jpg',
            'ooty': 'ooty.jpg',
            'default': 'destination-default.jpg'
        },
        'restaurant': {
            'kailash_parbat': 'KailashParbat.jpg',
            'bukhara': 'Bukhara.jpg',
            'default': 'restaurant-default.jpg'
        },
        'hotspot': {
            'gateway_of_india': 'gatewayOfIndia.jpg',
            'red_fort': 'redFort.jpg',
            'doddabetta': 'doddabetta.jpg',
            'default': 'hotspot-default.jpg'
        }
    }
    
    # Get the image mapping for the item type
    type_mappings = image_mappings.get(item_type, {})
    
    # Try to get specific image, fall back to default for type
    image_name = type_mappings.get(name_key, type_mappings.get('default', 'destination-default.jpg'))
    
    # Return the full static path
    return f'core/images/{image_name}'

def explore(request):
    # Get all hotspots and restaurants
    hotspots = Hotspots.objects.all()
    restaurants = Restaurant.objects.all()
    
    # Get user's liked items if authenticated
    user_likes = []
    if request.user.is_authenticated:
        likes = Likes.objects.filter(user_id=request.user.pk)
        # Get both hotspot and restaurant IDs from likes
        liked_hotspots = [like.hotspot.hotspot_id for like in likes if like.hotspot]
        liked_restaurants = [like.restaurant.restaurant_id for like in likes if like.restaurant]
    
    # Combine hotspots and restaurants into a single list
    items = []
    
    # Add hotspots
    for hotspot in hotspots:
        items.append({
            'id': hotspot.hotspot_id,
            'name': hotspot.locationName,
            'location': hotspot.hotspot_addr,
            'description': hotspot.description,
            'image_url': get_item_image('hotspot', hotspot.locationName) if hotspot.locationName else 'core/images/hotspot-default.jpg',
            'rating': hotspot.rating,
            'type': 'hotspot',
            'region_type': hotspot.category,
            'is_liked': request.user.is_authenticated and hotspot.hotspot_id in liked_hotspots
        })
    
    # Add restaurants
    for restaurant in restaurants:
        items.append({
            'id': restaurant.restaurant_id,
            'name': restaurant.res_name,
            'location': restaurant.res_location,
            'description': restaurant.cuisine_type,
            'image_url': get_item_image('restaurant', restaurant.res_name) if restaurant.res_name else 'core/images/restaurant-default.jpg',
            'rating': restaurant.avg_rating,
            'type': 'restaurant',
            'region_type': 'food',  # Set region_type to 'food' for restaurants
            'is_liked': request.user.is_authenticated and restaurant.restaurant_id in liked_restaurants
        })
    
    return render(request, 'explore.html', {'items': items})

def destination_detail(request, destination_id):
    destination = Destination.objects.get(pk=destination_id)
    hotspots = Hotspots.objects.filter(destination=destination)
    restaurants = Restaurant.objects.all()  # You might want to filter this based on location
    
    context = {
        'destination': destination,
        'hotspots': hotspots,
        'restaurants': restaurants
    }
    return render(request, 'destination_detail.html', context)

@login_required
def plan_trip(request, destination_id):
    if request.method == 'POST':
        # Handle form submission
        trip_name = request.POST.get('trip_name')
        start_date = request.POST.get('start_date')
        end_date = request.POST.get('end_date')
        budget = request.POST.get('budget')
        
        # Create new trip
        Trip_Planner.objects.create(
            user=request.user,
            trip_name=trip_name,
            start_date=start_date,
            end_date=end_date,
            budget=budget
        )
        
        return redirect('my_trips')
    
    destination = Destination.objects.get(pk=destination_id)
    return render(request, 'plan_trip.html', {'destination': destination})

@login_required
def my_trips(request):
    trips = Trip_Planner.objects.filter(user=request.user)
    return render(request, 'my_trips.html', {'trips': trips})

def login_view(request):
    """User login view"""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('index')
        else:
            messages.error(request, 'Invalid username or password')
    
    return render(request, 'login.html')

def user_logout(request):
    """Handle user logout"""
    logout(request)
    return redirect('explore')  # Redirect to explore page after logout

def register_view(request):
    """User registration view"""
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm-password')
        
        if password != confirm_password:
            messages.error(request, 'Passwords do not match')
            return render(request, 'register.html')
        
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists')
            return render(request, 'register.html')
        
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists')
            return render(request, 'register.html')
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        user.save()
        
        login(request, user)
        return redirect('index')
    
    return render(request, 'register.html')

@login_required
def planner(request):
    """Trip planner view"""
    user_trips = Trip_Planner.objects.filter(user=request.user)
    context = {
        'trips': user_trips
    }
    return render(request, 'planner.html', context)

def description(request, id, type):
    """Detailed description view for destinations, restaurants, or hotspots"""
    context = {}
    
    if type == 'destination':
        item = Destination.objects.get(id=id)
    elif type == 'restaurant':
        item = Restaurant.objects.get(id=id)
    elif type == 'hotspot':
        item = Hotspots.objects.get(id=id)
    else:
        return redirect('index')
    
    context['item'] = item
    context['type'] = type
    return render(request, 'description.html', context)

def hotspot_detail(request, hotspot_id):
    """Hotspot description view"""
    print(f"Hotspot ID: {hotspot_id}")  # Debug print
    hotspot = Hotspots.objects.get(pk=hotspot_id)
    nearby_restaurants = Restaurant.objects.filter(res_location__icontains=hotspot.destination.location)
    reviews = Review.objects.filter(hotspot=hotspot).order_by('-date')
    
    # Calculate average rating
    avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
    if avg_rating is not None:
        avg_rating = round(avg_rating, 1)
    
    context = {
        'hotspot': hotspot,
        'restaurants': nearby_restaurants,
        'reviews': reviews,
        'avg_rating': avg_rating,
    }
    return render(request, 'description.html', context)

@login_required
def add_review(request, hotspot_id):
    """Handle review submission"""
    if request.method == 'POST':
        hotspot = Hotspots.objects.get(pk=hotspot_id)
        rating = request.POST.get('rating')
        comment = request.POST.get('comment')
        
        # Create the review
        Review.objects.create(
            user=request.user,
            hotspot=hotspot,
            rating=rating,
            comments=comment,
            date=timezone.now().date()
        )
        
        messages.success(request, 'Your review has been submitted successfully!')
        return redirect('hotspot_detail', hotspot_id=hotspot_id)
    
    return redirect('hotspot_detail', hotspot_id=hotspot_id)

def restaurants(request):
    """
    View function for displaying the restaurants page.
    """
    # Get all restaurants
    restaurants_list = Restaurant.objects.all()
    
    # Pagination
    paginator = Paginator(restaurants_list, 9)  # Show 9 restaurants per page
    page = request.GET.get('page')
    restaurants = paginator.get_page(page)
    
    context = {
        'restaurants': restaurants,
    }
    return render(request, 'restaurants.html', context)

def restaurant_detail(request, restaurant_id):
    """
    View function for displaying restaurant details.
    """
    restaurant = Restaurant.objects.get(pk=restaurant_id)
    reviews = Review.objects.filter(restaurant=restaurant).order_by('-date')
    
    # Calculate average rating
    avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
    if avg_rating is not None:
        avg_rating = round(avg_rating, 1)
    
    context = {
        'restaurant': restaurant,
        'reviews': reviews,
        'avg_rating': avg_rating,
    }
    return render(request, 'restaurant_detail.html', context)

@login_required
def add_restaurant_review(request, restaurant_id):
    """Handle restaurant review submission"""
    if request.method == 'POST':
        restaurant = Restaurant.objects.get(pk=restaurant_id)
        rating = request.POST.get('rating')
        comment = request.POST.get('comment')
        
        # Create the review
        Review.objects.create(
            user=request.user,
            restaurant=restaurant,
            rating=rating,
            comments=comment,
            date=timezone.now().date()
        )
        
        messages.success(request, 'Your review has been submitted successfully!')
        return redirect('restaurant_detail', restaurant_id=restaurant_id)
    
    return redirect('restaurant_detail', restaurant_id=restaurant_id)

@login_required
@require_http_methods(['POST'])
def like_item(request):
    try:
        data = json.loads(request.body)
        item_id = data.get('item_id')
        item_type = data.get('item_type')

        if not item_id or not item_type:
            return JsonResponse({'status': 'error', 'message': 'Missing item_id or item_type'})

        # Get the user's like object if it exists
        like = None
        if item_type == 'hotspot':
            like = Likes.objects.filter(user=request.user, hotspot_id=item_id).first()
        elif item_type == 'restaurant':
            like = Likes.objects.filter(user=request.user, restaurant_id=item_id).first()

        if like:
            # Unlike if already liked
            like.delete()
            liked = False
        else:
            # Create new like
            like_data = {'user': request.user}
            if item_type == 'hotspot':
                like_data['hotspot_id'] = item_id
            elif item_type == 'restaurant':
                like_data['restaurant_id'] = item_id
            Likes.objects.create(**like_data)
            liked = True

        return JsonResponse({
            'status': 'success',
            'liked': liked
        })

    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

def get_item_dict(item, item_type):
    # Get common attributes based on item type
    if item_type == 'destination':
        name = item.name
        location = item.location
        desc = item.description or ''
        region = item.region_type or ''
        image_url = get_item_image('destination', item.name)
        item_id = item.destination_id
        # Calculate average rating from reviews
        avg_rating = Review.objects.filter(destination=item).aggregate(Avg('rating'))['rating__avg']
    elif item_type == 'restaurant':
        name = item.res_name
        location = item.res_location
        desc = item.cuisine_type or ''
        region = item.res_type or ''
        image_url = get_item_image('restaurant', item.res_name)
        item_id = item.restaurant_id
        # Calculate average rating from reviews
        avg_rating = Review.objects.filter(restaurant=item).aggregate(Avg('rating'))['rating__avg']
    else:  # hotspot
        name = item.hotspot_addr
        location = item.hotspot_addr
        desc = item.description or ''
        region = item.category or ''
        image_url = get_item_image('hotspot', item.hotspot_addr)
        item_id = item.hotspot_id
        # Calculate average rating from reviews
        avg_rating = Review.objects.filter(hotspot=item).aggregate(Avg('rating'))['rating__avg']
    
    # Round the average rating to 1 decimal place if it exists
    if avg_rating is not None:
        avg_rating = round(avg_rating, 1)
    
    return {
        'id': item_id,
        'name': name,
        'location': location,
        'description': desc,
        'region_type': region,
        'image_url': image_url,
        'rating': avg_rating,
        'type': item_type,
        'is_liked': False
    }

@require_POST
def search_destinations(request):
    """Handle search functionality for destinations, restaurants, and hotspots"""
    try:
        data = json.loads(request.body)
        search_term = data.get('search_term', '').lower()
        
        # Get all items
        all_destinations = Destination.objects.all()
        all_restaurants = Restaurant.objects.all()
        all_hotspots = Hotspots.objects.all()
        
        # Get liked items for authenticated users
        liked_destinations = []
        liked_restaurants = []
        liked_hotspots = []
        if request.user.is_authenticated:
            try:
                # Get all likes for the current user using the user's ID
                user_likes = Likes.objects.filter(user_id=request.user.pk)
                liked_destinations = [like.destination.id for like in user_likes if like.destination]
                liked_restaurants = [like.restaurant.id for like in user_likes if like.restaurant]
                liked_hotspots = [like.hotspot.id for like in user_likes if like.hotspot]
            except Exception as e:
                print(f"Error getting user likes in search_destinations: {str(e)}")
                # Continue with empty lists if there's an error
        
        # Filter items based on search term
        filtered_items = []
        
        def matches_search(text, search_term):
            if not text:
                return False
            text = str(text).lower()
            # Check for exact match
            if search_term in text:
                return True
            # Check for partial matches
            search_words = search_term.split()
            return any(word in text for word in search_words)
        
        # Search destinations
        for dest in all_destinations:
            if (matches_search(dest.name, search_term) or 
                matches_search(dest.location, search_term) or 
                matches_search(dest.description, search_term) or
                matches_search(dest.region_type, search_term)):
                # Calculate average rating from reviews
                avg_rating = Review.objects.filter(destination=dest).aggregate(Avg('rating'))['rating__avg']
                if avg_rating is not None:
                    avg_rating = round(avg_rating, 1)
                
                filtered_items.append({
                    'id': dest.id,
                    'name': dest.name,
                    'location': dest.location,
                    'description': dest.description,
                    'region_type': dest.region_type,
                    'rating': avg_rating,
                    'type': 'destination',
                    'is_liked': dest.id in liked_destinations,
                    'image_url': get_item_image('destination', dest.name)
                })
        
        # Search restaurants
        for rest in all_restaurants:
            if (matches_search(rest.res_name, search_term) or 
                matches_search(rest.res_location, search_term) or 
                matches_search(rest.cuisine_type, search_term) or
                matches_search(rest.res_type, search_term)):
                # Calculate average rating from reviews
                avg_rating = Review.objects.filter(restaurant=rest).aggregate(Avg('rating'))['rating__avg']
                if avg_rating is not None:
                    avg_rating = round(avg_rating, 1)
                
                filtered_items.append({
                    'id': rest.id,
                    'name': rest.res_name,
                    'location': rest.res_location,
                    'description': rest.cuisine_type,
                    'region_type': rest.res_type,
                    'rating': avg_rating or rest.avg_rating,  # Use review average or restaurant's own rating
                    'type': 'restaurant',
                    'is_liked': rest.id in liked_restaurants,
                    'image_url': get_item_image('restaurant', rest.res_name)
                })
        
        # Search hotspots
        for spot in all_hotspots:
            if (matches_search(spot.hotspot_addr, search_term) or 
                matches_search(spot.description, search_term) or
                matches_search(spot.category, search_term)):
                # Calculate average rating from reviews
                avg_rating = Review.objects.filter(hotspot=spot).aggregate(Avg('rating'))['rating__avg']
                if avg_rating is not None:
                    avg_rating = round(avg_rating, 1)
                
                filtered_items.append({
                    'id': spot.id,
                    'name': spot.hotspot_addr,
                    'location': spot.hotspot_addr,
                    'description': spot.description,
                    'region_type': spot.category,
                    'rating': avg_rating or spot.rating,  # Use review average or hotspot's own rating
                    'type': 'hotspot',
                    'is_liked': spot.id in liked_hotspots,
                    'image_url': get_item_image('hotspot', spot.hotspot_addr)
                })
        
        # Sort results by relevance (exact matches first, then partial matches)
        def get_relevance_score(item):
            score = 0
            search_words = search_term.split()
            
            # Check name
            name = str(item['name']).lower()
            if search_term in name:
                score += 3
            elif any(word in name for word in search_words):
                score += 2
            
            # Check location
            location = str(item['location']).lower()
            if search_term in location:
                score += 2
            elif any(word in location for word in search_words):
                score += 1
            
            # Check description
            description = str(item['description']).lower()
            if search_term in description:
                score += 1
            elif any(word in description for word in search_words):
                score += 0.5
            
            return score
        
        filtered_items.sort(key=get_relevance_score, reverse=True)
        
        return JsonResponse({
            'status': 'success',
            'items': filtered_items
        })
    except Exception as e:
        print(f"Error in search_destinations: {str(e)}")
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

@require_POST
def filter_destinations(request):
    """Handle filtering of restaurants and hotspots"""
    try:
        data = json.loads(request.body)
        category = data.get('category')
        subcategory = data.get('subcategory')
        
        # Get all restaurants and hotspots
        all_restaurants = Restaurant.objects.all()
        all_hotspots = Hotspots.objects.all()
        
        filtered_items = []
        
        # Get liked items for authenticated users
        liked_restaurants = []
        liked_hotspots = []
        if request.user.is_authenticated:
            try:
                # Get all likes for the current user using user_id
                user_likes = Likes.objects.filter(user_id=request.user.pk)
                liked_restaurants = [like.restaurant.restaurant_id for like in user_likes if like.restaurant]
                liked_hotspots = [like.hotspot.hotspot_id for like in user_likes if like.hotspot]
            except Exception as e:
                print(f"Error getting user likes in filter_destinations: {str(e)}")
                # Continue with empty lists if there's an error
        
        # If no category is selected, show all items
        if not category:
            # Add all restaurants
            for rest in all_restaurants:
                filtered_items.append({
                    'id': rest.restaurant_id,
                    'name': rest.res_name,
                    'location': rest.res_location,
                    'description': rest.cuisine_type,
                    'image_url': get_item_image('restaurant', rest.res_name) if rest.res_name else 'core/images/restaurant-default.jpg',
                    'rating': rest.avg_rating,
                    'type': 'restaurant',
                    'region_type': 'food',
                    'is_liked': rest.restaurant_id in liked_restaurants
                })
            
            # Add all hotspots
            for spot in all_hotspots:
                filtered_items.append({
                    'id': spot.hotspot_id,
                    'name': spot.locationName,
                    'location': spot.hotspot_addr,
                    'description': spot.description,
                    'image_url': get_item_image('hotspot', spot.locationName) if spot.locationName else 'core/images/hotspot-default.jpg',
                    'rating': spot.rating,
                    'type': 'hotspot',
                    'region_type': spot.category,
                    'is_liked': spot.hotspot_id in liked_hotspots
                })
        else:
            # Filter items based on category and subcategory
            # Define category keywords
            category_keywords = {
                'cultural': ['temple', 'museum', 'historical', 'heritage', 'art', 'culture'],
                'food': ['restaurant', 'cafe', 'dining', 'cuisine', 'food'],
                'nature': ['beach', 'mountain', 'park', 'garden', 'forest', 'lake', 'outdoor'],
                'shopping': ['mall', 'market', 'shop', 'store', 'retail'],
                'adventure': ['trek', 'hike', 'adventure', 'sport', 'activity']
            }
            
            # Define subcategory mappings
            subcategory_keywords = {
                'cultural': {
                    'temples': ['temple', 'shrine', 'worship'],
                    'museums': ['museum', 'gallery', 'exhibition'],
                    'historical': ['historical', 'ancient', 'heritage', 'ruins']
                },
                'food': {
                    'restaurants': ['restaurant', 'dining'],
                    'cafes': ['cafe', 'coffee', 'bakery'],
                    'local': ['local', 'traditional', 'street food']
                },
                'nature': {
                    'beaches': ['beach', 'coast', 'shore'],
                    'mountains': ['mountain', 'hill', 'peak'],
                    'parks': ['park', 'garden', 'reserve']
                },
                'shopping': {
                    'malls': ['mall', 'shopping center'],
                    'markets': ['market', 'bazaar', 'street market'],
                    'boutiques': ['boutique', 'shop', 'store']
                },
                'adventure': {
                    'trekking': ['trek', 'hike', 'trail'],
                    'water': ['surf', 'dive', 'swim', 'water sport'],
                    'sports': ['sport', 'adventure', 'activity']
                }
            }

            def matches_keywords(item, keywords, item_type):
                # Get item attributes based on type
                if item_type == 'restaurant':
                    name = item.res_name.lower()
                    desc = (item.cuisine_type or '').lower()
                    region = 'food'
                else:  # hotspot
                    name = item.locationName.lower()
                    desc = (item.description or '').lower()
                    region = (item.category or '').lower()
                
                # Check if any keyword matches in name, description or region type
                text = f"{name} {desc} {region}"
                return any(keyword in text for keyword in keywords)

            # Filter items based on category and subcategory
            if category:
                category = category.lower()
                if category in category_keywords:
                    # If subcategory is specified, use its keywords
                    if subcategory and subcategory.lower() in subcategory_keywords.get(category, {}):
                        keywords = subcategory_keywords[category][subcategory.lower()]
                    else:
                        keywords = category_keywords[category]
                    
                    # Filter restaurants
                    for rest in all_restaurants:
                        if matches_keywords(rest, keywords, 'restaurant'):
                            filtered_items.append({
                                'id': rest.restaurant_id,
                                'name': rest.res_name,
                                'location': rest.res_location,
                                'description': rest.cuisine_type,
                                'image_url': get_item_image('restaurant', rest.res_name) if rest.res_name else 'core/images/restaurant-default.jpg',
                                'rating': rest.avg_rating,
                                'type': 'restaurant',
                                'region_type': 'food',
                                'is_liked': rest.restaurant_id in liked_restaurants
                            })
                    
                    # Filter hotspots
                    for spot in all_hotspots:
                        if matches_keywords(spot, keywords, 'hotspot'):
                            filtered_items.append({
                                'id': spot.hotspot_id,
                                'name': spot.locationName,
                                'location': spot.hotspot_addr,
                                'description': spot.description,
                                'image_url': get_item_image('hotspot', spot.locationName) if spot.locationName else 'core/images/hotspot-default.jpg',
                                'rating': spot.rating,
                                'type': 'hotspot',
                                'region_type': spot.category,
                                'is_liked': spot.hotspot_id in liked_hotspots
                            })
        
        return JsonResponse({
            'status': 'success',
            'items': filtered_items
        })
        
    except Exception as e:
        print(f"Error in filter_destinations: {str(e)}")
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
