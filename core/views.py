from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.shortcuts import redirect
from django.contrib import messages
from .models import Destination, Restaurant, Hotspot, TripPlanner
from django.contrib.auth.models import User

def index(request):
    """Landing page view"""
    return render(request, 'index.html')

def explore(request):
    """Explore destinations view"""
    destinations = Destination.objects.all()
    restaurants = Restaurant.objects.all()
    hotspots = Hotspot.objects.all()
    
    context = {
        'destinations': destinations,
        'restaurants': restaurants,
        'hotspots': hotspots,
    }
    return render(request, 'explore.html', context)

def description(request, id, type):
    """Detailed description view for destinations, restaurants, or hotspots"""
    context = {}
    
    if type == 'destination':
        item = Destination.objects.get(id=id)
    elif type == 'restaurant':
        item = Restaurant.objects.get(id=id)
    elif type == 'hotspot':
        item = Hotspot.objects.get(id=id)
    else:
        return redirect('index')
    
    context['item'] = item
    context['type'] = type
    return render(request, 'description.html', context)

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
    user_trips = TripPlanner.objects.filter(user=request.user)
    context = {
        'trips': user_trips
    }
    return render(request, 'planner.html', context)
