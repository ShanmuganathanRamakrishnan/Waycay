from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import User, Destination, Restaurant, Hotspots, Likes, Review, Trip_Planner, Trip_Planner_Details
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = 'Populates the database with sample data'

    def handle(self, *args, **kwargs):
        # Create Users
        users = [
            User.objects.create(
                username='john_doe',
                email='john.doe@example.com',
                password=make_password('password123'),
                phone='1234567890',
                travel_type='Adventure',
                preferred_region='Asia'
            ),
            User.objects.create(
                username='jane_smith',
                email='jane.smith@example.com',
                password=make_password('password123'),
                phone='0987654321',
                travel_type='Cultural',
                preferred_region='Europe'
            ),
            User.objects.create(
                username='mike_wilson',
                email='mike.wilson@example.com',
                password=make_password('password123'),
                phone='1122334455',
                travel_type='Beach',
                preferred_region='Caribbean'
            ),
            User.objects.create(
                username='sarah_jones',
                email='sarah.jones@example.com',
                password=make_password('password123'),
                phone='5566778899',
                travel_type='City',
                preferred_region='North America'
            ),
            User.objects.create(
                username='david_brown',
                email='david.brown@example.com',
                password=make_password('password123'),
                phone='9988776655',
                travel_type='Nature',
                preferred_region='South America'
            )
        ]

        # Create Destinations
        destinations = [
            Destination.objects.create(
                name='Kyoto',
                location='Japan',
                region_type='Cultural',
                visit_time='Spring',
                description='Ancient capital of Japan with temples and gardens',
                avg_cost=150.00
            ),
            Destination.objects.create(
                name='Paris',
                location='France',
                region_type='City',
                visit_time='Summer',
                description='City of love and lights',
                avg_cost=200.00
            ),
            Destination.objects.create(
                name='Bali',
                location='Indonesia',
                region_type='Beach',
                visit_time='Summer',
                description='Tropical paradise with beaches and temples',
                avg_cost=100.00
            ),
            Destination.objects.create(
                name='New York',
                location='USA',
                region_type='City',
                visit_time='Fall',
                description='The city that never sleeps',
                avg_cost=250.00
            ),
            Destination.objects.create(
                name='Machu Picchu',
                location='Peru',
                region_type='Historical',
                visit_time='Dry Season',
                description='Ancient Incan city in the mountains',
                avg_cost=180.00
            )
        ]

        # Create Restaurants
        restaurants = [
            Restaurant.objects.create(
                res_name='Sushi Master',
                cuisine_type='Japanese',
                res_location='Kyoto, Japan',
                avg_rating=4.5,
                price_range='$$$',
                timings='11:00-22:00',
                res_type='Fine Dining'
            ),
            Restaurant.objects.create(
                res_name='Le Petit Paris',
                cuisine_type='French',
                res_location='Paris, France',
                avg_rating=4.8,
                price_range='$$$$',
                timings='12:00-23:00',
                res_type='Fine Dining'
            ),
            Restaurant.objects.create(
                res_name='Bali Beach Grill',
                cuisine_type='Indonesian',
                res_location='Bali, Indonesia',
                avg_rating=4.2,
                price_range='$$',
                timings='10:00-22:00',
                res_type='Casual'
            ),
            Restaurant.objects.create(
                res_name='NYC Steakhouse',
                cuisine_type='American',
                res_location='New York, USA',
                avg_rating=4.6,
                price_range='$$$$',
                timings='17:00-23:00',
                res_type='Fine Dining'
            ),
            Restaurant.objects.create(
                res_name='Andean Cuisine',
                cuisine_type='Peruvian',
                res_location='Cusco, Peru',
                avg_rating=4.3,
                price_range='$$',
                timings='12:00-21:00',
                res_type='Casual'
            )
        ]

        # Create Hotspots
        hotspots = []
        for destination in destinations:
            hotspot = Hotspots.objects.create(
                destination=destination,
                locationName=f"{destination.name} City Center",
                category='Cultural & Historical',
                timings='9:00 AM - 6:00 PM',
                rating=4.8,
                hidden_gem=True,
                description=f"Explore the rich history and culture of {destination.name}",
                hotspot_addr=f"123 Main Street, {destination.location}",
                imageUrl=f"https://source.unsplash.com/random/800x600/?{destination.name.lower()}"
            )
            hotspots.append(hotspot)

        # Create Likes
        for i in range(5):
            Likes.objects.create(
                user=users[i],
                destination=destinations[i],
                hotspot=hotspots[i]
            )

        # Create Reviews
        for i in range(5):
            Review.objects.create(
                user=users[i],
                destination=destinations[i],
                rating=5,
                comments=f"Amazing experience in {destinations[i].name}!",
                date=timezone.now()
            )

        # Create Trip Planners
        trip_planners = []
        for i in range(5):
            planner = Trip_Planner.objects.create(
                user=users[i],
                trip_name=f"{destinations[i].name} Adventure",
                start_date=timezone.now().date(),
                end_date=timezone.now().date(),
                budget=2000.00
            )
            trip_planners.append(planner)

        # Create Trip Planner Details
        for i in range(5):
            Trip_Planner_Details.objects.create(
                planner=trip_planners[i],
                destination=destinations[i],
                restaurant=restaurants[i],
                hotspot=hotspots[i],
                visit_date=timezone.now().date(),
                notes=f"Visit {destinations[i].name} main attractions"
            )

        self.stdout.write(self.style.SUCCESS('Successfully populated database with sample data')) 