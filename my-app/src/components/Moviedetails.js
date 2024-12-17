import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Moviedetails.css';
import Navbars from './Navbars';
import style from './Background.module.css';
import details from './moviedetails.module.css';

const Moviedetails = () => {
  const { movieId } = useParams(); // Get the movie ID from the route parameter
  const [movie, setMovie] = useState(null); // State to store movie details
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(false); // State for error status
  const [watchLaterExists, setWatchLaterExists] = useState(false); // Check if movie is in Watch Later
  const [ratings, setRatings] = useState({}); // Store ratings for each movie
  const [isPlaying, setIsPlaying] = useState(false); // State for play/pause toggle

  // Fetch movie details and user's rating
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        console.error('No access token found.');
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8000/watchlater/movie/${movieId}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  const handleRatingChange = async (newRating) => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error('No access token found.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/rating/${movieId}/`,
        { rating: newRating },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      // Update the rating in the state after successful submission
      setRatings((prevRatings) => ({
        ...prevRatings,
        [movieId]: newRating,
      }));

      alert(response.data.message); // Show success message
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const handleWatchLater = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error('No access token found.');
      return;
    }

    if (watchLaterExists) {
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/api/watch-later/${movieId}/`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setWatchLaterExists(true); // Update state after adding to Watch Later
    } catch (error) {
      console.error('Error adding movie to Watch Later:', error);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying); // Toggle play/pause state
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !movie) {
    return <div>Error fetching movie details. Please try again later.</div>;
  }

  // Calculate the rating to display stars (5 stars max)
  const rating = ratings[movieId] || 0;
  const filledStars = Math.floor(rating); // Number of filled stars (rounded down)
  const emptyStars = 5 - filledStars; // Number of empty stars

  return (
    <>
      <Navbars />
      <div className={style.background}>
        <div className={`${details.background} container mt-4`}>
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{movie?.title || 'Title not available'}</h5>

              {/* Embed YouTube video with play/pause functionality */}
              <div className="video-container">
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${movie.video}?autoplay=${isPlaying ? 1 : 0}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="card-text">{movie?.description || 'Description not available'}</p>

              {/* Rating Section */}
              <div className="star-rating mt-3">
                <p>Rate this movie:</p>
                {/* Display stars based on the rating */}
                {[...Array(filledStars)].map((_, i) => (
                  <span
                    key={`filled-${i}`}
                    className="star filled"
                    onClick={() => handleRatingChange(i + 1)}
                  >
                    ★
                  </span>
                ))}
                {[...Array(emptyStars)].map((_, i) => (
                  <span
                    key={`empty-${i}`}
                    className="star empty"
                    onClick={() => handleRatingChange(filledStars + i + 1)}
                  >
                    ★
                  </span>
                ))}

                <p>Your rating: {ratings[movieId] || 0}/5</p> {/* Numerical rating */}
              </div>

              {/* Watch Later Button */}
              <div className="mt-3 d-flex justify-content-between">
                <button className="watchLater-button" onClick={handleWatchLater}>
                  Add to Watch Later
                </button>

                {/* Play/Pause Button */}
                <button className="btns " onClick={togglePlayPause}>
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Moviedetails;
