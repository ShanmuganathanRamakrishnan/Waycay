from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=40, unique=True)  # user_name in SQL
    email = models.EmailField(max_length=40, unique=True)
    phone = models.CharField(max_length=20)
    travel_type = models.CharField(max_length=40, blank=True, null=True)
    preferred_region = models.CharField(max_length=400, blank=True, null=True)
    acc_creation = models.DateField(default=timezone.now)
    password = models.CharField(max_length=300)  # pwd in SQL

    def __str__(self):
        return self.username

class Destination(models.Model):
    destination_id = models.AutoField(primary_key=True)
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
    restaurant_id = models.AutoField(primary_key=True)
    res_name = models.CharField(max_length=40)
    cuisine_type = models.CharField(max_length=40, blank=True, null=True)
    res_location = models.CharField(max_length=300)
    avg_rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    price_range = models.CharField(max_length=20, blank=True, null=True)
    timings = models.CharField(max_length=20, blank=True, null=True)
    res_type = models.CharField(max_length=30, blank=True, null=True)
    description = models.CharField(max_length=400, blank=True, null=True)
    imageUrl = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.res_name

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(avg_rating__gte=0) & models.Q(avg_rating__lte=5), name='check_avg_rating'),
        ]

class Hotspots(models.Model):
    hotspot_id = models.AutoField(primary_key=True)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    locationName = models.CharField(max_length=100, blank=True, null=True)
    category = models.CharField(max_length=50, blank=True, null=True)
    timings = models.CharField(max_length=30, blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    hidden_gem = models.BooleanField(default=False)
    description = models.CharField(max_length=400, blank=True, null=True)
    hotspot_addr = models.CharField(max_length=300, blank=True, null=True)
    imageUrl = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"Hotspot {self.hotspot_id} - {self.destination.name}"

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(rating__gte=0) & models.Q(rating__lte=5), name='check_rating'),
        ]

class Likes(models.Model):
    like_id = models.AutoField(primary_key=True)
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hotspot = models.ForeignKey(Hotspots, on_delete=models.SET_NULL, blank=True, null=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f"Like {self.like_id} by {self.user.username}"

class Review(models.Model):
    review_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hotspot = models.ForeignKey(Hotspots, on_delete=models.SET_NULL, blank=True, null=True)
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, blank=True, null=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.SET_NULL, blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)
    comments = models.CharField(max_length=400, blank=True, null=True)
    date = models.DateField()

    def __str__(self):
        return f"Review {self.review_id} by {self.user.username}"

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(rating__gte=1) & models.Q(rating__lte=5), name='check_review_rating'),
        ]

class Trip_Planner(models.Model):
    planner_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    trip_name = models.CharField(max_length=30)
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f"{self.trip_name} - {self.user.username}"

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(start_date__lte=models.F('end_date')), name='check_dates'),
            models.CheckConstraint(check=models.Q(budget__gte=0), name='check_budget'),
        ]

class Trip_Planner_Details(models.Model):
    planner_details_id = models.AutoField(primary_key=True)
    planner = models.ForeignKey(Trip_Planner, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.SET_NULL, blank=True, null=True)
    hotspot = models.ForeignKey(Hotspots, on_delete=models.SET_NULL, blank=True, null=True)
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, blank=True, null=True)
    visit_date = models.DateField()
    notes = models.CharField(max_length=350, blank=True, null=True)

    def __str__(self):
        return f"Detail {self.planner_details_id} for {self.planner.trip_name}" 