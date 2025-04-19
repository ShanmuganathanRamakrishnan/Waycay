from django.core.management.base import BaseCommand
from core.models import Hotspots

class Command(BaseCommand):
    help = 'Check hotspots data in the database'

    def handle(self, *args, **options):
        hotspots = Hotspots.objects.all()
        self.stdout.write(f"Total hotspots in database: {hotspots.count()}")
        
        for hotspot in hotspots:
            self.stdout.write(f"\nHotspot ID: {hotspot.hotspot_id}")
            self.stdout.write(f"Name: {hotspot.locationName}")
            self.stdout.write(f"Destination: {hotspot.destination.name}")
            self.stdout.write(f"Category: {hotspot.category}")
            self.stdout.write(f"Rating: {hotspot.rating}")
            self.stdout.write(f"Description: {hotspot.description}")
            self.stdout.write("-" * 50) 