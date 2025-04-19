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
        self.create_hotspots()

        # Create Likes
        likes = [
            Likes.objects.create(user=users[0], destination=destinations[0]),
            Likes.objects.create(user=users[1], destination=destinations[1]),
            Likes.objects.create(user=users[2], destination=destinations[2]),
            Likes.objects.create(user=users[3], destination=destinations[3]),
            Likes.objects.create(user=users[4], destination=destinations[4])
        ]

        # Create Reviews
        reviews = [
            Review.objects.create(
                user=users[0],
                destination=destinations[0],
                rating=5,
                comments='Amazing cultural experience!',
                date=timezone.now()
            ),
            Review.objects.create(
                user=users[1],
                destination=destinations[1],
                rating=4,
                comments='Beautiful city, but crowded',
                date=timezone.now()
            ),
            Review.objects.create(
                user=users[2],
                destination=destinations[2],
                rating=5,
                comments='Paradise on earth!',
                date=timezone.now()
            ),
            Review.objects.create(
                user=users[3],
                destination=destinations[3],
                rating=4,
                comments='The city that never sleeps!',
                date=timezone.now()
            ),
            Review.objects.create(
                user=users[4],
                destination=destinations[4],
                rating=5,
                comments='Breathtaking views and history',
                date=timezone.now()
            )
        ]

        # Create Trip Planners
        trip_planners = [
            Trip_Planner.objects.create(
                user=users[0],
                trip_name='Japan Adventure',
                start_date=timezone.now().date(),
                end_date=timezone.now().date(),
                budget=2000.00
            ),
            Trip_Planner.objects.create(
                user=users[1],
                trip_name='European Tour',
                start_date=timezone.now().date(),
                end_date=timezone.now().date(),
                budget=3000.00
            ),
            Trip_Planner.objects.create(
                user=users[2],
                trip_name='Bali Getaway',
                start_date=timezone.now().date(),
                end_date=timezone.now().date(),
                budget=1500.00
            ),
            Trip_Planner.objects.create(
                user=users[3],
                trip_name='NYC Experience',
                start_date=timezone.now().date(),
                end_date=timezone.now().date(),
                budget=2500.00
            ),
            Trip_Planner.objects.create(
                user=users[4],
                trip_name='Peru Expedition',
                start_date=timezone.now().date(),
                end_date=timezone.now().date(),
                budget=1800.00
            )
        ]

        # Create Trip Planner Details
        trip_planner_details = [
            Trip_Planner_Details.objects.create(
                planner=trip_planners[0],
                destination=destinations[0],
                visit_date=timezone.now().date(),
                notes='Visit temples in the morning'
            ),
            Trip_Planner_Details.objects.create(
                planner=trip_planners[1],
                destination=destinations[1],
                visit_date=timezone.now().date(),
                notes='Evening at Eiffel Tower'
            ),
            Trip_Planner_Details.objects.create(
                planner=trip_planners[2],
                destination=destinations[2],
                visit_date=timezone.now().date(),
                notes='Beach day and temple visit'
            ),
            Trip_Planner_Details.objects.create(
                planner=trip_planners[3],
                destination=destinations[3],
                visit_date=timezone.now().date(),
                notes='Central Park picnic'
            ),
            Trip_Planner_Details.objects.create(
                planner=trip_planners[4],
                destination=destinations[4],
                visit_date=timezone.now().date(),
                notes='Sunrise at Machu Picchu'
            )
        ]

        self.stdout.write(self.style.SUCCESS('Successfully populated database with sample data'))

    def create_hotspots(self):
        # Create hotspots for each destination
        for destination in Destination.objects.all():
            # Cultural & Historical Hotspots
            Hotspots.objects.create(
                destination=destination,
                locationName="Historic City Center",
                category="Cultural & Historical",
                timings="9:00 AM - 6:00 PM",
                rating=4.8,
                hidden_gem=True,
                description="Explore the rich history and architecture of the city center with its ancient buildings and monuments.",
                hotspot_addr="123 Main Street",
                imageUrl="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            )

            # Nature & Outdoor Hotspots
            Hotspots.objects.create(
                destination=destination,
                locationName="Mountain View Park",
                category="Nature & Outdoor",
                timings="6:00 AM - 8:00 PM",
                rating=4.9,
                hidden_gem=False,
                description="A beautiful park with stunning mountain views, perfect for hiking and picnics.",
                hotspot_addr="456 Park Avenue",
                imageUrl="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            )

            # Food & Drink Hotspots
            Hotspots.objects.create(
                destination=destination,
                locationName="Local Food Market",
                category="Food & Drink",
                timings="8:00 AM - 10:00 PM",
                rating=4.7,
                hidden_gem=True,
                description="Experience local cuisine and fresh produce at this vibrant food market.",
                hotspot_addr="789 Market Street",
                imageUrl="https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            )

            # Shopping & Local Goods Hotspots
            Hotspots.objects.create(
                destination=destination,
                locationName="Artisan Village",
                category="Shopping & Local Goods",
                timings="10:00 AM - 7:00 PM",
                rating=4.6,
                hidden_gem=False,
                description="Discover unique handmade crafts and local products in this charming village.",
                hotspot_addr="321 Craft Lane",
                imageUrl="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            )

            # Adventure & Activities Hotspots
            Hotspots.objects.create(
                destination=destination,
                locationName="Adventure Park",
                category="Adventure & Activities",
                timings="9:00 AM - 5:00 PM",
                rating=4.5,
                hidden_gem=True,
                description="Thrilling activities and outdoor adventures for all ages.",
                hotspot_addr="654 Adventure Road",
                imageUrl="https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            ) 