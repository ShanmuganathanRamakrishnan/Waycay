from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True, null=True)
    travel_type = models.CharField(max_length=40, blank=True, null=True)
    preferred_region = models.CharField(max_length=400, blank=True, null=True)
    acc_creation = models.DateField(default=timezone.now)

    def __str__(self):
        return self.username

class Destination(models.Model):
    name = models.CharField(max_length=40)
    location = models.CharField(max_length=300)
    region_type = models.CharField(max_length=40, blank=True, null=True)
    visit_time = models.CharField(max_length=40, blank=True, null=True)
    description = models.CharField(max_length=400, blank=True, null=True)
    avg_cost = models.DecimalField(max_digits=15, decimal_places=5)

    def __str__(self):
        return self.name

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(avg_cost__gte=0), name='check_avg_cost'),
        ]

class Restaurant(models.Model):
    res_name = models.CharField(max_length=40)
    cuisine_type = models.CharField(max_length=40, blank=True, null=True)
    res_location = models.CharField(max_length=300)
    avg_rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    price_range = models.CharField(max_length=20, blank=True, null=True)
    timings = models.CharField(max_length=20, blank=True, null=True)
    res_type = models.CharField(max_length=30, blank=True, null=True)

    def __str__(self):
        return self.res_name

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(avg_rating__gte=0) & models.Q(avg_rating__lte=5), name='check_avg_rating'),
        ]

class Hotspot(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    timings = models.CharField(max_length=30, blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    hidden_gem = models.BooleanField(default=False)
    description = models.CharField(max_length=400, blank=True, null=True)
    hotspot_addr = models.CharField(max_length=300, blank=True, null=True)

    def __str__(self):
        return f"Hotspot {self.id} - {self.destination.name}"

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(rating__gte=0) & models.Q(rating__lte=5), name='check_rating'),
        ]

class Like(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hotspot = models.ForeignKey(Hotspot, on_delete=models.SET_NULL, blank=True, null=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.SET_NULL, blank=True, null=True)

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hotspot = models.ForeignKey(Hotspot, on_delete=models.SET_NULL, blank=True, null=True)
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, blank=True, null=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.SET_NULL, blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)
    comments = models.CharField(max_length=400, blank=True, null=True)
    date = models.DateField()

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(rating__gte=1) & models.Q(rating__lte=5), name='check_review_rating'),
        ]

class TripPlanner(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    trip_name = models.CharField(max_length=30)
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(start_date__lte=models.F('end_date')), name='check_dates'),
            models.CheckConstraint(check=models.Q(budget__gte=0), name='check_budget'),
        ]

    def __str__(self):
        return f"{self.trip_name} - {self.user.username}"

class TripPlannerDetails(models.Model):
    planner = models.ForeignKey(TripPlanner, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.SET_NULL, blank=True, null=True)
    hotspot = models.ForeignKey(Hotspot, on_delete=models.SET_NULL, blank=True, null=True)
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, blank=True, null=True)
    visit_date = models.DateField()
    notes = models.CharField(max_length=350, blank=True, null=True)
