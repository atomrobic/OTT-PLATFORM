# users/urls.py
from django.urls import path
from .views import user_list_api  # Import from the app's views
from .views import MovieRatingView

urlpatterns = [
    path('users/', user_list_api, name='user_list_api'),

]
