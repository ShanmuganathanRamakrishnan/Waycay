from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('explore/', views.explore, name='explore'),
    path('destination/<int:destination_id>/', views.destination_detail, name='destination_detail'),
    path('plan-trip/<int:destination_id>/', views.plan_trip, name='plan_trip'),
    path('my-trips/', views.my_trips, name='my_trips'),
    path('planner/', views.planner, name='planner'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('register/', views.register_view, name='register'),
    path('hotspot/<int:hotspot_id>/', views.hotspot_detail, name='hotspot_detail'),
    path('add-review/<int:hotspot_id>/', views.add_review, name='add_review'),
    path('restaurant/<int:restaurant_id>/', views.restaurant_detail, name='restaurant_detail'),
    path('add-restaurant-review/<int:restaurant_id>/', views.add_restaurant_review, name='add_restaurant_review'),
    path('filter-destinations/', views.filter_destinations, name='filter_destinations'),
    path('like-item/', views.like_item, name='like_item'),
    path('description/<int:id>/<str:type>/', views.description, name='description'),
] 