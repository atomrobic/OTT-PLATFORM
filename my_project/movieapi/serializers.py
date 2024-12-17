from rest_framework import serializers
from .models import Movie
from .models import WatchLater
from .models import WatchHistory
from .models import Rating

class movieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class WatchLaterSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchLater
        fields = '__all__'
class WatchHistorySerializer(serializers.ModelSerializer):
    # movie_title  = serializers.CharField(source = 'movie.title')
    movie = movieSerializer()
    
    class Meta:
        model = WatchHistory
        fields = '__all__' 

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__' 