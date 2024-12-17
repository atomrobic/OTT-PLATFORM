import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbars from './Navbars';
import style from './Background.module.css';
import './Movieshowlist.css';
import ControlledCarousel from './ControlledCarousel';

const Movieshowlist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchHistory, setWatchHistory] = useState([]);
  const [ratings, setRatings] = useState({});

// Function to fetch movie ratings
const getMovieRating = async (movieId) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/ratings/update/${movieId}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    // Log the individual rating for the movie
    console.log("Fetched Rating for Movie ID", movieId, ":", response.data.rating);
    return response.data.rating;
  } catch (error) {
    console.error('Error fetching rating for movie:', movieId, error);
    return 0; // Default rating to 0 if unavailable
  }
};


  // Fetch movies, ratings, and watch history
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No token found. Please log in to view movies.');
        setLoading(false);
        return;
      }

      try {
        // Fetch movies
        const moviesResponse = await axios.get('http://127.0.0.1:8000/movies/all/', {
          headers: { Authorization: `Token ${token}` },
        });
        setMovies(moviesResponse.data);

        // Fetch ratings for all movies in parallel
        const ratingsPromises = moviesResponse.data.map((movie) =>
          getMovieRating(movie.id).then((rating) => ({ [movie.id]: rating }))
        );
        const ratingsResults = await Promise.all(ratingsPromises);
        const combinedRatings = ratingsResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setRatings(combinedRatings);

        // Fetch watch history
        const watchHistoryResponse = await axios.get('http://127.0.0.1:8000/watch-history/', {
          headers: { Authorization: `Token ${token}` },
        });
        setWatchHistory(watchHistoryResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load movie data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle adding movies to watch history
  const handleWatchHistory = async (movieId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No access token found.');
      return;
    }

    if (watchHistory.some((movie) => movie.id === movieId)) {
      console.log('Movie already in watch history');
      return;
    }

    try {
      await axios.post(
        'http://127.0.0.1:8000/watch-history/',
        { movie_id: movieId },
        { headers: { Authorization: `Token ${token}` } }
      );
      setWatchHistory((prevHistory) => [...prevHistory, { id: movieId }]);
    } catch (error) {
      console.error('Error adding movie to Watch History:', error);
    }
  };

  // Render star ratings
  const renderStars = (movieId) => {
    const rating = ratings[movieId] || 0; // Default to 0 if rating not found
    const filledStars = Math.floor(rating);
    const emptyStars = 5 - filledStars;

    const stars = [];
    for (let i = 0; i < filledStars; i++) {
      stars.push(<span key={`filled-${i}`} className="star filled">★</span>);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    return stars;
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <Navbars />
        <div className={style.background}>
          <Container>
            <p>Loading movies...</p>
          </Container>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <Navbars />
        <div className={style.background}>
          <Container>
            <p>{error}</p>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbars />
      <ControlledCarousel />
      <div className={style.background}>
        <div className="scrollable-container">
          <div className="movie-cards-container">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <div className="card">
                  <img src={movie.thumbnail} alt={movie.title} className="card-img-top" />
                  <div className="movie-rating-stars">
                  <div className="rating-container">
                  <span className="rating-text">Rating: </span>
                   <span className="rating-stars">{renderStars(movie.id)}</span>
                   </div>                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    <div className="d-flex justify-content-between">
                      <Link to={`/movie/details/${movie.id}`} style={{ textDecoration: 'none' }}>
                        <button className="watch-now-btn" onClick={() => handleWatchHistory(movie.id)}>
                          <p>Watch Now</p>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Movieshowlist;
