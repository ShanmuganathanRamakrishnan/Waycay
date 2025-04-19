from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('explore/', views.explore, name='explore'),
    path('restaurants/', views.restaurants, name='restaurants'),
    path('hotspot/<int:hotspot_id>/', views.hotspot_detail, name='hotspot_detail'),
    path('restaurant/<int:restaurant_id>/', views.restaurant_detail, name='restaurant_detail'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('register/', views.register, name='register'),
    path('planner/', views.planner, name='planner'),
] 