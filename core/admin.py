from django.contrib import admin
from .models import User, Destination, Restaurant, Hotspot, Like, Review, TripPlanner, TripPlannerDetails

admin.site.register(User)
admin.site.register(Destination)
admin.site.register(Restaurant)
admin.site.register(Hotspot)
admin.site.register(Like)
admin.site.register(Review)
admin.site.register(TripPlanner)
admin.site.register(TripPlannerDetails)
