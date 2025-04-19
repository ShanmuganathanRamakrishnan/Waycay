from django.core.management.base import BaseCommand
from core.models import Restaurant

class Command(BaseCommand):
    help = 'Updates image URLs for specific restaurants'

    def handle(self, *args, **kwargs):
        # Update Kailash Parbat
        kailash = Restaurant.objects.get(restaurant_id=12)
        kailash.imageUrl = 'kailashParbat.jpg'
        kailash.save()
        self.stdout.write(self.style.SUCCESS(f'Updated image for Kailash Parbat (ID: 12)'))

        # Update Bukhara
        bukhara = Restaurant.objects.get(restaurant_id=11)
        bukhara.imageUrl = 'Bukhara.jpg'
        bukhara.save()
        self.stdout.write(self.style.SUCCESS(f'Updated image for Bukhara (ID: 11)')) 