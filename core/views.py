from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q, Avg
from .models import Destination, Restaurant, Hotspots, Trip_Planner, User, Review
from django.core.paginator import Paginator
from django.utils import timezone

def index(request):
    """Landing page view"""
    return render(request, 'index.html')

def explore(request):
    """Explore hotspots view"""
    query = request.GET.get('q', '')
    page_number = request.GET.get('page', 1)
    
    hotspots = Hotspots.objects.all()
    
    if query:
        hotspots = hotspots.filter(
            Q(locationName__icontains=query) |
            Q(description__icontains=query) |
            Q(category__icontains=query) |
            Q(destination__name__icontains=query) |
            Q(destination__location__icontains=query)
        )
    
    # Paginate hotspots
    paginator = Paginator(hotspots, 15)  # Show 15 hotspots per page
    page_obj = paginator.get_page(page_number)
    
    context = {
        'hotspots': page_obj,
        'query': query,
        'no_results': not hotspots.exists()
    }
    return render(request, 'explore.html', context)

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

def user_login(request):
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
    logout(request)
    return redirect('index')

def register(request):
    """User registration view"""
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm-password')
        
        # Validate passwords match
        if password != confirm_password:
            messages.error(request, 'Passwords do not match')
            return render(request, 'register.html')
        
        # Check if username already exists
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists')
            return render(request, 'register.html')
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists')
            return render(request, 'register.html')
        
        try:
            # Create new user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                phone='',  # Default empty phone
                travel_type='',  # Default empty travel type
                preferred_region=''  # Default empty preferred region
            )
            
            # Log the user in
            login(request, user)
            messages.success(request, 'Registration successful! Welcome to Waycay.')
            return redirect('index')
            
        except Exception as e:
            messages.error(request, f'An error occurred during registration: {str(e)}')
            return render(request, 'register.html')
    
    return render(request, 'register.html')

def planner(request):
    if not request.user.is_authenticated:
        return redirect('login')
    return render(request, 'planner.html')

def description(request, destination_id):
    """Destination description view"""
    destination = Destination.objects.get(pk=destination_id)
    hotspots = Hotspots.objects.filter(destination=destination)
    restaurants = Restaurant.objects.filter(res_location__icontains=destination.location)
    
    # Calculate average rating
    avg_rating = Review.objects.filter(hotspot__in=hotspots).aggregate(Avg('rating'))['rating__avg']
    if avg_rating is not None:
        avg_rating = round(avg_rating, 1)
    
    context = {
        'destination': destination,
        'hotspots': hotspots,
        'restaurants': restaurants,
        'avg_rating': avg_rating,
    }
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
