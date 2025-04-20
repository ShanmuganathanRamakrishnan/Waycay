"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from core import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
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
    path('like/', views.like_destination, name='like_destination'),
    path('description/<int:id>/<str:type>/', views.description, name='description'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

