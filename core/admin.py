from django.contrib import admin
from .models import User, Destination, Restaurant, Hotspots, Likes, Review, Trip_Planner, Trip_Planner_Details

admin.site.register(User)
admin.site.register(Destination)
admin.site.register(Restaurant)
admin.site.register(Hotspots)
admin.site.register(Likes)
admin.site.register(Review)
admin.site.register(Trip_Planner)
admin.site.register(Trip_Planner_Details)
