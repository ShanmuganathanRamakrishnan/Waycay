from django.core.management.base import BaseCommand
from core.models import User, Destination, Restaurant, Hotspots, Likes, Review, Trip_Planner, Trip_Planner_Details

class Command(BaseCommand):
    help = 'Clears all sample data from the database'

    def handle(self, *args, **kwargs):
        # Delete all data from each model
        self.stdout.write('Clearing all sample data...')
        
        # Delete in reverse order of dependencies
        Trip_Planner_Details.objects.all().delete()
        self.stdout.write('Cleared Trip_Planner_Details')
        
        Trip_Planner.objects.all().delete()
        self.stdout.write('Cleared Trip_Planner')
        
        Review.objects.all().delete()
        self.stdout.write('Cleared Reviews')
        
        Likes.objects.all().delete()
        self.stdout.write('Cleared Likes')
        
        Hotspots.objects.all().delete()
        self.stdout.write('Cleared Hotspots')
        
        Restaurant.objects.all().delete()
        self.stdout.write('Cleared Restaurants')
        
        Destination.objects.all().delete()
        self.stdout.write('Cleared Destinations')
        
        # Don't delete the superuser
        User.objects.exclude(is_superuser=True).delete()
        self.stdout.write('Cleared Users (except superuser)')
        
        self.stdout.write(self.style.SUCCESS('Successfully cleared all sample data')) 