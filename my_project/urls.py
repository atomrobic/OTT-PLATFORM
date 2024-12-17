# my_project/urls.py
from django.contrib import admin
from django.urls import path, include
from movieapi import views  # Only import views from the movieapi app
from movieapi.views import add_movie  # Import from the app


urlpatterns = [
    path('auth/signup/', views.signup, name='signup_api'),
    path('auth/login/', views.login, name='login_api'),
    path('movies/', views.movie_list_create, name='movie_list_create'),
    path('movies/all/', views.movieapi, name='movie_list'),  # For authenticated movie list view
    path('api/watch-later/<int:movie_id>/', views.watch_later_api, name='watch_later_api'),
     path('watch-later/', views.watchs_later_api, name='watch_later_api'),
     path('watchlater/movie/<int:movie_id>/', views.movie_details_api, name='movie-details'),  # For movie details

    # URL patterns for movie management
    path('', views.movie_list, name='movie_list'),
    
    path('movie/<int:movie_id>/', views.movie_details, name='movie_details'),
    
    path('movie/edit/<int:movie_id>/', views.edit_movie, name='edit_movie'),
    path('movie/delete/<int:movie_id>/', views.delete_movie, name='delete_movie'),
    path('login/', views.login_view, name='login'),
    path('add_movie/', add_movie, name='add_movie'),
    path('movielist/', views.movie_list, name='movielist'),  # URL pattern for movie list page
    path('plans/view/', views.plans_view, name='plans_view'),
    
    path('user_list/', views.user_list, name='user_list'),
    path('user_watch_history/<int:user_id>/', views.user_watch_history, name='user_watch_history'),
    path('update_user_status/<int:user_id>/', views.update_user_status, name='update_user_status'),
    path('watch-history/', views.watch_history_list_create, name='watch_history_list'),
    path('api/rating/<int:movie_id>/', views.submit_rating, name='submit_rating'),
    path('api/ratings/update/<int:movie_id>/', views. movie_rating_view, name='update_movie_rating'),

]