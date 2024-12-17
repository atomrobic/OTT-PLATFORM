from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.forms import UserCreationForm
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from .models import Movie, WatchLater, WatchHistory
from .serializers import movieSerializer, WatchLaterSerializer, WatchHistorySerializer
from rest_framework.views import APIView
from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly
from rest_framework.response import Response
from .models import WatchLater
from .serializers import WatchLaterSerializer
from django.shortcuts import get_object_or_404, redirect
from django.shortcuts import render, redirect
from .models import Movie
from .forms import MovieForm
from django.shortcuts import render, redirect, get_object_or_404
from .models import Movie
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages
from django.shortcuts import render
from .models import Movie
from django.shortcuts import render, redirect
from .forms import MovieForm
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Movie
from .utils import extract_youtube_video_id  # Assuming the function is in a file named utils.py
from django.http import Http404
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.models import User
from .models import Rating, Movie
from .serializers import RatingSerializer
from .models import Movie, Rating
from .serializers import RatingSerializer
from django.db.models import Avg
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication

# Movie List & Create View
@api_view(['GET', 'POST'])
def movie_list_create(request):
    if request.method == 'GET':
        movies = Movie.objects.all()
        serializer = movieSerializer(movies, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = movieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Movie, WatchLater
from rest_framework import status

@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def watch_later_api(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)

    if request.method == 'POST':
        # Add movie to Watch Later
        watch_later, created = WatchLater.objects.get_or_create(user=request.user, movie=movie)
        if created:
            return Response({"message": f"'{movie.title}' has been added to your Watch Later list."}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": f"'{movie.title}' is already in your Watch Later list."}, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        # Remove movie from Watch Later
        watch_later = WatchLater.objects.filter(user=request.user, movie=movie)
        if watch_later.exists():
            watch_later.delete()
            return Response({"message": f"'{movie.title}' has been removed from your Watch Later list."}, status=status.HTTP_200_OK)
        else:
            return Response({"message": f"'{movie.title}' is not in your Watch Later list."}, status=status.HTTP_404_NOT_FOUND)

# Watch History List & Create View
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def watch_history_list_create(request):
    if request.method == 'GET':
        watch_history = WatchHistory.objects.filter(user=request.user)
        serializer = WatchHistorySerializer(watch_history, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        movie_id = request.data.get('movie_id')
        if not movie_id:
            return Response({'error': 'Movie ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        movie = get_object_or_404(Movie, pk=movie_id)

        watch_history = WatchHistory.objects.create(user=request.user, movie=movie)
        serializer = WatchHistorySerializer(watch_history)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

print("*"*50)
# Signup View
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def signup(request):
    form = UserCreationForm(data=request.data)
    if form.is_valid():
        form.save()
        return Response({"message": "Account created successfully"}, status=status.HTTP_201_CREATED)
    return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


# Login View
@csrf_exempt
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_404_NOT_FOUND)
    
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key}, status=status.HTTP_200_OK)


# Movie API View (Requires Authentication)
# Movie API View (Requires Authentication)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def movieapi(request):
    movies = Movie.objects.all()
    serializer = movieSerializer(movies, many=True)
    return Response(serializer.data)

class WatchLaterView(APIView):
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]

    def get_queryset(self):
        return WatchLater.objects.filter(user=self.request.user)

    def get(self, request):
        queryset = self.get_queryset()
        serializer = WatchLaterSerializer(queryset, many=True)
        
        return Response(serializer.data)
    
 
def movie_list(request):
    movies = Movie.objects.all()

    return render(request, 'movie_list.html', {'movies': movies})

def movie_details(request, movie_id):
    print(f"Received movie_id: {movie_id}")  # Debug

    try:
        movie = Movie.objects.get(pk=movie_id)
    except Movie.DoesNotExist:
        # Handle movie not found, return a proper response or error message
        return render(request, '404.html')  # or return HttpResponseNotFound()
    
    return render(request, 'movie_details.html',{'movie': movie}) 
    
# View to edit a movie

def edit_movie(request, movie_id):
    # Fetch the movie object or return 404 if not found
    movie = get_object_or_404(Movie, id=movie_id)
    
    if request.method == 'POST':
        form = MovieForm(request.POST, request.FILES, instance=movie)
        if form.is_valid():
            form.save()  # Save the updated movie details
            return redirect('movielist')  # Redirect to the movie list page
    else:
        form = MovieForm(instance=movie)  # Populate the form with existing data

    return render(request, 'movie_edit.html', {'form': form, 'movie': movie})


# View to delete a movie (confirm deletion via POST)
def delete_movie(request, movie_id):
    movie = get_object_or_404(Movie, pk=movie_id)
    if request.method == 'POST':
        movie.delete()
        return redirect('movie_list')  # Redirect to movie list after deletion
    return render(request, 'delete_movie.html', {'movie': movie})


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('email')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('movie_list')  # Redirect to movie list after successful login
        else:
            messages.error(request, "Invalid email or password.")
    
    return render(request, 'login.html')




# def add_movie(request):
#     if request.method == 'POST':
#         movie_title = request.POST.get('movieTitle')  # Maps to the 'title' field in the model
#         video_url = request.POST.get('videoUrl')     # Maps to the 'video' field in the model
#         image_url = request.POST.get('imageUrl')     # Maps to the 'thumbnail' field in the model
#         description = request.POST.get('description')  # Maps to the 'description' field in the model

#         # Save data to the database
#         Movie.objects.create(
#             title=movie_title,
#             video=video_url,      # Correct field name
#             thumbnail=image_url,  # Correct field name
#             description=description
#         )
#         return redirect('movielist')  # Replace 'success_page' with your desired URL
#     return render(request, 'add_movie.html')


# View for displaying movie details

def add_movie(request):
    if request.method == 'POST':
        movie_title = request.POST.get('movieTitle')  # Maps to the 'title' field in the model
        video_url = request.POST.get('videoUrl')     # Maps to the 'video' field in the model
        image_url = request.POST.get('imageUrl')     # Maps to the 'thumbnail' field in the model
        description = request.POST.get('description')  # Maps to the 'description' field in the model

        # Extract YouTube video ID
        video_id = extract_youtube_video_id(video_url)
        print(video_id)
        if not video_id:
            return render(request, 'add_movie.html', {'error': 'Invalid YouTube URL'})

        # Save data to the database
        Movie.objects.create(
            title=movie_title,
            video=video_id,       # Save the video ID instead of the full URL
            thumbnail=image_url,  # Correct field name
            description=description
        )
        return redirect('movielist')  # Replace 'success_page' with your desired URL
    
    return render(request, 'add_movie.html')




def plans_view(request):
    plans = [
        {
            'name': 'Gold Plan',
            'features': [
                'Unlimited ad-free movies, TV shows, and mobile games',
                'Watch on 2 supported devices at a time',
                'Watch in HD (HD) + HDR',
                'Download on 3 supported devices at a time',
            ]
        },
        {
            'name': 'Premium Plan',
            'features': [
                'Unlimited ad-free movies, TV shows, and mobile games',
                'Watch on 4 supported devices at a time',
                'Watch in 4K (Ultra HD) + HDR',
                'Download on 6 supported devices at a time',
            ]
        },
    ]
    return render(request, 'plan_view.html', {'plans': plans})
  

def user_list(request):
    # Fetch users from the database
    users = User.objects.all()  # Fetch all users, or you can filter as needed

    # Pass the users to the template
    return render(request, 'userlist.html', {'users': users})


WATCH_HISTORY_DATA = {
    1: [  # Example user with ID 1
        ("Trap", "27/03/2024 - 29/03/2024"),
        ("Inception", "01/04/2024 - 03/04/2024"),
    ],
    2: [  # Example user with ID 2
        ("The Matrix", "15/02/2024 - 17/02/2024"),
        ("Avatar", "20/02/2024 - 22/02/2024"),
    ],
}

def user_watch_history(request, user_id):
    # Get the watch history for the user
    watch_history = WATCH_HISTORY_DATA.get(user_id)
    if not watch_history:
        # If no data for user, raise 404 or handle gracefully
        raise Http404("Watch history not found for this user.")

    # Pass the data to the template
    return render(request, 'user_watchhistory.html', {'watch_history': watch_history})

  
@csrf_exempt
def update_user_status(request, user_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            is_active = data.get('is_active')

            user = User.objects.get(id=user_id)
            user.is_active = is_active
            user.save()

            return JsonResponse({'message': 'User status updated successfully.'})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

from django.http import JsonResponse
from .models import WatchLater
from django.contrib.auth.decorators import login_required


from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import WatchLater

@api_view(['GET', 'DELETE'])
def watchs_later_api(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)

    user = request.user

    if request.method == 'GET':
        # Fetch movies that the user has added to Watch Later
        watch_later_movies = WatchLater.objects.filter(user=user).select_related('movie')

        # Prepare the response data (only fetch relevant fields for performance)
        movies_data = [
            {
                'id': watch_later.movie.id,
                'title': watch_later.movie.title,
                'description': watch_later.movie.description,
                'thumbnail': watch_later.movie.thumbnail,
                'video': watch_later.movie.video,
            }
            for watch_later in watch_later_movies
        ]

        return JsonResponse(movies_data, safe=False)

    elif request.method == 'DELETE':
        # Ensure that the movie ID is provided in the request
        movie_id = request.data.get('movie_id')

        if not movie_id:
            return JsonResponse({"error": "Movie ID is required"}, status=400)

        try:
            # Fetch the WatchLater record for the movie and delete it
            watch_later = WatchLater.objects.get(user=user, movie__id=movie_id)
            watch_later.delete()
            return JsonResponse({"message": "Movie removed from Watch Later list"}, status=200)
        except WatchLater.DoesNotExist:
            return JsonResponse({"error": "Movie not found in Watch Later list"}, status=404)
@api_view(['GET'])
def watch_history_api(request):
    # Ensure the user is authenticated
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required"}, status=401)

    # Fetch the watch history of the authenticated user, ordered by the most recent
    try:
        watch_history = WatchHistory.objects.filter(user=request.user).order_by('-watched_at')
    except WatchHistory.DoesNotExist:
        return Response({"error": "No watch history found for this user."}, status=404)

    # Serialize the data (many=True allows multiple entries to be serialized)
    serializer = WatchHistorySerializer(watch_history, many=False)

    # Return the serialized data as a response
    return Response(serializer.data)

@api_view(['GET'])
def movie_details_api(request, movie_id):
    try:
        movie = Movie.objects.get(id=movie_id)  # Fetch the movie by its ID
    except Movie.DoesNotExist:
        return Response({"error": "Movie not found"}, status=404)

    # Serialize the movie data
    serializers = movieSerializer(movie)

    return Response(serializers.data)



@authentication_classes([TokenAuthentication])  # Token authentication required
@permission_classes([IsAuthenticated])          # Ensure the user is authenticated
@api_view(['POST'])
def submit_rating(request, movie_id):
    """Handle rating submission by a user for a movie."""
    
    try:
        # Get the movie object based on the movie_id
        movie = Movie.objects.get(id=movie_id)
    except Movie.DoesNotExist:
        return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Get the rating value from the request data
    rating_value = request.data.get('rating')
    
    if not isinstance(rating_value, int) or rating_value not in [1, 2, 3, 4, 5]:
        return Response({'error': 'Invalid rating value. Please submit a rating between 1 and 5.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if the user has already rated this movie
    existing_rating = Rating.objects.filter(movie=movie, user=request.user).first()
    
    if existing_rating:
        # Update the existing rating
        existing_rating.rating = rating_value
        existing_rating.save()
        message = "Rating updated successfully."
    else:
        # Create a new rating
        Rating.objects.create(movie=movie, user=request.user, rating=rating_value)
        message = "Rating submitted successfully."
    
    # Calculate the updated average rating for the movie
    average_rating = Rating.objects.filter(movie=movie).aggregate(Avg('rating'))['rating__avg']
    total_votes = Rating.objects.filter(movie=movie).count()  # Total number of ratings
    
    # Response with updated data
    return Response({
        'message': message,
        'user_rating': rating_value,
        'average_rating': round(average_rating, 1) if average_rating else None,  # Rounded average
        'total_votes': total_votes,  # Total votes
    }, status=status.HTTP_200_OK)

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Rating  # Make sure to import your Rating model

@permission_classes([IsAuthenticated])
@api_view(['GET', 'POST'])
def movie_rating_view(request, movie_id):
    try:
        user = request.user

        if request.method == 'GET':
            # Fetch the rating for the movie based on movie_id
            rating = Rating.objects.filter(movie_id=movie_id, user=user).first()

            if rating:
                # If rating exists, return the rating value
                return Response({'rating': rating.rating}, status=200)
            else:
                # If no rating is found, return a 404 with a message
                return Response({"detail": "Rating not found"}, status=404)

        elif request.method == 'POST':
            # Get the rating value from the request
            rating_value = request.data.get('rating')

            if rating_value is None:
                return Response({"detail": "Rating value is required."}, status=400)

            # Make sure the rating value is a valid number
            if not isinstance(rating_value, (int, float)) or not (0 <= rating_value <= 5):
                return Response({"detail": "Rating must be a number between 0 and 5."}, status=400)

            # Update or create the rating for the user and movie
            rating, created = Rating.objects.update_or_create(
                movie_id=movie_id, user=user, defaults={'rating': rating_value}
            )

            return Response({'rating': rating.rating}, status=200)

    except Exception as e:
        return Response({"detail": str(e)}, status=500)
