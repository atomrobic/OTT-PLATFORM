# movieapi/models.py
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

class Movie(models.Model):
    title = models.CharField(_("Title"), max_length=100)
    description = models.TextField(_("Description"))
    thumbnail = models.CharField(_("Thumbnail URL"), max_length=255)
    video = models.CharField(_("Video URL"), max_length=255)

    def __str__(self):
        return self.title

class WatchLater(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)

class WatchHistory(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    date_added = models.DateTimeField(("Date Added"), auto_now_add=True)
    
    def __str__(self):
        return f'{self.user} watched {self.movie} on {self.date_added}'
    
      

class Rating(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    rating = models.IntegerField ()
    
    def save_rating(self, movie, user, rating_value):
        """Create or update a rating."""
        if not 1 <= rating_value <= 5:
            raise ValidationError("Rating must be between 1 and 5.")

        # Update or create the rating
        rating, created = Rating.objects.update_or_create(
            movie=movie,
            user=user,
            defaults={'rating': rating_value}
        )
        return rating       